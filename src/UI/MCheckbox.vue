<script setup>
  import BaseIcon from '@/UI/BaseIcon.vue'

  const emit = defineEmits(['updateStatus'])

  const props = defineProps({
    value: { type: Boolean, default: false },
    title: { type: String, default: null },
    disabled: { type: Boolean, default: false }
  })

  const updateStatus = () => {
    !props.disabled && emit('updateStatus', !props.value)
  }
</script>

<template>
  <div :class="['checkbox', { 'checkbox--disabled': disabled, 'checkbox--active': value }]">
    <div @click="updateStatus" class="checkbox__button">
      <div class="checkbox__icon">
        <base-icon :name="value ? 'checked' : 'unchecked'" />
      </div>
      <div v-if="title" class="checkbox__text">{{ title }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .checkbox {
    cursor: pointer;
    user-select: none;
    &--active {
      .checkbox__icon {
        color: var(--green-500);
      }
    }
    &--disabled {
      cursor: not-allowed;
      pointer-events: all !important;
      .checkbox__icon,
      .checkbox__text {
        color: var(--gray-600);
      }
    }
    // .checkbox__button
    &__button {
      display: flex;
      align-items: center;
    }
    // .checkbox__icon
    &__icon {
      font-size: 24px;
      color: var(--gray-600);
      .icon {
        display: flex;
      }
    }
    // .checkbox__text
    &__text {
      padding-left: 4px;
      color: var(--gray-800);
    }
  }
</style>
