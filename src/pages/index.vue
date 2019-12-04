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
              v-model="state.myPokemonName"
              :items="pokemonsForSearch"
              label="ポケモン"
              dense
            />
          </div>
          <div>
            <v-radio-group
              v-model="state.myNatureCorrection"
              label="性格補正"
              row
            >
              <v-radio label="上昇" value="1" color="white" />
              <v-radio label="なし" value="0" color="white" />
              <v-radio label="下降" value="-1" color="white" />
            </v-radio-group>
          </div>
          <div>
            <v-combobox
              v-model="state.myEffortValue"
              :items="effortValueInputs"
              label="努力値"
              dense
            />
          </div>
          <div>
            <v-select
              v-model="state.myRank"
              :items="rankItems"
              label="補正ランク"
              dense
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
            <v-checkbox
              v-model="state.myIsActiveTailwind"
              label="おいかぜ"
              color="white"
            />
            <v-checkbox
              v-model="state.myIsActiveWeather"
              label="天候の特性での補正"
              color="white"
            />
          </div>
        </v-card-text>
        <v-card-subtitle>
          <h3>素早さ実数値: {{ compute.mySpeed.value }}</h3>
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
import BaseStatsCalculator from '~/lib/pokemon/BaseStatsCalculator'
import SpeedStatsCalculator from '~/lib/pokemon/SpeedStatsCalculator'

/**
 * カタカナからひらがなに変換
 * (IncrementalSearch用)
 *
 * @param str 対象のカタカナの文字列
 */
// function kanaToHira(str) {
//   return str.replace(/[\u30A1-\u30F6]/g, function(match) {
//     const chr = match.charCodeAt(0) - 0x60
//     return String.fromCharCode(chr)
//   })
// }

/**
 * VueComponent
 */
export default createComponent({
  setup() {
    // load json
    const pokemons = require('~/assets/data/pokemon.json')

    // reactive properties
    const state = reactive({
      myPokemonName: '',
      myNatureCorrection: '1',
      myLevel: '50',
      myEffortValue: '252',
      myRank: '0',
      myHasScarf: false,
      myIsParalysis: false,
      myIsActiveTailwind: false,
      myIsActiveWeather: false
    })

    // computed properties
    const compute = {
      mySpeed: computed(() => {
        // ポケモンが存在しなければ計算不能
        if (pokemons[state.myPokemonName] === undefined) {
          return '???'
        }
        const speedStatsCalculator = new SpeedStatsCalculator()
        speedStatsCalculator.setBaseStats(pokemons[state.myPokemonName].s)
        speedStatsCalculator.setNatureCorrection(state.myNatureCorrection)
        speedStatsCalculator.setEffortValue(state.myEffortValue)
        speedStatsCalculator.setLevel(state.myLevel)
        speedStatsCalculator.setRank(state.myRank)
        speedStatsCalculator.setHasScarf(state.myHasScarf)
        speedStatsCalculator.setIsParalysis(state.myIsParalysis)
        speedStatsCalculator.setIsActiveTailwind(state.myIsActiveTailwind)
        speedStatsCalculator.setIsActiveWeather(state.myIsActiveWeather)
        return speedStatsCalculator.calc()
      })
    }

    // create incremental search pokemon items
    const pokemonsForSearch = Object.keys(pokemons)

    // create incremental search ev items
    const effortValueInputs = [BaseStatsCalculator.MaxEffortValue]
    for (
      let ev = BaseStatsCalculator.MinEffortValue;
      ev < BaseStatsCalculator.MaxEffortValue;
      ev += 4
    ) {
      effortValueInputs.push(String(ev))
    }

    // create rank items
    const rankItems = []
    for (
      let rank = BaseStatsCalculator.MaxRank;
      rank >= BaseStatsCalculator.MinRank;
      rank--
    ) {
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
