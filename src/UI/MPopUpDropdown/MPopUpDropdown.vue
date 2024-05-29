<script setup>
  import { ref, computed } from 'vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import SelectPopUp from './SelectPopUp.vue'

  const emit = defineEmits(['selectItem', 'search'])

  const props = defineProps({
    label: { type: String, default: null },
    popUpTitle: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    width: { type: [String, Number], default: null },
    selectedItem: { type: Object, default: null },
    searchable: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
  })

  const selectItem = (item) => {
    closePopUp()
    emit('selectItem', item)
  }

  const showPopUp = ref(false)
  const openPopUp = () => {
    !props.disabled && (showPopUp.value = true)
  }

  const closePopUp = () => {
    showPopUp.value = false
  }

  const search = (text = '') => {
    emit('search', text)
  }

  const classes = computed(() => {
    return [
      'pop-up-dropdown',
      {
        'pop-up-dropdown_disabled': props.disabled,
        'pop-up-dropdown_error': props.error,
        'pop-up-dropdown_success': props.success,
        'pop-up-dropdown_required': props.required
      }
    ]
  })
</script>

<template>
  <div :class="classes">
    <div class="pop-up-dropdown__label">{{ label }}</div>
    <button @click="openPopUp" :disabled="disabled" class="pop-up-dropdown__button">
      <div v-if="selectedItem" class="pop-up-dropdown__button-text">
        {{ selectedItem.name }}
      </div>
      <div class="pop-up-dropdown__placeholder">{{ placeholder }}</div>
      <div class="pop-up-dropdown__chevron">
        <base-icon name="chevronButton" />
      </div>
    </button>
  </div>
  <select-pop-up
    @close="closePopUp"
    @select-item="selectItem"
    @search="search"
    :selected-item="selectedItem"
    :items="items"
    :title="popUpTitle"
    v-if="showPopUp"
    :searchable="searchable"
  />
</template>

<style lang="scss" scoped>
  .pop-up-dropdown {
    width: 100%;
    // .pop-up-dropdown__label
    &__label {
      font-weight: 600;
      font-size: 12px;
      line-height: 14px;
      color: var(--gray-900);
      padding-bottom: 4px;
    }
    &_required {
      .pop-up-dropdown__label {
        &:after {
          content: '*';
          padding-left: 2px;
          color: var(--danger-600);
        }
      }
    }
    &_disabled {
      .pop-up-dropdown__button {
        background: var(--gray-200);
      }
    }
    // .pop-up-dropdown__button
    &__button {
      width: 100%;
      display: flex;
      align-items: center;
      background: var(--gray-100);
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      position: relative;
      padding: 4px 14px;
      min-height: 40px;
    }
    // .pop-up-dropdown__button-text
    &__button-text {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: var(--gray-900);
    }
    // .pop-up-dropdown__items
    &__items {
      flex: 1 1;
      padding-right: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px 6px;
    }
    // .pop-up-dropdown__item
    &__item {
      display: flex;
      align-items: center;
      padding: 3px 5px 3px 10px;
      background: var(--gray-100);
      border: 1px solid var(--gray-300);
      border-radius: 16px;
      background-color: var(--white);
      p {
        font-weight: 400;
        font-size: 12px;
        line-height: 18px;
        letter-spacing: 0.135px;
        color: var(--text);
        padding-right: 4px;
      }
      button {
        border-radius: 50%;
        color: var(--danger-600);
        &:deep() {
          svg {
            width: 22px;
            height: 22px;
          }
        }
      }
    }
    // .pop-up-dropdown__chevron
    &__chevron {
      color: var(--gray-600);
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .pop-up-dropdown__placeholder
    &__placeholder {
      font-size: 14px;
      line-height: 16px;
      color: var(--gray-500);
      user-select: none;
      pointer-events: none;
      z-index: 1;
      flex: 1 1;
    }
  }
</style>
