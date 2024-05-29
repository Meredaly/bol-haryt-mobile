<script setup>
  import SelectPopUpSub from './SelectPopUpSub.vue'

  const emit = defineEmits(['selectItem'])

  const props = defineProps({
    items: { type: Array, default: () => [] },
    subIndex: { type: Number, default: 1 },
    selectedItem: { type: Object, default: null }
  })

  const selectItem = (item) => {
    emit('selectItem', item)
  }
</script>
<template>
  <ul class="select-pop-up__list">
    <template v-for="item in items" :key="item.id">
      <li class="select-pop-up__item-box">
        <button @click="selectItem(item)" :class="['select-pop-up__item', { _active: selectedItem?.id === item?.id }]">
          <div class="select-pop-up__text">{{ item.name }}</div>
        </button>
        <div v-if="item.sub" class="select-pop-up__sub" :style="`--index: ${subIndex}`">
          <select-pop-up-sub @select-item="selectItem" :selected-item="selectedItem" :items="item.sub" :subIndex="subIndex + 1" />
        </div>
      </li>
    </template>
  </ul>
</template>

<style lang="scss" scoped>
  .select-pop-up {
    // .select-pop-up__list
    &__list {
    }
    // .select-pop-up__item-box
    &__item-box {
      &:not(:first-child) {
        border-top: 1px solid var(--gray-100);
      }
    }
    // .select-pop-up__item
    &__item {
      width: 100%;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--gray-900);
      background-color: transparent;
      .icon {
        color: var(--gray-600);
      }
      &._active {
        background-color: var(--success-100);
        .icon {
          color: var(--success-600);
        }
      }
    }
    // .select-pop-up__checkbox
    &__checkbox {
    }
    // .select-pop-up__text
    &__text {
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
    }
    // .select-pop-up__sub
    &__sub {
      border-top: 1px solid var(--gray-100);
      .select-pop-up__item {
        padding-left: calc(40px * var(--index));
      }
    }
  }
</style>
