<template>
  <v-layout row wrap align-center>
    <v-flex xs12>
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
      <v-flex xs12 sm12 class="card-container">
        <v-card>
          <v-row justify="space-around">
            <v-col style="text-align: left;margin-left: 10px">
              {{
                isNaN(state.ownSpeed) || state.ownSpeed === null
                  ? '計測不能'
                  : state.ownSpeed
              }}
            </v-col>
            <v-col style="text-align: center">
              {{ compute.result.value }}
            </v-col>
            <v-col style="text-align: right;margin-right: 10px">
              {{
                isNaN(state.opponentSpeed) || state.opponentSpeed === null
                  ? '計測不能'
                  : state.opponentSpeed
              }}
            </v-col>
          </v-row>
        </v-card>
      </v-flex>
    </v-footer>
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
        if (
          isNaN(state.ownSpeed) ||
          state.ownSpeed === null ||
          isNaN(state.opponentSpeed) ||
          state.opponentSpeed === null
        ) {
          return '計測不能'
        }
        const ownSpeed = Number(state.ownSpeed)
        const opponentSpeed = Number(state.opponentSpeed)
        let result = '同速'
        if (ownSpeed > opponentSpeed) {
          result = '速い'
        } else if (opponentSpeed > ownSpeed) {
          result = '遅い'
        }
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
