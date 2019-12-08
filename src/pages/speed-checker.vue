<template>
  <v-layout row wrap align-center>
    <v-flex xs12 style="text-align: center">
      <h2>ポケモン素早さ比較 for 剣盾</h2>
    </v-flex>
    <v-flex xs12 sm6 class="card-container">
      <CalculatorCard
        :title="`自分のポケモン`"
        :calculated-speed="calculatedOwnSpeed"
      />
    </v-flex>
    <v-flex xs12 sm6 class="card-container">
      <CalculatorCard
        :title="`相手のポケモン`"
        :calculated-speed="calculatedOpponentSpeed"
      />
    </v-flex>
    <!-- スマホの場合だけ、固定フッターにする -->
    <v-footer :fixed="$vuetify.breakpoint.xs" width="100%">
      <v-flex xs12 sm12>
        <v-progress-linear
          :value="compute.result.value.percentage"
          color="amber"
          height="40"
          reactive
        >
          <v-row algin="center" justify="space-between">
            <v-col
              style="text-align: left; margin-left: 10px; font-size: 1.2rem; color: black;"
            >
              <strong>{{ state.ownSpeed }}</strong>
            </v-col>
            <v-col style="text-align: center;" cols="6">
              <strong
                :style="
                  `color: ${compute.result.value.color}; font-size: 1.2rem;`
                "
              >
                {{ compute.result.value.text }} ({{
                  compute.result.value.competition
                }}倍)
              </strong>
            </v-col>
            <v-col
              style="text-align: right; margin-right: 10px; font-size: 1.2rem;"
            >
              <strong>{{ state.opponentSpeed }}</strong>
            </v-col>
          </v-row>
        </v-progress-linear>
      </v-flex>
    </v-footer>
    <v-flex xs12 style="text-align: center">
      ※ポケモンはLv.50を想定しています
    </v-flex>
  </v-layout>
</template>

<style scoped>
.card-container {
  padding: 5px;
}
</style>

<script>
import { createComponent, reactive, computed } from '@vue/composition-api'
import CalculatorCard from '~/components/speed_checker/CalculatorCard'

export default createComponent({
  components: {
    CalculatorCard
  },
  setup() {
    const state = reactive({
      ownSpeed: null,
      opponentSpeed: null
    })
    const compute = {
      result: computed(() => {
        const result = {
          text: '計測不能',
          color: 'white',
          percentage: 0,
          competition: 0
        }
        if (
          isNaN(state.ownSpeed) ||
          state.ownSpeed === null ||
          isNaN(state.opponentSpeed) ||
          state.opponentSpeed === null
        ) {
          return result
        }
        const ownSpeed = Number(state.ownSpeed)
        const opponentSpeed = Number(state.opponentSpeed)
        if (ownSpeed > opponentSpeed) {
          result.text = '速い！'
          result.color = '#880000'
        } else if (opponentSpeed > ownSpeed) {
          result.text = '遅い...'
          result.color = 'white'
        } else {
          result.text = '同速'
          result.color = 'black'
        }
        result.percentage = Math.round(
          (ownSpeed / (ownSpeed + opponentSpeed)) * 100
        )
        result.competition = Math.floor((ownSpeed / opponentSpeed) * 100) / 100
        return result
      })
    }
    const calculatedOwnSpeed = (speed) => {
      state.ownSpeed = speed
    }
    const calculatedOpponentSpeed = (speed) => {
      state.opponentSpeed = speed
    }
    return {
      state,
      compute,
      calculatedOwnSpeed,
      calculatedOpponentSpeed
    }
  }
})
</script>
