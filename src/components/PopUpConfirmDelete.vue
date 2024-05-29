<script setup>
  import BaseIcon from '@/UI/BaseIcon.vue'
  import MButton from '@/UI/MButton.vue'

  const emit = defineEmits(['cancel', 'confirm'])

  const props = defineProps({
    title: { type: String, default: '' }
  })

  const cancel = () => {
    emit('cancel')
  }
  const confirm = () => {
    emit('confirm')
  }
</script>

<template>
  <div class="pop-up-confirm">
    <div class="pop-up-confirm__wrapper">
      <div class="pop-up-confirm__head">
        <div class="pop-up-confirm__title">{{ title }}</div>
        <button @click="cancel" class="pop-up-confirm__close">
          <base-icon name="dismiss" />
        </button>
      </div>
      <div class="pop-up-confirm__body">
        <m-button @click="cancel" title="Нет" theme="secondary" />
        <m-button @click="confirm" title="Да" theme="error" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .pop-up-confirm {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    // .pop-up-confirm__wrapper
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
    // .pop-up-confirm__head
    &__head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      justify-content: space-between;
      border-bottom: 1px solid var(--gray-100);
    }
    // .pop-up-confirm__title
    &__title {
      font-size: 16px;
      font-weight: 600;
    }
    // .pop-up-confirm__close
    &__close {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      color: var(--danger-800);
      background-color: var(--danger-100);
      border: 1px solid var(--danger-300);
    }
    // .pop-up-confirm__body
    &__body {
      display: flex;
      padding: 10px;
      gap: 10px;
      .button {
        flex: 1 1;
      }
    }
  }
</style>
