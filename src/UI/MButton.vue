<script setup>
  import { computed } from 'vue'
  import BaseIcon from '@/UI/BaseIcon.vue'

  const props = defineProps({
    title: { type: String, default: null },
    prevIcon: { type: String, default: null },
    block: { type: Boolean, default: false },
    theme: { type: String, default: 'primary' },
    outline: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  })

  const classes = computed(() => {
    return [
      'button',
      `button--${props.theme}`,
      {
        button_block: props.block,
        button_outline: props.outline,
        'button--error': props.error,
        'button--loading': props.loading
      }
    ]
  })
</script>

<template>
  <button :class="classes" :disabled="disabled">
    <div v-if="prevIcon" class="button__prev-icon">
      <base-icon :name="prevIcon" />
    </div>
    <div v-if="title" class="button__content">{{ title }}</div>
    <div v-if="loading" class="button__loading"></div>
  </button>
</template>

<style lang="scss" scoped>
  .button {
    padding: 11px;
    background-color: var(--green-500);
    border: 1px solid var(--green-500);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    position: relative;
    height: fit-content;
    &.button_outline {
      color: var(--green-500);
      background-color: transparent;
    }
    // .button__prev-icon
    &__prev-icon {
      display: flex;
      &:deep() {
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    .button__prev-icon + .button__content {
      margin-left: 6px;
    }
    // .button__content
    &__content {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      text-align: center;
    }
    // .button__loading
    &__loading {
      position: absolute;
      border: 2px solid var(--white);
      width: 20px;
      height: 20px;
      border-radius: 50%;
      top: 50%;
      left: 50%;
      border-left-color: transparent;
      animation: loading 1s linear infinite;
      transform: translate(-50%, -50%);
      @keyframes loading {
        0% {
          transform: translate(-50%, -50%) rotate(0);
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }
    }

    // .button_block
    &_block {
      width: 100%;
    }
    &--loading {
      .button__content {
        color: transparent;
      }
    }
    &--secondary {
      background-color: var(--gray-100);
      color: var(--gray-900);
      border-color: var(--gray-100);
      &.button_outline {
        color: var(--gray-700);
        background-color: transparent;
      }
    }
    &--error {
      background-color: var(--danger-700);
      border-color: var(--danger-700);
      color: var(--white);
      &.button_outline {
        color: var(--danger-700);
        background-color: transparent;
      }
    }
  }
</style>
