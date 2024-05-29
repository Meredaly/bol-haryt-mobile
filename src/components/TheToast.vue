<script setup>
  import { useToast } from '@/store/toast'
  const toast = useToast()
</script>
<template>
  <Teleport to="#toast">
    <template v-for="toastItem of toast.getToasts" :key="toastItem.id">
      <div class="toast__box">
        <div
          :class="[
            'toast__item',
            {
              'toast__item--warning': toastItem.status === 'warning',
              'toast__item--error': toastItem.status === 'error'
            }
          ]"
        >
          <div class="toast__text">{{ toastItem.text }}</div>
        </div>
      </div>
    </template>
  </Teleport>
</template>

<style lang="scss" scoped>
  .toast {
    // .toast__box
    &__box {
      animation: 0.2s tostAnimation forwards ease-out;
    }
    // .toast__item
    &__item {
      border-radius: 8px;
      padding: 10px 20px;
      color: var(--white);
      background-color: var(--success-600);
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
      margin-top: 6px;
      &--warning {
        background-color: var(--warning-600);
      }
      &--error {
        background-color: var(--danger-600);
      }
    }
    // .toast__text
    &__text {
      font-size: 14px;
      line-height: 20px;
      font-weight: 500;
      text-align: center;
      width: 100%;
    }
  }
  @keyframes tostAnimation {
    0% {
      transform: translateY(40px);
    }
    100% {
      transform: translateY(0);
    }
  }
</style>
