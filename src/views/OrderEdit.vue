<script setup>
  import { ref, watchEffect } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import MButton from '@/UI/MButton.vue'
  import MTextFiled from '@/UI/MTextFiled.vue'
  import MImage from '@/UI/MImage.vue'
  import MPopUpDropdown from '@/UI/MPopUpDropdown'

  import { updateCategoryForDropdown } from '@/helpers/normalize'

  import { GET_ORDER, EDIT_ORDER } from '@/api/order.api'
  import { GET_LOCATIONS } from '@/api/location.api'
  import { GET_SHIPPINGS } from '@/api/shipping.api'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const order = ref({
    id: null,
    client: null,
    code: null,
    note: '',
    note_admin: null,
    number: '',
    region: null,
    address: '',
    shipping: null,
    created_at: '',
    updated_at: '',
    total_price: 0,
    seller: []
  })
  const getOrder = async () => {
    try {
      const { data } = await GET_ORDER({ id: route.params.id })
      order.value = data
      console.log(order.value)
    } catch (error) {
      console.error(error)
    }
  }

  getOrder()

  const locations = ref([])
  const getLocations = async () => {
    try {
      const { data } = await GET_LOCATIONS()
      locations.value = data || []
      locations.value = updateCategoryForDropdown(data || [])
    } catch (error) {
      console.error(error)
    }
  }
  getLocations()

  const selectLocation = (location) => {
    order.value.region = location
  }

  const shippings = ref([])
  const getShippings = async () => {
    try {
      const { data } = await GET_SHIPPINGS()

      shippings.value = updateCategoryForDropdown(data || [])
    } catch (error) {
      console.error(error)
    }
  }
  getShippings()

  const selectShipping = (shipping) => {
    order.value.shipping = shipping
  }

  const form = ref({
    client: null,
    note: null,
    number: null,
    region: null,
    address: null,
    shipping: null,
    products: []
  })

  const saveOrder = async () => {
    form.value.client = order.value.client.id
    form.value.note = order.value.note
    form.value.number = order.value.number
    form.value.region = order.value.region.id
    form.value.address = order.value.address
    form.value.shipping = order.value.shipping.id

    order.value.seller.forEach((shop) => {
      shop.products?.forEach((product) => {
        form.value.products.push({
          variant: product.variant.id,
          count: product.count,
          status: product.status
        })
      })
    })
    try {
      await EDIT_ORDER({ id: order.value.id, data: form.value })
      back()
    } catch (error) {
      console.error(error)
    }
  }

  const removeProduct = (seller, index) => {
    form.value.products.push({ method: 'delete', variant: seller.products[index].id })
    seller.products.splice(index, 1)
  }

  watchEffect(() => {
    order.value.total_price = order.value.seller.reduce((sum, shop) => {
      return (
        sum +
        shop.products.reduce((productsSum, product) => {
          return productsSum + product.count * Number(product.variant.price)
        }, 0)
      )
    }, 0)
  })

  const statuses = ref([
    { id: 'AC', name: t('accepted') },
    { id: 'CA', name: t('canceled') },
    { id: 'RE', name: t('returned') },
    { id: 'SE', name: t('sending') },
    { id: 'SU', name: t('success') }
  ])

  const updateProductStatus = (product, status) => {
    product.status = status.id
  }
  const updateSellerStatus = (seller, status) => {
    seller.products?.forEach((product) => {
      if (product.status !== 'CA') product.status = status.id
    })
  }

  const getStatus = (statusId) => {
    return statuses.value.find((status) => status.id === statusId)
  }

  const addCount = (product) => {
    product.count = product.count + 1
  }
  const decCount = (product) => {
    product.count = product.count - 1
  }

  const back = () => {
    router.go(-1)
  }
</script>

