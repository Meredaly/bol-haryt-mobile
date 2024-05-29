<script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import MTextFiled from '@/UI/MTextFiled.vue'
  import SelectPopUpSub from './SelectPopUpSub.vue'

  const { t } = useI18n()

  const emit = defineEmits(['close', 'selectItem', 'search'])

  const props = defineProps({
    title: { type: String, default: '' },
    items: { type: Array, default: () => [] },
    subIndex: { type: Number, default: 1 },
    selectedIds: { type: Array, default: () => [] },
    selectedItems: { type: Array, default: () => [] },
    searchable: { type: Boolean, default: false }
  })

  const selectItem = (item) => {
    emit('selectItem', JSON.parse(JSON.stringify(item)))
  }

  const search = ref('')

  const searching = (text) => {
    emit('search', text)
    search.value = text
  }
  const close = () => {
    emit('close')
  }
  const selectedIds = computed(() => {
    return props.selectedItems?.map((item) => item.id) || []
  })
</script>

<template>
  <div class="select-pop-up">
    <div class="select-pop-up__wrapper">
      <div class="select-pop-up__head">
        <div class="select-pop-up__title">{{ title }}</div>
        <button @click="close" class="select-pop-up__close">
          <base-icon name="dismiss" />
        </button>
      </div>
      <div class="select-pop-up__body">
        <div v-if="searchable" class="select-pop-up__search">
          <m-text-filed @update-value="searching" :value="search" :placeholder="t('search')" prev-icon="search" />
        </div>
        <select-pop-up-sub @select-item="selectItem" :selected-ids="selectedIds" :items="items" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .select-pop-up {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: blur(10px);
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    // .select-pop-up__wrapper
    &__wrapper {
      background-color: var(--white);
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      max-height: 100%;
      width: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    // .select-pop-up__head
    &__head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      justify-content: space-between;
      border-bottom: 1px solid var(--gray-100);
    }
    // .select-pop-up__title
    &__title {
      font-size: 16px;
      font-weight: 600;
    }
    // .select-pop-up__close
    &__close {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      color: var(--danger-800);
      background-color: var(--danger-100);
      border: 1px solid var(--danger-300);
    }
    // .select-pop-up__body
    &__body {
      height: calc(100% - 59px);
      overflow: auto;
    }
    // .select-pop-up__search
    &__search {
      padding: 14px;
      position: sticky;
      top: 0;
      z-index: 1;
      background-color: var(--white);
    }
  }
</style>
