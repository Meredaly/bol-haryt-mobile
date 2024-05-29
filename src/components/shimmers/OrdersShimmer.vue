<script setup></script>

<template>
  <div class="order-shimmer">
    <div class="order-shimmer__wrapper">
      <div class="order-shimmer__head">
        <div class="shimmer"></div>
      </div>
      <div class="order-shimmer__orders">
        <div v-for="index in 5" class="order-shimmer__order">
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
          <div class="order-shimmer__item">
            <div class="order-shimmer__item-title"><div class="shimmer"></div></div>
            <div class="order-shimmer__item-text"><div class="shimmer"></div></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .order-shimmer {
    // .order-shimmer__wrapper
    &__wrapper {
      padding: 20px;
    }
    // .order-shimmer__head
    &__head {
      height: 28px;
      width: 60%;
      overflow: hidden;
    }
    // .order-shimmer__orders
    &__orders {
      padding-bottom: 20px;
    }
    // .order-shimmer__order
    &__order {
      padding: 20px 0;
      border-bottom: 1px solid var(--gray-300);
    }
    // .order-shimmer__item
    &__item {
      display: flex;
      padding: 4px 0;
      &:nth-child(2n + 1) {
        .order-shimmer__item-title {
          .shimmer {
            width: 60px;
          }
        }
        .order-shimmer__item-text {
          .shimmer {
            width: 120px;
          }
        }
      }
      &:nth-child(3n + 1) {
        .order-shimmer__item-title {
          .shimmer {
            width: 100px;
          }
        }
        .order-shimmer__item-text {
          .shimmer {
            width: 40px;
          }
        }
      }
    }
    // .order-shimmer__item-title
    &__item-title {
      min-width: 130px;
      max-width: 130px;
      .shimmer {
        width: 30px;
        height: 14px;
      }
    }
    // .order-shimmer__item-text
    &__item-text {
      .shimmer {
        width: 100px;
        height: 14px;
      }
    }
  }
</style>
