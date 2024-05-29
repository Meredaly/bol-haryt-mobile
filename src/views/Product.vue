<script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import BaseIcon from '@/UI/BaseIcon.vue'
  import MTextFiled from '@/UI/MTextFiled.vue'
  import MTextarea from '@/UI/MTextarea.vue'
  import MButton from '@/UI/MButton.vue'
  import MRow from '@/UI/MRow.vue'
  import MCol from '@/UI/MCol.vue'
  import MSelect from '@/UI/MSelect'
  import MPopUpDropdown from '@/UI/MPopUpDropdown'
  import MDivider from '@/UI/MDivider.vue'
  import MImageUploader from '@/UI/MImageUploader.vue'
  import ProductImages from '@/components/ProductImages.vue'
  import MCheckbox from '@/UI/MCheckbox.vue'
  import MBadge from '@/UI/MBadge.vue'

  import { GET_CHARACTERISTICS } from '@/api/characteristics.api'
  import { GET_PRODUCT, SAVE_PRODUCT, EDIT_PRODUCT, ADD_IMAGES, DELETE_IMAGE, ADD_VIDEO } from '@/api/product.api'

  import { useToast } from '@/store/toast'
  import { useAuth } from '@/store/auth'

  import { useCategories } from '@/composables/productCategories'
  import { useTags } from '@/composables/productTags'
  import { useBrands } from '@/composables/productBrands'

  import { createDate } from '@/helpers/normalize'
  import { useValidators } from '@/helpers/validators'

  const { t, locale } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const { required, optional } = useValidators()

  const toast = useToast()
  const seller = useAuth().getUser

  const back = () => {
    router.go(-1)
  }

  const form = ref({
    name_tm: '',
    name_ru: '',
    description_tm: '',
    description_ru: '',
    category: [],
    tag: [],
    status: 1,
    created_at: '',
    seller: seller?.id || null,
    note: '',
    brand: null,
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    variants: [
      {
        code: '',
        price: 0,
        discount: 0,
        count: 0,
        images: [],
        order: 1,
        value: null
      }
    ],
    options: [],
    comment: 0,
    verify: 0
  })
  const { categories, selectedCategories, getCategories, getMainCategories, selectCategory } = useCategories(form)
  const { tags, selectedTags, getTags, selectTag } = useTags(form)
  const { brands, selectedBrand, getBrands, selectBrand } = useBrands(form)

  const nameByLang = (langsName) => {
    return langsName ? langsName[locale.value] : ''
  }

  const moderationTypes = ref([
    { id: 0, name: t('statusUnderReview'), style: 'warning' },
    { id: 1, name: t('statusConfirmed'), style: 'success' },
    { id: 2, name: t('statusRejected'), style: 'danger' }
  ])

  const selectedModerationType = ref(moderationTypes.value[0])

  const getProduct = async () => {
    try {
      const { data } = await GET_PRODUCT({ id: route.params.id })
      form.value = {
        name_tm: data.name.tm,
        name_ru: data.name.ru,
        description_tm: data.description.tm,
        description_ru: data.description.ru,
        category: data.category?.map((category) => category.id) || [],
        tag: data.tag?.map((tag) => tag.id) || [],
        status: data.status,
        created_at: data.created_at,
        seller: data.seller?.id || null,
        note: data.note,
        brand: data.brand?.id || null,
        weight: Number(data.weight),
        length: Number(data.length),
        width: Number(data.width),
        height: Number(data.height),
        verify: 0,
        variants: [
          {
            method: 'update',
            id: data.variants[0].id,
            code: data.variants[0].code,
            price: Number(data.variants[0].old_price || data.variants[0].price),
            old_price: Number(data.variants[0].old_price ? data.variants[0].price : data.variants[0].old_price),
            discount: Number(data.variants[0].discount),
            count: Number(data.variants[0].count),
            images: [],
            order: Number(data.variants[0].order),
            value: null
          }
        ],
        options: data.options?.map((option) => option.value.id) || [],
        order: data.order,
        comment: data.comment
      }

      selectedCategories.value =
        data.category?.map((category) => ({ id: category.id, name: nameByLang(category.name) })) || []

      data.options.forEach((option) => {
        const findCharacteristic = characteristics.value.find((characteristic) => {
          return characteristic.id === option.option.id
        })
        if (findCharacteristic) {
          findCharacteristic.option = {
            id: option.value.id,
            name: option.value.name.ru
          }
          selectedCharacteristics.value.push(findCharacteristic)
        }
      })

      data.variants[0].images.forEach((image) => {
        form.value.variants[0].images.push(image.id)
        imagePreviews.value.push(image.image)
      })
      if (data.brand) selectedBrand.value = { id: data.brand.id, name: data.brand.name }

      selectedTags.value = data.tag?.map((tagItem) => ({ id: tagItem.id, name: tagItem.name.ru }))

      selectedModerationType.value =
        moderationTypes.value.find((type) => type.id === data.verify) || moderationTypes.value[0]

      if (data.video) {
        videoURL.value = data.video
      }
    } catch (error) {
      console.error(error)
    }
  }

  const characteristics = ref([])
  const getCharacteristics = async () => {
    try {
      const { data } = await GET_CHARACTERISTICS()
      characteristics.value =
        data?.map((characteristic) => {
          return {
            id: characteristic.id,
            name: characteristic.name.ru,
            category: characteristic.category?.map((categoryItem) => categoryItem.id) || [],
            options:
              characteristic.value?.map((option) => {
                return {
                  id: option.id,
                  name: nameByLang(option.name)
                }
              }) || []
          }
        }) || []
    } catch (error) {
      console.error(error)
    }
  }

  const categoryCharacteristics = computed(() => {
    const newSelectedCharacteristics = []
    const newOptions = []
    selectedCharacteristics.value.forEach((characteristic) => {
      const status = form.value.category?.some((formCategory) => {
        return characteristic?.category?.includes(formCategory)
      })

      if (status) {
        newSelectedCharacteristics.push(characteristic)
        characteristic.option?.id && newOptions.push(characteristic.option.id)
      }
    })

    selectedCharacteristics.value = newSelectedCharacteristics
    form.value.options = newOptions

    return characteristics.value?.filter((characteristic) => {
      return form.value.category?.some((formCategory) => {
        return characteristic.category.includes(formCategory)
      })
    })
  })

  const selectedCharacteristics = ref([])
  const addCharacteristic = () => {
    selectedCharacteristics.value.push(null)
    form.value.options.push(null)
  }
  const selectCharacteristic = (index, characteristic) => {
    selectedCharacteristics.value[index] = JSON.parse(JSON.stringify(characteristic))
  }
  const selectOption = (index, option) => {
    selectedCharacteristics.value[index].option = option
    form.value.options[index] = option.id
  }
  const deleteSelectedCharacteristic = (index) => {
    selectedCharacteristics.value.splice(index, 1)
    form.value.options.splice(index, 1)
  }

  const imagePreviews = ref([])

  const selectImages = async (files) => {
    for (let index = 0; index < files.length; index++) {
      imagePreviews.value.push(URL.createObjectURL(files[index]))
    }
    let newImages = await addImages(files)
    form.value.variants[0].images.push(...newImages)
  }

  const deletedImages = ref([])
  const deleteImage = (index) => {
    if (form.value.variants[0].images[index] !== null) {
      deletedImages.value.push(form.value.variants[0].images[index])
      form.value.variants[0].images.splice(index, 1)
    }
    imagePreviews.value.splice(index, 1)
  }

  const updateStatus = (status) => {
    form.value.status = status ? 1 : 0
  }

  const addImages = async (images) => {
    try {
      const formData = new FormData()

      for (let index = 0; index < images.length; index++) {
        formData.append('images', images[index])
      }

      const { data } = await ADD_IMAGES(formData)
      return data?.map((image) => image.id) || []
    } catch (error) {
      console.error(error)
    }
  }

  const removeProductImage = async () => {
    try {
      for (let imageId of deletedImages.value) {
        await DELETE_IMAGE({ id: imageId })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const videoURL = ref('')
  const video = ref('')
  const videoProgress = ref(0)
  const changeVideo = (files) => {
    if (files) {
      video.value = files[0]
      videoURL.value = URL.createObjectURL(files[0])
    }
  }

  const deleteVideo = () => {
    video.value = ''
    videoURL.value = ''
  }

  const error = ref(false)
  const checkValidation = () => {
    const isCharacteristics = selectedCharacteristics.value.every((characteristic) => {
      return required(characteristic) && required(characteristic?.option)
    })
    if (
      required(form.value.name_tm) &&
      required(form.value.name_tm) &&
      required(imagePreviews.value.length) &&
      required(selectedCategories.value.length) &&
      (required(form.value.seller) || isSeller.value) &&
      required(form.value.variants[0].code) &&
      required(form.value.variants[0].price) &&
      isCharacteristics
    ) {
      error.value = false
      return true
    } else {
      error.value = false
      setTimeout(() => {
        toast.addToast({
          text: 'Заполните все поля',
          status: 'warning'
        })
        error.value = true
      }, 0)
      return false
    }
  }

  const loading = ref(false)
  const saveProduct = async () => {
    try {
      if (!checkValidation()) {
        return
      }
      loading.value = true
      form.value.created_at = createDate()

      await removeProductImage()
      let imagesLoading = true
      while (imagesLoading) {
        if (form.value.variants[0].images.length !== imagePreviews.value.length) {
          await timeout(1000)
          continue
        }
        imagesLoading = false

        const saveForm = JSON.parse(JSON.stringify(form.value))
        saveForm.variants[0].price = form.value.variants[0].old_price || form.value.variants[0].price
        saveForm.variants[0].old_price = !!form.value.variants[0].old_price
          ? form.value.variants[0].price
          : form.value.variants[0].old_price

        let responseId = null

        if (route.params.id !== 'new') {
          const { data } = await EDIT_PRODUCT({ id: route.params.id, data: saveForm })
          responseId = data.id
        } else {
          const { data } = await SAVE_PRODUCT(saveForm)
          responseId = data.id
        }

        const onUploadProgress = {
          onUploadProgress: (progressEvent) => {
            videoProgress.value = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          }
        }

        await ADD_VIDEO({
          id: responseId,
          data: {
            video: video.value
          },
          onUploadProgress
        })
      }
      toast.addToast({
        text: 'Товар сохранен'
      })
      back()
    } catch (error) {
      toast.addToast({
        text: 'Какие то проблемы с сервером',
        status: 'error'
      })

      console.error(error)
      loading.value = false
    }
  }
  function timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  const openComments = () => {
    router.push(`/product-comments/${route.params.id}`)
  }
  const openChats = () => {
    router.push(`/product-chats/${route.params.id}`)
  }

  const getVerifyTitle = () => {
    return moderationTypes.value.find((type) => type.id === selectedModerationType.value.id)?.name || ''
  }
  const getVerifyStyle = () => {
    return moderationTypes.value.find((type) => type.id === selectedModerationType.value.id)?.style || ''
  }

  const updatePrice = () => {
    updateOldPrice()
  }

  const updateOldPrice = () => {
    const present = form.value.variants[0]?.price ? form.value.variants[0].price / 100 : 0
    const betweenPrice = form.value.variants[0].price - form.value.variants[0].old_price

    let discount = form.value.variants[0]?.old_price ? Math.round(betweenPrice / present) : 0
    form.value.variants[0].discount = discount < 0 ? 0 : discount
  }

  const updateDiscount = () => {
    const present = form.value.variants[0].price / 100
    let oldPrice = Math.round(form.value.variants[0].price - present * form.value.variants[0].discount)
    form.value.variants[0].old_price = form.value.variants[0].discount > 0 ? oldPrice : 0
  }

  const computedCommission = computed(() => {
    let categoryCommission = 0
    selectedCategories.value?.map((category) => {
      categoryCommission = category.fee > categoryCommission ? category.fee : categoryCommission
    })
    return seller.fee || categoryCommission
  })

  const computedTotalPrice = computed(() => {
    const currentPrice = form.value.variants[0].old_price || form.value.variants[0].price
    const percentCount = Math.round((currentPrice / 100) * Number(computedCommission.value))
    return currentPrice - percentCount
  })

  const getProductStructure = async () => {
    getBrands()
    getTags()
    getMainCategories()
    getCategories()
    await getCharacteristics()

    if (route.params.id !== 'new') getProduct()
  }

  onMounted(() => {
    getProductStructure()
  })
</script>

<template>
  <div class="menu _show">
    <div id="product" class="menu__wrapper">
      <div class="menu__head _active">
        <div class="menu__left">
          <button @click="back" class="menu__back">
            <base-icon name="arrowLeft" />
            <p>{{ t('back') }}</p>
          </button>
          <m-badge v-if="route.params.id !== 'new'" :title="getVerifyTitle()" :styles="getVerifyStyle()" />
        </div>
        <div class="product__incomes">
          <div class="product__income">
            <m-button @click="openComments" prev-icon="comments" outline />
          </div>
          <div class="product__income">
            <m-button @click="openChats" prev-icon="chats" outline />
          </div>
        </div>
      </div>
      <div class="menu__body">
        <div class="product">
          <div class="product__wrapper">
            <div class="product__content">
              <m-row>
                <m-col cols="12">
                  <m-text-filed
                    v-model.trim="form.name_ru"
                    :disabled="loading"
                    :error="error && optional(form.name_ru)"
                    :label="t('nameRu')"
                    required
                  />
                </m-col>
                <m-col cols="12">
                  <m-text-filed
                    v-model.trim="form.name_tm"
                    :disabled="loading"
                    :error="error && optional(form.name_tm)"
                    :label="t('nameTm')"
                    required
                  />
                </m-col>
                <m-col cols="12">
                  <product-images
                    @select="selectImages"
                    @delete="deleteImage"
                    :images="imagePreviews"
                    :disabled="loading"
                    :error="error && optional(imagePreviews.length)"
                  />
                </m-col>
                <m-col cols="12">
                  <m-select
                    @select-item="selectCategory"
                    @search="getCategories"
                    :items="categories"
                    :selected-items="selectedCategories"
                    :disabled="loading"
                    :error="error && optional(selectedCategories.length)"
                    required
                    searchable
                    :label="t('category')"
                    :popUpTitle="t('category')"
                  />
                </m-col>
                <m-col cols="12">
                  <m-pop-up-dropdown
                    @search="getBrands"
                    @select-item="selectBrand"
                    :items="brands"
                    :selected-item="selectedBrand"
                    :disabled="loading"
                    :label="t('brand')"
                    :popUpTitle="t('brand')"
                    searchable
                  />
                </m-col>
                <m-col cols="12">
                  <m-select
                    @search="getTags"
                    @select-item="selectTag"
                    :selected-items="selectedTags"
                    :items="tags"
                    :disabled="loading"
                    :label="t('tag')"
                    :popUpTitle="t('tag')"
                    searchable
                  />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    @updateValue="updatePrice"
                    v-model.trim="form.variants[0].price"
                    :disabled="loading"
                    :error="error && optional(form.variants[0].price)"
                    :label="t('price')"
                    inner-label="TMT"
                    type="number"
                    required
                  />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    v-model.trim="form.variants[0].old_price"
                    :disabled="loading"
                    @updateValue="updateOldPrice"
                    :label="t('discount')"
                    inner-label="TMT"
                    type="number"
                  />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    v-model.trim="form.variants[0].discount"
                    :disabled="loading"
                    @updateValue="updateDiscount"
                    :label="t('percent')"
                    inner-label="%"
                    type="number"
                  />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    v-model.trim="form.variants[0].count"
                    :disabled="loading"
                    :label="t('productCount')"
                    type="number"
                  />
                </m-col>
                <m-col cols="12">
                  <m-text-filed
                    v-model.trim="form.variants[0].code"
                    :disabled="loading"
                    :label="t('code')"
                    inner-label="#"
                  />
                </m-col>
                <m-col cols="5">
                  <m-text-filed
                    :value="computedCommission"
                    :label="t('commission')"
                    background
                    disabled
                    inner-label="%"
                  />
                </m-col>
                <m-col cols="7">
                  <m-text-filed
                    :value="computedTotalPrice"
                    :label="t('totalPrice')"
                    background
                    disabled
                    inner-label="TMT"
                  />
                </m-col>
                <m-col cols="12">
                  <m-textarea v-model.trim="form.description_ru" :disabled="loading" :label="t('descriptionRu')" />
                </m-col>
                <m-col cols="12">
                  <m-textarea v-model.trim="form.description_tm" :disabled="loading" :label="t('descriptionTm')" />
                </m-col>
                <m-col cols="12">
                  <m-divider :title="t('characteristics')" />
                </m-col>
                <template v-for="(selectedCharacteristic, index) in selectedCharacteristics">
                  <m-col cols="6">
                    <m-pop-up-dropdown
                      @select-item="(characteristic) => selectCharacteristic(index, characteristic)"
                      :selected-item="selectedCharacteristic"
                      :items="categoryCharacteristics"
                      :disabled="loading"
                      :label="t('characteristic')"
                      :popUpTitle="t('characteristic')"
                      :error="error && optional(selectedCharacteristic)"
                      required
                    />
                  </m-col>
                  <m-col cols="6" class="flex gap-10 flex-y-end">
                    <m-pop-up-dropdown
                      @select-item="(option) => selectOption(index, option)"
                      :selected-item="selectedCharacteristic?.option"
                      :items="selectedCharacteristic?.options"
                      :disabled="!selectedCharacteristic || loading"
                      :error="error && optional(selectedCharacteristic?.option)"
                      :label="t('variant')"
                      :popUpTitle="t('variant')"
                      required
                    />
                    <m-button
                      @click="deleteSelectedCharacteristic(index)"
                      :disabled="loading"
                      prev-icon="delete"
                      theme="error"
                    />
                  </m-col>
                </template>
                <m-col cols="12">
                  <m-button
                    @click="addCharacteristic"
                    :disabled="!form.category.length || loading"
                    prev-icon="add"
                    :title="t('addCharacteristic')"
                    block
                    outline
                  />
                </m-col>
                <m-col cols="12">
                  <m-divider :title="t('video')" />
                </m-col>
                <m-col cols="12">
                  <div class="product__video">
                    <m-image-uploader
                      @changeFile="changeVideo"
                      :title="t('uploadVideo')"
                      :disabled="loading"
                      :preview="false"
                      accept="video/*"
                    />
                  </div>
                </m-col>
                <m-col cols="12">
                  <div v-if="videoURL" class="product__video-preview">
                    <video :src="videoURL" controls></video>
                    <div v-if="videoProgress" class="product__video-upload-progress">{{ videoProgress }}%</div>
                    <m-button
                      @click="deleteVideo"
                      :disabled="loading"
                      prev-icon="delete"
                      theme="error"
                      class="product__video-delete"
                    />
                  </div>
                </m-col>
                <m-col cols="12">
                  <m-divider :title="t('forDelivery')" />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    v-model.trim="form.weight"
                    :disabled="loading"
                    :label="t('weight')"
                    inner-label="кг"
                    type="number"
                  />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    v-model.trim="form.width"
                    :disabled="loading"
                    :label="t('width')"
                    inner-label="см"
                    type="number"
                  />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    v-model.trim="form.length"
                    :disabled="loading"
                    :label="t('length')"
                    inner-label="см"
                    type="number"
                  />
                </m-col>
                <m-col cols="6">
                  <m-text-filed
                    v-model.trim="form.height"
                    :disabled="loading"
                    :label="t('height')"
                    inner-label="см"
                    type="number"
                  />
                </m-col>
                <m-col cols="12">
                  <m-checkbox
                    @update-status="updateStatus"
                    :disabled="loading"
                    :value="!!form.status"
                    :title="t('status')"
                  />
                </m-col>
                <m-col cols="12">
                  <m-text-filed v-model.trim="form.note" :disabled="loading" :label="t('note')" />
                </m-col>
                <m-col cols="12">
                  <m-divider />
                </m-col>
                <m-col cols="12">{{ t('afterSavingProductText') }}</m-col>
                <m-col cols="12">
                  <m-button @click="saveProduct" :loading="loading" :title="t('save')" block />
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
  .menu__left {
    display: flex;
    align-items: center;
    gap: 10px;
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
    // .product__content
    &__content {
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px 20px;
    }
    // .product__video
    &__video {
      .image-uploader {
        padding-top: 50%;
      }
    }
    // .product__video-preview
    &__video-preview {
      padding-top: 50%;
      position: relative;
      video {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    // .product__video-upload-progress
    &__video-upload-progress {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--green-500);
      font-size: 40px;
      font-weight: 600;
      user-select: none;
      pointer-events: none;
    }

    // .product__incomes
    &__incomes {
      display: flex;
      gap: 10px;
    }
    // .product__income
    &__income {
      position: relative;
      span {
        width: 10px;
        height: 10px;
        display: block;
        user-select: none;
        border-radius: 50%;
        background-color: var(--danger-700);
        position: absolute;
        bottom: -2px;
        right: -2px;
      }
      &:deep() {
        .button {
          padding: 8px;
        }
      }
    }

    // .product__video-delete
    &__video-delete {
      position: absolute;
      top: 10px;
      right: 10px;
    }
  }
</style>
