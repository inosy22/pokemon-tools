<template>
  <v-layout row wrap align-center>
    <v-flex xs12>
      <h2>ポケモン素早さチェッカー for 剣盾</h2>
    </v-flex>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title>自分のポケモン</v-card-title>
        <v-card-text>
          <div>
            <v-combobox
              v-model="state.myPokemon"
              :items="pokemonsForSearch"
              label="ポケモン"
            />
          </div>
          <div>
            <v-radio-group
              v-model="state.myNatureCorrection"
              label="性格補正"
              row
            >
              <v-radio label="上昇" value="1.1" color="white" />
              <v-radio label="なし" value="1.0" color="white" />
              <v-radio label="下降" value="0.9" color="white" />
            </v-radio-group>
          </div>
          <div>
            <v-combobox
              v-model="state.myEffortValue"
              :items="effortValueInputs"
              label="努力値"
            />
          </div>
          <div>
            <v-checkbox
              v-model="state.myHasScarf"
              label="こだわりスカーフ"
              color="white"
            />
            <v-checkbox
              v-model="state.myIsParalysis"
              label="まひ状態"
              color="white"
            />
          </div>
          <div>
            <v-select
              v-model="state.myRank"
              :items="rankItems"
              label="補正ランク"
            />
          </div>
        </v-card-text>
        <v-card-subtitle>
          素早さ実数値: {{ compute.mySpeed.value }}
        </v-card-subtitle>
      </v-card>
    </v-flex>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title>相手のポケモン</v-card-title>
        <v-card-text>
          <v-combobox :items="pokemonsForSearch" />
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { createComponent, computed, reactive } from '@vue/composition-api'

const MinEffortValue = 0
const MaxEffortValue = 252
const MinRank = -6
const MaxRank = 6

/**
 * カタカナからひらがなに変換
 * (IncrementalSearch用)
 *
 * @param str 対象のカタカナの文字列
 */
function kanaToHira(str) {
  return str.replace(/[\u30A1-\u30F6]/g, function(match) {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

/**
 * 素早さ実数値計算
 *
 * @param baseStats (素早さの)種族値
 * @param natureCorrection 性格補正値
 * @param effortValue 努力値
 * @param level レベル
 */
function calcSpeed(
  baseStats,
  natureCorrection,
  effortValue,
  level,
  rank,
  hasScarf,
  isParalysis
) {
  let actualStats = Math.floor(
    ((baseStats * 2 + 31 + effortValue / 4) * (level / 100) + 5) *
      natureCorrection
  )
  if (hasScarf) {
    actualStats = Math.floor(actualStats * 1.5)
  }
  if (rank > 0) {
    actualStats = Math.floor((actualStats * (rank + 2)) / 2)
  } else if (rank < 0) {
    actualStats = Math.floor((actualStats * 2) / (Math.abs(rank) + 2))
  }
  if (isParalysis) {
    actualStats = Math.floor(actualStats / 2)
  }
  return actualStats
}

/**
 * VueComponent
 */
export default createComponent({
  setup() {
    // reactive properties
    const state = reactive({
      myPokemon: '',
      myNatureCorrection: '1.1',
      myLevel: '50',
      myEffortValue: '252',
      myRank: '0',
      myHasScarf: false,
      myIsParalysis: false
    })

    // computed properties
    const compute = {
      mySpeed: computed(() => {
        // v-comboboxの初期値と変更されたあとの値の型が一致しないので凌ぎの実装
        if (state.myPokemon === null || state.myPokemon === '') {
          return ''
        }
        const ev =
          typeof state.myEffortValue === 'object'
            ? state.myEffortValue.value
            : state.myEffortValue
        return calcSpeed(
          Number(state.myPokemon.value),
          Number(state.myNatureCorrection),
          Number(ev),
          Number(state.myLevel),
          Number(state.myRank),
          state.myHasScarf,
          state.myIsParalysis
        )
      })
    }

    // load json
    const pokemons = require('~/assets/data/pokemon.json')

    // create incremental search pokemon items
    const pokemonsForSearch = []
    pokemons.forEach((value) => {
      pokemonsForSearch.push({
        text: `${value.name} (S:${value.s}) ${kanaToHira(value.name)}`,
        value: `${value.s}`
      })
    })

    // create incremental search ev items
    const effortValueInputs = [
      {
        text: MaxEffortValue,
        value: MaxEffortValue
      }
    ]
    for (let ev = MinEffortValue; ev < MaxEffortValue; ev += 4) {
      effortValueInputs.push({
        text: ev,
        value: ev
      })
    }

    // create rank items
    const rankItems = []
    for (let rank = MinRank; rank <= MaxRank; rank++) {
      let rankStr = String(rank)
      if (rank > 0) {
        rankStr = '+' + rankStr
      }
      rankItems.push(rankStr)
    }

    return {
      state,
      compute,
      pokemonsForSearch,
      effortValueInputs,
      rankItems
    }
  }
})
</script>
