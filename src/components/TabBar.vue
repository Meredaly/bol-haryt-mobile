<script setup>
  import { useI18n } from 'vue-i18n'
  import BaseIcon from '@/UI/BaseIcon.vue'

  const { t } = useI18n()
</script>

<template>
  <div class="tab-bar">
    <div class="tab-bar__wrapper">
      <router-link to="/" class="tab-bar__item">
        <div class="tab-bar__icon">
          <base-icon name="grid" />
        </div>
        <div class="tab-bar__name">{{ t('tabBarProduct') }}</div>
      </router-link>
      <router-link to="/orders" class="tab-bar__item">
        <div class="tab-bar__icon">
          <base-icon name="cart" />
        </div>
        <div class="tab-bar__name">{{ t('tabBarOrders') }}</div>
      </router-link>

      <router-link to="/chats" class="tab-bar__item">
        <div class="tab-bar__icon">
          <base-icon name="chats" />
        </div>
        <div class="tab-bar__name">{{ t('tabBarChats') }}</div>
      </router-link>

      <router-link to="/comments" class="tab-bar__item">
        <div class="tab-bar__icon">
          <base-icon name="comments" />
        </div>
        <div class="tab-bar__name">{{ t('tabBarComments') }}</div>
      </router-link>
      <router-link to="/profile" class="tab-bar__item">
        <div class="tab-bar__icon">
          <base-icon name="personCircle" />
        </div>
        <div class="tab-bar__name">{{ t('tabBarProfile') }}</div>
      </router-link>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .tab-bar {
    background: var(--gray-100);
    border-top: 1px solid var(--gray-300);
    // .tab-bar__wrapper
    &__wrapper {
      display: flex;
    }
    // .tab-bar__item
    &__item {
      flex: 1 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: var(--gray-700);
      padding: 6px 0;
    }
    // .tab-bar__icon
    &__icon {
    }
    // .tab-bar__name
    &__name {
      padding-top: 4px;
      font-weight: 500;
      font-size: 10px;
      line-height: 12px;
    }
    .router-link-exact-active {
      color: var(--green-500);
    }
  }
</style>
