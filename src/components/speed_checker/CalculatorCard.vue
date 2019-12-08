<template>
  <v-card>
    <v-card-title>{{ props.title }}</v-card-title>
    <v-card-text>
      <div>
        <v-combobox
          v-model="state.pokemonName"
          :items="pokemonsForSearch"
          :error="compute.speed.value === '???'"
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
        <v-col class="pr-5">
          <v-combobox
            v-model="state.effortValue"
            :items="effortValueInputs"
            label="努力値"
            dense
          />
        </v-col>
        <v-col class="pr-5">
          <v-select
            v-model="state.rank"
            :items="rankItems"
            label="補正ランク"
            dense
          />
        </v-col>
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
        // ポケモンが存在しなければ計算不能 (要リファクタリング)
        const trimedName = state.pokemonName.split('/')[0].trim()
        if (pokemons[trimedName] === undefined) {
          return '???'
        }
        let speed = '???'
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
        // ポケモンが存在しなければ計算不能 (要リファクタリング)
        const trimedName = state.pokemonName.split('/')[0].trim()
        if (pokemons[trimedName] === undefined) {
          return '???'
        }
        return pokemons[trimedName].s
      })
    }

    // create incremental search pokemon items
    const pokemonsForSearch = []
    Object.keys(pokemons).forEach((val) => {
      const hira = kanaToHira(val)
      pokemonsForSearch.push(`${val} / ${hira}`)
    })

    // create incremental search ev items
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
      props,
      state,
      compute,
      pokemonsForSearch,
      effortValueInputs,
      rankItems
    }
  }
})
</script>
