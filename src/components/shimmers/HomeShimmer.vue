<script setup></script>

<template>
  <div class="home-shimmer">
    <div class="home-shimmer__wrapper">
      <div class="home-shimmer__head">
        <div class="shimmer"></div>
      </div>
      <div class="home-shimmer__products">
        <div v-for="index in 5" class="home-shimmer__product">
          <div class="home-shimmer__product-img">
            <div class="shimmer"></div>
          </div>
          <div class="home-shimmer__product-content">
            <div class="home-shimmer__product-title">
              <div class="shimmer"></div>
              <div class="shimmer"></div>
            </div>
            <div class="home-shimmer__product-size">
              <div class="shimmer"></div>
            </div>
            <div class="home-shimmer__product-price">
              <div class="shimmer"></div>
            </div>
            <div class="home-shimmer__product-price-tm">
              <div class="shimmer"></div>
            </div>
            <div class="home-shimmer__product-status">
              <div class="shimmer"></div>
            </div>
            <div class="home-shimmer__product-date">
              <div class="shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .home-shimmer {
    // .home-shimmer__wrapper
    &__wrapper {
      padding: 20px;
    }
    // .home-shimmer__head
    &__head {
      height: 28px;
      width: 60%;
      overflow: hidden;
    }
    // .home-shimmer__products
    &__products {
      padding: 20px 0;
    }
    // .home-shimmer__product
    &__product {
      padding: 10px 0;
      border-bottom: 1px solid var(--gray-300);
      display: flex;
    }
    // .home-shimmer__product-img
    &__product-img {
      width: 120px;
      min-width: 120px;
      height: 180px;
      border-radius: 8px;
    }
    // .home-shimmer__product-content
    &__product-content {
      padding-left: 10px;
      flex: 1 1;
    }
    // .home-shimmer__product-title
    &__product-title {
      .shimmer {
        height: 16px;
        &:first-child {
          width: 100%;
        }
        &:last-child {
          width: 60%;
          margin-top: 4px;
        }
      }
    }
    // .home-shimmer__product-size
    &__product-size {
      height: 14px;
      margin-top: 5px;
      margin-bottom: 1px;
      width: 90px;
    }
    // .home-shimmer__product-price
    &__product-price {
      height: 14px;
      margin-top: 8px;
      margin-bottom: 1px;
      width: 80px;
    }
    // .home-shimmer__product-price-tm
    &__product-price-tm {
      height: 14px;
      margin-top: 4px;
      margin-bottom: 1px;
      width: 100px;
    }
    // .home-shimmer__product-status
    &__product-status {
      height: 22px;
      margin-top: 11px;
      margin-bottom: 1px;
      width: 120px;
    }
    // .home-shimmer__product-date
    &__product-date {
      height: 12px;
      margin-top: 11px;
      margin-bottom: 1px;
      width: 150px;
    }
  }
</style>
