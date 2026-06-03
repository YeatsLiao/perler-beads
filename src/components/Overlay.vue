<template>
  <view v-if="visible" class="overlay" :class="{ 'overlay-show': show }" @click="onClick">
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: boolean
  zIndex?: number
  closable?: boolean
}>(), {
  modelValue: false,
  zIndex: 1000,
  closable: true
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  click: []
}>()

const visible = ref(false)
const show = ref(false)

watch(() => props.modelValue, (val) => {
  if (val) {
    visible.value = true
    setTimeout(() => { show.value = true }, 50)
  } else {
    show.value = false
    setTimeout(() => { visible.value = false }, 300)
  }
}, { immediate: true })

function onClick() {
  if (props.closable) {
    emit('update:modelValue', false)
  }
  emit('click')
}
</script>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $color-overlay;
  z-index: v-bind(zIndex);
  opacity: 0;
  transition: opacity $transition-normal;
}

.overlay-show {
  opacity: 1;
}
</style>