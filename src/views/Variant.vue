<script setup>
  import { ref, computed } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import BaseIcon from '@/UI/BaseIcon.vue'
  import MTextFiled from '@/UI/MTextFiled.vue'
  import MRow from '@/UI/MRow.vue'
  import MCol from '@/UI/MCol.vue'
  import MImage from '@/UI/MImage.vue'
  import MButton from '@/UI/MButton.vue'

  import { GET_PRODUCT_VARIANT, EDIT_PRODUCT_VARIANT } from '@/api/product.api'

  import { useValidators } from '@/helpers/validators'
  import { useToast } from '@/store/toast'

  const toast = useToast()
  const { required, optional } = useValidators()

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const variant = ref({
    id: 0,
    image: '',
    name: '',
    code: '',
    price: 0,
    old_price: 0,
    discount: 0,
    count: 0,
    fee: 0,
    order: 0
  })

  const getProductVariant = async () => {
    try {
      const { data } = await GET_PRODUCT_VARIANT({ id: route.params.id })
      variant.value = {
        id: data.id,
        image: data.image,
        name: data.product?.name,
        code: data.code,
        price: Number(data.old_price || data.price),
        old_price: Number(data.old_price ? data.price : data.old_price),
        discount: data.discount,
        sale_price: data.sale_price,
        fee: data.fee,
        count: data.count,
        order: data.order
      }
    } catch (error) {
      console.error(error)
    }
  }

  getProductVariant()

  const error = ref(false)
  const checkValidation = () => {
    if (required(variant.value.code) && required(variant.value.price)) {
      error.value = false
      return true
    } else {
      error.value = false
      setTimeout(() => {
        toast.addToast({
          text: t('fillAllFields'),
          status: 'warning'
        })
        error.value = true
      }, 0)
      return false
    }
  }

  const loading = ref(false)
  const updateProductVariant = async () => {
    try {
      if (!checkValidation()) {
        return
      }

      loading.value = true
      await EDIT_PRODUCT_VARIANT({
        id: route.params.id,
        data: {
          code: variant.value.code,
          price: variant.value.old_price || variant.value.price,
          old_price: variant.value.old_price ? variant.value.price : variant.value.old_price,
          discount: variant.value.discount,
          count: variant.value.count,
          order: variant.value.order
        }
      })

      toast.addToast({
        text: t('productSaved')
      })

      back()
    } catch (error) {
      console.error(error)

      loading.value = false
      toast.addToast({
        text: t('problemsWithServer'),
        status: 'error'
      })
    }
  }

  const back = () => {
    router.go(-1)
  }

  const updatePrice = () => {
    updateOldPrice()
  }

  const updateOldPrice = () => {
    const present = variant.value?.price ? variant.value.price / 100 : 0
    const betweenPrice = variant.value.price - variant.value.old_price

    let discount = variant.value?.old_price ? Math.round(betweenPrice / present) : 0
    variant.value.discount = discount < 0 ? 0 : discount
  }

  const updateDiscount = () => {
    const present = variant.value.price / 100
    let oldPrice = Math.round(variant.value.price - present * variant.value.discount)
    variant.value.old_price = variant.value.discount > 0 ? oldPrice : 0
  }

  const computedTotalPrice = computed(() => {
    const currentPrice = variant.value.old_price || variant.value.price
    const percentCount = Math.round((currentPrice / 100) * variant.value.fee)
    return currentPrice - percentCount
  })
</script>

<template>
  <div class="menu _show">
    <div id="product" class="menu__wrapper">
      <div class="menu__head _active">
        <button @click="back" class="menu__back">
          <base-icon name="arrowLeft" />
          <p>{{ t('back') }}</p>
        </button>
      </div>
      <div class="menu__body">
        <div class="product">
          <div class="product__wrapper">
            <div class="product__content">
              <m-row>
                <m-col cols="12">
                  <div class="product__variant-name">{{ variant.name }}</div>
                </m-col>
                <m-col cols="4" rows="3">
                  <m-image :image="variant.image" />
                </m-col>
                <m-col cols="8">
                  <m-text-filed
                    @updateValue="updatePrice"
                    v-model="variant.price"
                    :disabled="loading"
                    :error="error && optional(variant.price)"
                    :label="t('price')"
                    inner-label="TMT"
                    background
                    type="number"
                    required
                  />
                </m-col>
                <m-col cols="8">
                  <m-text-filed
                    @updateValue="updateOldPrice"
                    v-model="variant.old_price"
                    :disabled="loading"
                    :label="t('discount')"
                    inner-label="TMT"
                    type="number"
                    background
                  />
                </m-col>
                <m-col cols="8">
                  <m-text-filed
                    @updateValue="updateDiscount"
                    v-model="variant.discount"
                    :disabled="loading"
                    :label="t('percent')"
                    inner-label="%"
                    background
                    type="number"
                  />
                </m-col>
                <m-col cols="12">
                  <m-text-filed
                    v-model="variant.count"
                    :disabled="loading"
                    :label="t('productCount')"
                    background
                    type="number"
                  />
                </m-col>
                <m-col cols="6">
                  <m-text-filed v-model="variant.fee" disabled :label="t('commission')" background inner-label="%" />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    v-model="computedTotalPrice"
                    :label="t('totalPrice')"
                    background
                    disabled
                    inner-label="TMT"
                  />
                </m-col>
                <m-col cols="12">
                  <m-text-filed
                    v-model.trim="variant.code"
                    :disabled="loading"
                    :error="error && optional(variant.code)"
                    :label="t('code')"
                    background
                    inner-label="#"
                    required
                  />
                </m-col>
                <m-col cols="12">
                  <m-button @click="updateProductVariant" :loading="loading" :title="t('save')" block />
                </m-col>
              </m-row>
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
  .product {
    // .product__wrapper
    &__wrapper {
      padding-bottom: 0px;
    }
    // .product__top
    &__top {
      position: relative;
    }
    &__content {
      padding: 20px;
    }
    // .product__variant-name
    &__variant-name {
      font-size: 16px;
      line-height: 20px;
      font-weight: 600;
    }
  }
</style>
