<template>
  <v-card>
    <v-card-title>{{ props.title }}</v-card-title>
    <v-card-text>
      <div>
        <v-combobox
          v-model="state.pokemonName"
          :items="pokemonsForSearch"
          :error="compute.speed.value === '???'"
          @click:clear="clearText"
          clear-icon="mdi-close-circle"
          clearable
          autocomplete="off"
          label="ポケモン"
          dense
        />
      </div>
      <v-row no-gutters>
        <v-col>
          <strong style="font-size: 1.1rem; color: white;">
            実数値: {{ compute.speed.value }}
          </strong>
        </v-col>
        <v-col>
          <span style="font-size: 1.1rem">
            種族値: {{ compute.speedBaseStats.value }}
          </span>
        </v-col>
      </v-row>
      <div>
        <v-radio-group v-model="state.natureCorrection" label="性格補正" row>
          <v-radio label="上昇" value="1" color="white" />
          <v-radio label="なし" value="0" color="white" />
          <v-radio label="下降" value="-1" color="white" />
        </v-radio-group>
      </div>
      <v-row no-gutters>
        <v-flex xs3>
          <v-combobox
            v-model="state.effortValue"
            :items="effortValueInputs"
            label="努力値"
            dense
          />
        </v-flex>
        <v-flex xs3>
          <PlusMinusButton
            :enable-minus-button="
              compute.enableDecrementEffortValueButton.value
            "
            :enable-plus-button="compute.enableIncrementEffortValueButton.value"
            :on-click-minus-button="
              () => {
                changeEffortValue(-1)
              }
            "
            :on-click-plus-button="
              () => {
                changeEffortValue(+1)
              }
            "
          />
        </v-flex>
        <v-flex xs3 class="pr-1">
          <v-select
            v-model="state.rank"
            :items="rankItems"
            label="補正ランク"
            dense
          />
        </v-flex>
        <v-flex xs3>
          <PlusMinusButton
            :enable-minus-button="compute.enableDecrementRankButton.value"
            :enable-plus-button="compute.enableIncrementRankButton.value"
            :on-click-minus-button="
              () => {
                changeRank(-1)
              }
            "
            :on-click-plus-button="
              () => {
                changeRank(+1)
              }
            "
          />
        </v-flex>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-checkbox
            v-model="state.hasScarf"
            label="スカーフ (×1.5)"
            color="white"
          />
        </v-col>
        <v-col>
          <v-checkbox
            v-model="state.isParalysis"
            label="まひ状態 (×0.5)"
            color="white"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <v-checkbox
            v-model="state.isActiveTailwind"
            label="おいかぜ (×2.0)"
            color="white"
          />
        </v-col>
        <v-col>
          <v-checkbox
            v-model="state.isActiveWeather"
            label="天候特性 (×2.0)"
            color="white"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { createComponent, computed, reactive } from '@vue/composition-api'
import BaseStatsCalculator from '~/lib/pokemon/BaseStatsCalculator'
import SpeedStatsCalculator from '~/lib/pokemon/SpeedStatsCalculator'
import PlusMinusButton from '~/components/speed-checker/PlusMinusButton'

/**
 * カタカナからひらがなに変換
 * (IncrementalSearch用)
 *
 * @param {String} str 対象のカタカナの文字列
 */
