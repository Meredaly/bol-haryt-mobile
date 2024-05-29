<script setup>
  import { ref, computed } from 'vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import SelectPopUp from './SelectPopUp.vue'

  const emit = defineEmits(['selectItem', 'addItem', 'deleteItem'])

  const props = defineProps({
    items: { type: Array, default: () => [] },
    popUpTitle: { type: String, default: '' },
    selectedItem: { type: Object, default: null },
    menu: { type: Array, default: () => [] },
    disabled: { type: Boolean, default: false }
  })

  const selectItem = (item) => {
    emit('selectItem', item)
  }

  const selectMenu = (item) => {
    emit('addItem', item)
  }

  const deleteItem = (index) => {
    emit('deleteItem', index)
  }

  const otherMenu = computed(() => {
    return props.menu.filter((menuItem) => {
      return !props.items.some((item) => menuItem.name === item.name)
    })
  })

  const showSelectPopUp = ref(false)
  const openSelectPopUp = () => {
    showSelectPopUp.value = true
  }

  const closeSelectPopUp = () => {
    showSelectPopUp.value = false
  }
</script>

<template>
  <div class="tab-bar">
    <div class="tab-bar__wrapper">
      <div v-if="items?.length" class="tab-bar__items">
        <div v-for="(item, index) in items" :class="['tab-bar__item', { _active: item?.name && item.name === selectedItem?.name }]">
          <div @click="selectItem(item)" class="tab-bar__item-name">{{ item.name }}</div>
          <div class="tab-bar__close">
            <button @click="deleteItem(index)" :disabled="disabled">
              <base-icon name="dismiss" />
            </button>
          </div>
        </div>
      </div>
      <div class="tab-bar__others">
        <button @click="openSelectPopUp" :disabled="disabled">
          <base-icon name="moreHorizontal" />
        </button>
      </div>
    </div>
  </div>
  <select-pop-up @close="closeSelectPopUp" @select-item="selectMenu" :items="otherMenu" v-if="showSelectPopUp" :title="popUpTitle" />
</template>

<style lang="scss" scoped>
  .tab-bar {
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    // .tab-bar__wrapper
    &__wrapper {
      display: flex;
      width: max-content;
    }
    // .tab-bar__items
    &__items {
      display: flex;
      gap: 10px;
    }
    // .tab-bar__item
    &__item {
      display: flex;
      align-items: center;
      border: 1px solid var(--gray-300);
      color: var(--gray-600);
      border-radius: 8px;
      padding: 0px 10px;
      cursor: pointer;
      &._active {
        background-color: var(--green-500);
        color: var(--white);
        border-color: var(--green-500);
      }
    }
    // .tab-bar__item-drag
    &__item-drag {
      :deep() {
        button {
          color: inherit;
          &:hover {
            color: inherit;
          }
        }
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }
    // .tab-bar__item-name
    &__item-name {
      padding: 2px 6px;
      font-size: 15px;
      line-height: 28px;
    }
    // .tab-bar__close
    &__close {
      button {
        color: inherit;
        background-color: transparent;
      }
      :deep() {
        svg {
          width: 16px;
          height: 16px;
        }
      }
    }

    .tab-bar__items + .tab-bar__others {
      margin-left: 10px;
    }
    // .tab-bar__others
    &__others {
      display: flex;
      align-items: center;
      button {
        border: 1px solid var(--gray-300);
        color: var(--gray-600);
        background-color: transparent;
        border-radius: 8px;
        padding: 4px;
      }
    }
  }
</style>
