import { mount } from '@vue/test-utils'
import CalculatorCard from '@/components/speed-checker/CalculatorCard.vue'

describe('CalculatorCard', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(CalculatorCard, {
      propsData: {
        title: 'test'
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
