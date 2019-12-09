<template>
  <div>
    <v-icon
      @click="props.onClickMinusButton()"
      large
      color="rgba(255, 255, 255, 0.7)"
      class="pt-1"
    >
      {{ props.enableMinusButton ? 'mdi-minus-box' : 'mdi-minus-box-outline' }}
    </v-icon>
    <v-icon
      @click="props.onClickPlusButton()"
      color="rgba(255, 255, 255, 0.7)"
      large
      class="pt-1"
    >
      {{ props.enablePlusButton ? 'mdi-plus-box' : 'mdi-plus-box-outline' }}
    </v-icon>
  </div>
</template>

<script>
import { createComponent } from '@vue/composition-api'

export default createComponent({
  props: {
    enableMinusButton: {
      type: Boolean,
      default: false
    },
    enablePlusButton: {
      type: Boolean,
      default: false
    },
    onClickMinusButton: {
      type: Function,
      default: () => {}
    },
    onClickPlusButton: {
      type: Function,
      default: () => {}
    }
  },
  setup(props, ctx) {
    return {
      props
    }
  }
})
</script>