<template>
  <div class="menu _show">
    <div id="product" class="menu__wrapper">
      <div class="menu__head _active">
        <button @click="back" class="menu__back">
          <base-icon name="arrowLeft" />
          <p>{{ t('back') }}</p>
        </button>
        <div class="menu__title">{{ t('orderNumber') }} {{ order.code }}</div>
      </div>
      <div class="menu__body">
        <div class="order">
          <div class="order__body">
            <div class="order__items">
              <div v-for="seller in order.seller" :key="seller.id" class="order__item">
                <div class="order__shop">
                  <div class="order__shop-image">
                    <m-image :image="seller.logo" width="40px" height="40px" circle />
                  </div>
                  <div class="order__shop-name">{{ seller.market_name }}</div>
                  <div class="order__shop-status"></div>
                </div>
                <div class="order__products">
                  <div v-for="(product, index) in seller.products" :key="product.id" class="order__product">
                    <div class="order__product-box">
                      <div class="order__product-image">
                        <m-image :image="product.variant.image.thumbnail" width="120px" height="180px" />
                      </div>
                      <div class="order__product-content">
                        <div class="order__product-name">
                          {{ product.variant.name }}
                          <p>#{{ product.variant.code }}</p>
                          <p v-if="product.variant.options">
                            {{ product.variant.options.option.name }}
                            {{ product.variant.options.value && ', ' + product.variant.options.value?.name }}
                          </p>
                        </div>
                        <div class="order__product-prices">
                          <div v-if="Number(product.variant.discount)" class="order__product-price order__product-price_old">
                            {{ product.variant.discount }} TMT
                          </div>
                          <div class="order__product-price">{{ product.variant.price }} TMT</div>
                        </div>
                        <div class="order__product-count">
                          <m-button @click="decCount(product)" :disabled="product.count <= 1" prev-icon="subtrack" outline />
                          <m-text-filed v-model="product.count" width="70" background />
                          <m-button @click="addCount(product)" prev-icon="add" outline />
                        </div>
                        <div class="order__product-total-price">{{ product.variant.price * product.count }} TMT</div>
                      </div>
                    </div>
                    <div class="order__product-footer">
                      <div class="order__product-status">
                        <m-pop-up-dropdown
                          @select-item="(status) => updateProductStatus(product, status)"
                          :selected-item="getStatus(product.status)"
                          :items="statuses"
                        />
                      </div>
                      <div class="order__product-delete">
                        <m-button @click="removeProduct(seller, index)" prev-icon="delete" theme="error" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="order__info">
              <div class="order-info">
                <div class="order-info__client">
                  <div class="order-info__title">{{ t('client') }}</div>
                  <div class="order-info__client-name">{{ order.client?.name }}</div>
                  <div class="order-info__client-phone-number">{{ order.client?.number }}</div>
                </div>
                <div class="order-info__address">
                  <div class="order-info__title">{{ t('information') }}</div>
                  <div class="order-info__address-text">{{ order.address }}</div>
                  <div class="order-info__address-text">{{ order.number }}</div>
                  <div v-if="order.note" class="order-info__address-text">{{ order.note }}</div>
                </div>
                <div class="order-info__info">
                  <div class="order-info__location">
                    <m-pop-up-dropdown @select-item="selectLocation" :selected-item="order.region" :items="locations" label="Расположение" />
                  </div>
                  <div class="order-info__shipping">
                    <m-pop-up-dropdown @select-item="selectShipping" :selected-item="order.shipping" :items="shippings" label="Доставка" />
                  </div>
                  <div class="order-info__prices">
                    <div class="order-info__price">
                      <span>{{ t('price') }}</span>
                      <span>{{ order.total_price }} TMT</span>
                    </div>
                    <div v-if="order.shipping?.price" class="order-info__price">
                      <span>{{ t('delivery') }}</span>
                      <span>{{ order.shipping?.price }} TMT</span>
                    </div>
                    <div class="order-info__price">
                      <span>{{ t('totalPrice') }}</span>
                      <span>{{ order.total_price + Number(order.shipping?.price || 0) }} TMT</span>
                    </div>
                  </div>
                </div>
                <div class="order-info__save">
                  <m-button @click="saveOrder" :title="t('save')" block />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .menu__wrapper {
    overflow: auto;
  }
  .menu__body {
    height: auto;
    overflow: hidden;
    padding-top: 56px;
  }
  .menu__head {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }
  .menu__title {
    font-size: 14px;
    font-weight: 500;
  }

  .order {
    background-color: var(--gray-100);
    min-height: calc(100vh - 56px);
    margin-bottom: 20px;
    // .order__body
    &__body {
    }
    // .order__items
    &__items {
      padding: 20px;
    }
    // .order__item
    &__item {
      background-color: var(--white);
      border-radius: 8px;
      border: 1px solid var(--gray-300);
    }
    // .order__shop
    &__shop {
      padding: 10px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--gray-100);
    }
    // .order__shop-image
    &__shop-image {
    }
    // .order__shop-name
    &__shop-name {
      padding: 0 10px;
      flex: 1 1;
      font-weight: 500;
    }
    // .order__shop-status
    &__shop-status {
    }
    // .order__products
    &__products {
    }
    // .order__product
    &__product {
      padding: 10px;
      border-bottom: 1px solid var(--gray-100);
    }
    // .order__product-box
    &__product-box {
      display: flex;
      gap: 10px;
      border-bottom: 1px solid var(--gray-100);
      padding-bottom: 10px;
    }
    // .order__product-image
    &__product-image {
    }
    // .order__product-content
    &__product-content {
    }
    // .order__product-name
    &__product-name {
      font-size: 15px;
      font-weight: 500;
      line-height: 20px;
      p {
        font-size: 14px;
        font-weight: 400;
      }
    }
    // .order__product-prices
    &__product-prices {
      margin-top: 10px;
      font-size: 14px;
      display: flex;
      gap: 10px;
    }
    // .order__product-price
    &__product-price {
      margin-top: 6px;
      // .order__product-price_old
      &_old {
        text-decoration: line-through;
      }
    }
    // .order__product-count
    &__product-count {
      display: flex;
      gap: 6px;
      margin-top: 10px;
      &:deep() {
        input {
          text-align: center;
        }
      }
    }
    // .order__product-total-price
    &__product-total-price {
      font-size: 16px;
      font-weight: 500;
      margin-top: 10px;
    }
    // .order__product-footer
    &__product-footer {
      display: flex;
      padding-top: 10px;
      gap: 10px;
    }
    // .order__product-status
    &__product-status {
      flex: 1 1;
    }
    // .order__product-delete
    &__product-delete {
    }
    // .order__info
    &__info {
    }
  }
  .order-info {
    padding: 0 20px;
    // .order-info__client
    &__client {
      background-color: var(--white);
      border-radius: 8px;
      border: 1px solid var(--gray-300);
      padding: 10px;
    }
    // .order-info__title
    &__title {
      font-size: 16px;
      font-weight: 600;
    }
    // .order-info__client-name
    &__client-name {
      margin-top: 6px;
      font-size: 14px;
      font-weight: 500;
    }
    // .order-info__client-phone-number
    &__client-phone-number {
      margin-top: 4px;
      font-size: 14px;
      font-weight: 400;
    }
    // .order-info__address
    &__address {
      margin-top: 20px;
      background-color: var(--white);
      border-radius: 8px;
      border: 1px solid var(--gray-300);
      padding: 10px;
    }
    // .order-info__address-text
    &__address-text {
      margin-top: 6px;
      font-size: 14px;
      font-weight: 400;
      & ~ .order-info__address-text {
        margin-top: 4px;
      }
    }
    // .order-info__info
    &__info {
      background-color: var(--white);
      border-radius: 8px;
      border: 1px solid var(--gray-300);
      padding: 10px;
      margin-top: 20px;
    }
    // .order-info__location
    &__location {
    }
    // .order-info__shipping
    &__shipping {
      margin-top: 10px;
    }
    // .order-info__prices
    &__prices {
      border-top: 1px solid var(--gray-100);
      margin-top: 10px;
      padding-top: 10px;
    }
    // .order-info__price
    &__price {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--gray-100);
      padding: 10px 0;
      span {
        &:first-child {
        }
        &:last-child {
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
    // .order-info__save
    &__save {
      margin-top: 20px;
    }
  }
</style>
