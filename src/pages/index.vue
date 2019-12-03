<template>
  <v-layout row wrap align-center>
    <v-flex xs12>
      <h2>ポケモン素早さチェッカー for 剣盾</h2>
    </v-flex>
    <v-flex xs12 sm6>
      <v-card>
        <v-card-title>自分のポケモン</v-card-title>
        <v-card-text>
          <v-combobox :items="pokemonsForSearch" />
        </v-card-text>
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
import {
  createComponent,
  computed,
  reactive,
  onMounted
} from '@vue/composition-api'

function kanaToHira(str) {
  return str.replace(/[\u30A1-\u30F6]/g, function(match) {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

export default createComponent({
  setup() {
    const reactiveValue = reactive('reactive value')

    // computed property
    const computedValue = computed(() => `${reactiveValue} + computedValue`)

    // created メソッド
    console.log('created')

    // mounted メソッド
    onMounted(() => {
      console.log('mounted')
    })
    const pokemons = require('~/assets/data/pokemon.json')
    const pokemonsForSearch = []
    pokemons.forEach((value) => {
      const pokemon = {
        text: `${value.name} (S:${value.s}) ${kanaToHira(value.name)}`,
        value: `${value.name}`
      }
      pokemonsForSearch.push(pokemon)
    })

    return {
      reactiveValue,
      computedValue,
      pokemonsForSearch
    }
  }
})
</script>
