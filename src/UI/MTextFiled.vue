<script setup>
  import { computed } from 'vue'
  import BaseIcon from '@/UI/BaseIcon.vue'

  const emit = defineEmits(['clickPrev', 'clickAppend', 'update:modelValue', 'updateValue', 'click:input', 'value'])

  const props = defineProps({
    label: { type: String, default: '' },
    prevIcon: { type: String, default: null },
    appendIcon: { type: String, default: null },
    modelValue: { type: [String, Number], default: null },
    value: { type: [String, Number], default: null },
    placeholder: { type: String, default: '' },
    type: { type: String, default: 'text' },
    clickablePrev: { type: Boolean, default: false },
    clickableAppend: { type: Boolean, default: false },
    innerLabel: { type: String, default: null },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
  })

  const update = (newValue) => {
    if (props.type === 'number') {
      emit('update:modelValue', Number(newValue))
      emit('updateValue', Number(newValue))
      emit('value', Number(newValue))
    } else {
      emit('update:modelValue', newValue)
      emit('updateValue', newValue)
      emit('value', Number(newValue))
    }
  }
  const classes = computed(() => {
    return [
      'text-filed',
      {
        'text-filed--error': props.error,
        'text-filed--required': props.required
      }
    ]
  })
</script>

<template>
  <div :class="classes">
    <div v-if="label" class="text-filed__label">{{ label }}</div>
    <div :class="['text-filed__body', { _disabled: props.disabled }]">
      <div v-if="prevIcon" :class="['text-filed__prev-icon', { _clickable: clickablePrev }]">
        <base-icon :name="prevIcon" />
      </div>
      <div class="text-filed__input">
        <input
          @input="(event) => update(event.target.value)"
          @click="$emit('click:input')"
          :value="props.modelValue || props.value"
          :type="type"
          :placeholder="placeholder"
          :disabled="disabled"
        />
        <span v-if="props.type === 'button' && props.placeholder && !props.modelValue" class="text-filed_placeholder">{{ props.placeholder }}</span>
      </div>
      <span v-if="innerLabel" class="text-filed__inner-label">{{ props.innerLabel }}</span>
      <div @click="emit('clickAppend')" v-if="appendIcon" :class="['text-filed__append-icon', { _clickable: clickableAppend }]">
        <base-icon :name="appendIcon" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .text-filed {
    width: 100%;

    &--required {
      .text-filed__label {
        &:after {
          content: '*';
          padding-left: 2px;
          color: var(--danger-600);
        }
      }
    }

    &--error {
      animation: 0.2s invalid forwards;

      .text-filed__body {
        background-color: var(--danger-100);
        border-color: var(--danger-700);
      }
    }
    // .text-filed__label
    &__label {
      font-weight: 600;
      font-size: 12px;
      line-height: 14px;
      color: var(--gray-900);
      padding-bottom: 4px;
    }
    // .text-filed__body
    &__body {
      width: 100%;
      display: flex;
      background: var(--gray-100);
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      position: relative;
      &._disabled {
        background: var(--gray-200);
      }
    }
    // .text-filed__prev-icon
    &__prev-icon {
      margin: 12px 14px;
      margin-right: 0;
      user-select: none;
      cursor: pointer;
    }
    // .text-filed__input
    &__input {
      flex: 1 1;
      input {
        width: 100%;
        padding: 12px 14px;
        background-color: transparent;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        color: var(--gray-900);
        text-align: left;
        &::placeholder {
          color: var(--gray-500);
        }
        &[type='button'] {
          display: block;
          cursor: pointer;
        }
      }
    }
    &_placeholder {
      font-size: 14px;
      line-height: 16px;
      color: var(--gray-500);
      user-select: none;
      pointer-events: none;
      position: absolute;
      left: 0;
      top: 0;
      padding: 14px;
      z-index: 1;
    }

    // .text-filed__append-icon
    &__append-icon {
      margin: 12px 14px;
      margin-left: 0;
      user-select: none;
      cursor: pointer;
    }
    // .text-filed__inner-label
    &__inner-label {
      color: var(--green-500);
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      padding: 12px 14px 12px 0;
    }

    ._clickable {
      user-select: all;
    }
  }

  @keyframes invalid {
    0% {
      transform: translateX(0px);
    }
    25% {
      transform: translateX(5px);
    }
    50% {
      transform: translateX(0px);
    }
    75% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(0px);
    }
  }
</style>