function kanaToHira(str) {
  return str.replace(/[\u30A1-\u30F6]/g, function(match) {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

/**
 * 補正ランクを数値から表示用の文字列へ変換
 *
 * @param {Number} rankNum 補正ランクの数値
 */
function rankNumToStr(rankNum) {
  let rankStr = String(rankNum)
  if (rankNum > 0) {
    rankStr = '+' + rankStr
  }
  return rankStr
}

/**
 * ポケモン名のトリミング
 *
 * @param {String|null|undefined} inputPokemonName 入力されたポケモン名
 * @param {Object} pokemonNameMap
 * @return {String|null} 存在しない場合はnull, 存在すればポケモン名を返す
 */
function trimPokemonName(inputPokemonName, pokemonNameMap) {
  if (inputPokemonName === null || inputPokemonName === undefined) {
    return null
  }
  const trimedName = inputPokemonName.split('/')[0].trim()
  if (pokemonNameMap[trimedName] === undefined) {
    return null
  }
  return trimedName
}

/**
 * VueComponent
 */
export default createComponent({
  props: {
    title: {
      type: String,
      default: ''
    },
    calculatedSpeed: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    PlusMinusButton
  },
  setup(props, ctx) {
    // load json
    const pokemons = require('~/assets/data/pokemon.json')

    // reactive properties
    const state = reactive({
      pokemonName: '',
      natureCorrection: '1',
      level: '50',
      effortValue: '252',
      rank: '0',
      hasScarf: false,
      isParalysis: false,
      isActiveTailwind: false,
      isActiveWeather: false
    })

    // computed properties
    const compute = {
      speed: computed(() => {
        let speed = '???'
        const trimedName = trimPokemonName(state.pokemonName, pokemons)
        if (trimedName === null) {
          return speed
        }
        try {
          const speedStatsCalculator = new SpeedStatsCalculator()
          speedStatsCalculator.setBaseStats(pokemons[trimedName].s)
          speedStatsCalculator.setNatureCorrection(state.natureCorrection)
          speedStatsCalculator.setEffortValue(state.effortValue)
          speedStatsCalculator.setLevel(state.level)
          speedStatsCalculator.setRank(state.rank)
          speedStatsCalculator.setHasScarf(state.hasScarf)
          speedStatsCalculator.setIsParalysis(state.isParalysis)
          speedStatsCalculator.setIsActiveTailwind(state.isActiveTailwind)
          speedStatsCalculator.setIsActiveWeather(state.isActiveWeather)
          speed = speedStatsCalculator.calc()
          props.calculatedSpeed(speed) // 親への連携
        } catch (e) {}
        return speed
      }),
      speedBaseStats: computed(() => {
        const trimedName = trimPokemonName(state.pokemonName, pokemons)
        if (trimedName === null) {
          return '???'
        }
        return pokemons[trimedName].s
      }),
      enableDecrementEffortValueButton: computed(() => {
        return Number(state.effortValue) > BaseStatsCalculator.MinEffortValue
      }),
      enableIncrementEffortValueButton: computed(() => {
        return Number(state.effortValue) < BaseStatsCalculator.MaxEffortValue
      }),
      enableDecrementRankButton: computed(() => {
        return Number(state.rank) > BaseStatsCalculator.MinRank
      }),
      enableIncrementRankButton: computed(() => {
        return Number(state.rank) < BaseStatsCalculator.MaxRank
      })
    }

    // create incremental search pokemon items
    const pokemonsForSearch = []
    Object.keys(pokemons).forEach((val) => {
      const hira = kanaToHira(val)
      pokemonsForSearch.push(`${val} / ${hira}`)
    })

    // create incremental search ev items (Lv.50)
    const effortValueInputs = [
      BaseStatsCalculator.MaxEffortValue,
      BaseStatsCalculator.MinEffortValue
    ]
    for (
      let ev = BaseStatsCalculator.LittleEffortValue;
      ev < BaseStatsCalculator.MaxEffortValue;
      ev += BaseStatsCalculator.IntervalEffortValue
    ) {
      effortValueInputs.push(String(ev))
    }

    /**
     * changeEffortValueボタンが押された時の動作 (Lv.50)
     *
     * @param {Number} changeValue 努力値の変更値
     */
    const changeEffortValue = (changeValue) => {
      const beforeEffortValueNum = Number(state.effortValue)
      if (
        (beforeEffortValueNum <= BaseStatsCalculator.MinEffortValue &&
          changeValue < 0) ||
        (BaseStatsCalculator.MaxEffortValue <= beforeEffortValueNum &&
          changeValue > 0)
      ) {
        return
      }
      // 値変更の間隔を計算 (Lv.50の時、0,4,12,20...)
      let interval
      if (
        (beforeEffortValueNum === BaseStatsCalculator.LittleEffortValue &&
          changeValue < 0) ||
        (beforeEffortValueNum === BaseStatsCalculator.MinEffortValue &&
          changeValue > 0)
      ) {
        interval = changeValue * BaseStatsCalculator.LittleEffortValue
      } else {
        interval = changeValue * BaseStatsCalculator.LittleEffortValue * 2
      }
      state.effortValue = String(beforeEffortValueNum + interval)
    }

    // create rank items
    const rankItems = []
    for (
      let rank = BaseStatsCalculator.MaxRank;
      rank >= BaseStatsCalculator.MinRank;
      rank--
    ) {
      rankItems.push(rankNumToStr(rank))
    }

    /**
     * changeRankボタンが押された時の動作
     *
     * @param {Number} interval 補正ランクの振れ幅
     */
    const changeRank = (interval) => {
      const beforeRankNum = Number(state.rank)
      if (
        (beforeRankNum <= BaseStatsCalculator.MinRank && interval < 0) ||
        (BaseStatsCalculator.MaxRank <= beforeRankNum && interval > 0)
      ) {
        return
      }
      const rankNum = beforeRankNum + interval
      state.rank = rankNumToStr(rankNum)
    }

    const clearText = () => {
      state.pokemonName = ''
    }

    return {
      props,
      state,
      compute,
      pokemonsForSearch,
      effortValueInputs,
      rankItems,
      changeRank,
      changeEffortValue,
      clearText
    }
  }
})
</script>
