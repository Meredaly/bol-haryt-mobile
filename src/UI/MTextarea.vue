<script setup>
  import { computed } from 'vue'
  import BaseIcon from '@/UI/BaseIcon.vue'

  const emit = defineEmits(['clickPrev', 'clickAppend', 'update:modelValue', 'updateValue'])

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
    disabled: { type: Boolean, default: false }
  })

  const update = (newValue) => {
    emit('update:modelValue', newValue)
    emit('updateValue', newValue)
  }

  const classes = computed(() => {
    return [
      'text-filed',
      {
        'text-filed--error': props.error
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
        <textarea
          @input="(event) => update(event.target.value)"
          :value="props.modelValue || props.value"
          :type="type"
          :placeholder="placeholder"
          :disabled="props.disabled"
        ></textarea>
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
      &._disabled {
        background: var(--gray-200);
      }
    }
    // .text-filed__prev-icon
    &__prev-icon {
      margin: 14px;
      margin-right: 0;
      user-select: none;
      cursor: pointer;
    }
    // .text-filed__input
    &__input {
      flex: 1 1;
      textarea {
        width: 100%;
        padding: 12px 14px;
        background-color: transparent;
        font-weight: 400;
        font-size: 14px;
        line-height: 16px;
        color: var(--gray-900);
        height: 80px;
        resize: none;
        &::placeholder {
          color: var(--gray-500);
        }
      }
    }
    // .text-filed__append-icon
    &__append-icon {
      margin: 14px;
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

    &--error {
      .text-filed__body {
        background-color: var(--danger-100);
        border-color: var(--danger-700);
      }
    }
  }
</style>
