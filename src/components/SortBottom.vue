<script setup>
  const emit = defineEmits(['close', 'selectItem'])

  const props = defineProps({
    selectedItem: { type: Object, default: null },
    items: { type: Array, default: () => [] },
    show: { type: Boolean, default: false }
  })

  const selectItem = (item) => {
    emit('selectItem', item)
  }

  const close = () => {
    emit('close')
  }
</script>

<template>
  <div :class="['sort-bottom', { _active: show }]">
    <div @click="close" class="sort-bottom__background"></div>
    <div class="sort-bottom__wrapper">
      <div class="sort-bottom__head">
        <span></span>
      </div>
      <div class="sort-bottom__menu">
        <button v-for="item in items" @click="selectItem(item)" :class="['sort-bottom__item', { _active: selectedItem?.id === item.id }]">
          <div class="sort-bottom__text">{{ item.name }}</div>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .sort-bottom {
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(10px);
    visibility: hidden;
    opacity: 0;
    transition: 0.2s visibility 0s, 0.2s opacity 0s;
    &._active {
      visibility: visible;
      opacity: 1;
      transition: 0s;
      .sort-bottom__wrapper {
        bottom: 0;
      }
    }
    // .sort-bottom__background
    &__background {
      position: absolute;
      z-index: 1;
      left: 0;
      right: 0;
      bottom: 0;
      top: 0;
    }

    // .sort-bottom__wrapper
    &__wrapper {
      position: absolute;
      z-index: 2;
      width: 100%;
      bottom: 0;
      background-color: var(--white);
      border-radius: 10px 10px 0 0;
      bottom: -100%;
      transition: 0.2s;
      max-height: 80%;
      display: flex;
      flex-direction: column;
    }
    // .sort-bottom__head
    &__head {
      padding: 5px;
      display: flex;
      justify-content: center;
      span {
        width: 50px;
        height: 4px;
        border-radius: 2px;
        background-color: var(--gray-600);
        display: block;
      }
    }
    // .sort-bottom__menu
    &__menu {
      height: calc(100% - 14px);
      overflow: auto;
    }
    // .sort-bottom__item
    &__item {
      display: block;
      width: 100%;
      text-align: left;
      background-color: transparent;
      padding: 14px 20px;
      color: var(--gray-900);
      &:active {
        background-color: var(--gray-100);
      }
      &._active {
        background-color: var(--green-500);
        color: var(--white);
      }
    }
    // .sort-bottom__text
    &__text {
      font-size: 14px;
      line-height: 1.2;
      font-weight: 400;
    }
  }
</style>
