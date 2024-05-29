<script setup>
  import { computed } from 'vue'
  import icon from '@/UI/icons.js'

  const props = defineProps({
    name: {
      type: String,
      default: () => ''
    }
  })

  const path = computed(() => {
    return icon[props.name]
  })
</script>

<template>
  <span class="icon" v-html="path"></span>
</template>

<style>
  .icon {
    display: flex;
    align-self: center;
    justify-content: center;
  }
</style>
