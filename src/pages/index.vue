<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div>
        <p>{{ reactiveValue }}</p>
        <p>{{ computedValue }}</p>
      </div>
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

    return {
      reactiveValue,
      computedValue
    }
  }
})
</script>
