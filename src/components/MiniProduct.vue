<script setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import MBadge from '@/UI/MBadge.vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import MButton from '@/UI/MButton.vue'

  const { t, locale } = useI18n()

  const emit = defineEmits(['select', 'more'])
  const props = defineProps({ item: { type: Object } })

  const moderationTypes = ref([
    { id: 0, name: t('statusUnderReview'), style: 'warning' },
    { id: 1, name: t('statusConfirmed'), style: 'success' },
    { id: 2, name: t('statusRejected'), style: 'danger' }
  ])

  const getVerifyTitle = () => {
    return moderationTypes.value.find((type) => type.id === props.item?.verify)?.name || ''
  }
  const getVerifyStyle = () => {
    return moderationTypes.value.find((type) => type.id === props.item?.verify)?.style || ''
  }
  const select = () => {
    emit('select')
  }

  const more = () => {
    emit('more')
  }

  const nameByLang = (langsName) => {
    return langsName ? langsName[locale.value] : ''
  }

  const getProductOptionName = (option) => {
    const optionName = nameByLang(option.option?.name)
    const valueName = nameByLang(option.value?.name)

    return `${optionName}${option.value?.name ? `, ${valueName}` : ''}`
  }
</script>

<template>
  <div class="mini-product">
    <div class="mini-product__wrapper">
      <div @click="select" class="mini-product__img">
        <img :src="item.image" />
      </div>
      <div class="mini-product__content">
        <div class="mini-product__head">
          <div @click="select" class="mini-product__title">{{ nameByLang(item.name) }}</div>
          <m-button @click="more" prev-icon="moreHorizontal" theme="secondary" outline />
        </div>
        <div @click="select" class="mini-product__size">{{ item.variant_name }}</div>
        <div @click="select" class="mini-product__prices">
          <div v-if="item.old_price" class="mini-product__discount">{{ item.old_price }} TMT</div>
          <div class="mini-product__price-tm">{{ item.price }} TMT</div>
        </div>
        <div class="mini-product__option">
          <m-badge v-for="option in item.option" :title="getProductOptionName(option)" styles="light" outline />
        </div>
        <div class="mini-product__statuses">
          <m-badge
            @click="select"
            :title="!!item.status ? t('statusOpen') : t('statusClosed')"
            :styles="item.status === 1 ? 'success' : 'danger'"
            outline
            class="mini-product__status mt-5"
          />
          <m-badge @click="select" :title="getVerifyTitle()" :styles="getVerifyStyle()" class="mt-5" />
        </div>
        <div class="mini-product__tags">
          <div class="products-tags">
            <div v-for="tag in item.tag" :style="`--color: ${tag.color}`">{{ nameByLang(tag.name) }}</div>
          </div>
        </div>

        <div @click="select" class="mini-product__counts">
          <div class="mini-product__count">
            <base-icon name="grid" />
            <p>{{ item.count }}</p>
          </div>
          <div class="mini-product__count">
            <base-icon name="eye" />
            <p>{{ item.view }}</p>
          </div>
          <div class="mini-product__count">
            <base-icon name="walletCart" />
            <p>{{ item.sold }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .mini-product {
    border-bottom: 1px solid var(--gray-300);
    padding: 10px 0;
    // .mini-product__wrapper
    &__wrapper {
      display: flex;
    }
    // .mini-product__img
    &__img {
      width: 120px;
      min-width: 120px;
      height: 180px;
      border-radius: 8px;
      overflow: hidden;
      background-color: var(--gray-100);
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
      }
    }
    // .mini-product__content
    &__content {
      flex: 1 1;
      padding-left: 10px;
    }
    // .mini-product__head
    &__head {
      display: flex;
      gap: 10px;
      justify-content: space-between;
    }
    // .mini-product__title
    &__title {
      font-weight: 600;
      font-size: 16px;
      line-height: 20px;
      color: var(--gray-900);
      font-feature-settings: 'liga' off;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-break: break-all;
    }
    // .mini-product__size
    &__size {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      margin-top: 4px;
      color: var(--gray-600);
    }

    // .mini-product__prices
    &__prices {
      margin-top: 10px;
      display: flex;
      gap: 10px;
      align-items: center;
    }
    // .mini-product__discount
    &__discount {
      font-weight: 400;
      font-size: 14px;
      line-height: 16px;
      color: var(--green-500);
      text-decoration: line-through;
    }
    // .mini-product__price-tm
    &__price-tm {
      font-weight: 700;
      font-size: 14px;
      line-height: 16px;
      color: var(--gray-900);
    }
    // .mini-product__client
    &__client {
      margin-top: 4px;
      font-weight: 500;
      font-size: 13px;
      line-height: 18px;
      color: var(--gray-800);
    }
    // .mini-product__date
    &__date {
      margin-top: 6px;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      color: var(--gray-600);
    }
    // .mini-product__status
    &__status {
    }
    // .mini-product__tags
    &__tags {
      margin-top: 10px;
    }

    // .mini-product__counts
    &__counts {
      display: flex;
      gap: 30px;
      margin-top: 20px;
    }
    // .mini-product__count
    &__count {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--gray-700);
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .mini-product__option
    &__option {
      padding: 4px 0;
      width: 100%;
      display: flex;
      gap: 10px;
      span {
        display: block;
        font-size: 14px;
        border: 1px solid var(--gray-600);
        color: var(--gray-600);
        padding: 4px 10px;
        border-radius: 4px;
      }
    }
    // .mini-product__statuses
    &__statuses {
      display: flex;
      gap: 10px;
    }
  }

  .products-tags {
    display: flex;
    flex-wrap: wrap;
    flex-wrap: wrap;
    gap: 4px;
    max-width: 200px;
    div {
      padding: 4px 8px;
      border: 1px solid var(--color, #000);
      border-radius: 4px;
      color: var(--color, #000);
      font-size: 12px;
    }
  }
</style>
