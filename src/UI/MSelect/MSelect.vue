<script setup>
  import { computed, ref } from 'vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import SelectPopUp from './SelectPopUp.vue'

  const emit = defineEmits(['selectItem', 'search'])

  const props = defineProps({
    label: { type: String, default: null },
    popUpTitle: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' },
    background: { type: Boolean, default: false },
    selectedItems: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    success: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false },
    required: { type: Boolean, default: false }
  })

  const selectItem = (item) => {
    emit('selectItem', item)
  }

  const showSelectPopUp = ref(false)
  const openSelectPopUp = () => {
    showSelectPopUp.value = true
  }

  const closeSelectPopUp = () => {
    showSelectPopUp.value = false
  }

  const search = (text = '') => {
    emit('search', text)
  }

  const classes = computed(() => {
    return [
      'select',
      {
        select_disabled: props.disabled,
        select_error: props.error,
        select_success: props.success,
        select_required: props.required
      }
    ]
  })
</script>

<template>
  <div :class="classes">
    <div class="select__label">{{ label }}</div>
    <div class="select__button">
      <div v-if="props.selectedItems.length" class="select__items">
        <div v-for="item in props.selectedItems" :key="item.id" class="select__item">
          <p>{{ item.name }}</p>
          <button @click="selectItem(item)" :disabled="disabled">
            <base-icon name="dismissCircle" />
          </button>
        </div>
      </div>
      <div v-else class="select__placeholder">{{ props.placeholder }}</div>
      <button @click="openSelectPopUp" :disabled="disabled" class="select__add">
        <base-icon name="add" />
      </button>
    </div>
  </div>
  <select-pop-up
    @close="closeSelectPopUp"
    @select-item="selectItem"
    @search="search"
    :selected-items="props.selectedItems"
    :items="items"
    :title="popUpTitle"
    :searchable="searchable"
    v-if="showSelectPopUp"
  />
</template>

<style lang="scss" scoped>
  .select {
    width: 100%;
    // .select__label
    &__label {
      font-weight: 600;
      font-size: 12px;
      line-height: 14px;
      color: var(--gray-900);
      padding-bottom: 4px;
    }
    &_disabled {
      .select__button {
        background: var(--gray-200);
      }
    }
    &_error {
      .select__button {
        background-color: var(--danger-100);
        border-color: var(--danger-700);
      }
    }
    &_required {
      .select__label {
        &:after {
          content: '*';
          padding-left: 2px;
          color: var(--danger-600);
        }
      }
    }
    // .select__button
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
    // .select__items
    &__items {
      flex: 1 1;
      padding-right: 10px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px 6px;
    }
    // .select__item
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
          .icon {
            svg {
              width: 22px;
              height: 22px;
            }
          }
        }
      }
    }
    // .select__add
    &__add {
      padding: 4px;
      background-color: var(--green-500);
      border-radius: 50%;
      color: var(--white);
      &:deep() {
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    // .select__placeholder
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
