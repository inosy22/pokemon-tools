<template>
  <v-layout row wrap align-center>
    <v-flex xs12>
      <h2>ポケモン素早さチェッカーfor剣盾</h2>
    </v-flex>
    <v-flex xs12 sm6 class="card-container">
      <CalculatorCard :title="`自分のポケモン`" />
    </v-flex>
    <v-flex xs12 sm6 class="card-container">
      <CalculatorCard :title="`相手のポケモン`" />
    </v-flex>
    <v-flex xs12 class="card-container">
      <v-card>
        <v-card-title>
          子コンポーネントから計算結果を `emit`
          で受け取って、ここに比較結果を入れれば終わり！
        </v-card-title>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style scoped>
.card-container {
  padding: 5px;
}
</style>

<script>
import { createComponent } from '@vue/composition-api'
import CalculatorCard from '~/components/speed_checker/CalculatorCard'

export default createComponent({
  components: {
    CalculatorCard
  },
  setup() {}
})
</script>
