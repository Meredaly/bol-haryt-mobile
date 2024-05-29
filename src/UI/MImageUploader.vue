<script setup>
  import { ref } from 'vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import { useI18n } from 'vue-i18n'

  const emit = defineEmits(['changeFile'])

  const { t } = useI18n()
  const props = defineProps({
    imagePath: { type: [String, File], default: null },
    preview: { type: Boolean, default: true },
    circle: { type: Boolean, default: false },
    title: { type: String, default: '' },
    multiple: { type: Boolean, default: false },
    accept: { type: String, default: null },
    disabled: { type: Boolean, default: false }
  })

  const prevImage = ref(props.imagePath || null)
  const image = ref(null)
  const changeFile = (files) => {
    if (files) {
      emit('changeFile', files)
      if (props.preview) {
        prevImage.value = URL.createObjectURL(files[0])
      }
    }
    image.value.value = ''
  }
</script>

<template>
  <div :class="['image-uploader', { _circle: props.circle }]">
    <div class="image-uploader__preview">
      <img v-if="prevImage" :src="prevImage" />
    </div>
    <label class="image-uploader__uploader">
      <div class="image-uploader__icon">
        <base-icon name="imageAdd" />
      </div>
      <div class="image-uploader__text">{{ title }}</div>
      <input type="file" @change="(e) => changeFile(e.target.files)" :multiple="multiple" :accept="accept" ref="image" :disabled="disabled" />
    </label>
  </div>
</template>

<style lang="scss" scoped>
  .image-uploader {
    width: 100%;
    background: var(--gray-100);
    border-radius: 8px;
    position: relative;
    padding-top: 100%;

    &:hover {
      .image-uploader__preview {
        z-index: 0;
      }
      .image-uploader__uploader {
        z-index: 1;
      }
    }
    // .image-uploader__preview
    &__preview {
      width: 100%;
      height: 100%;
      z-index: 1;
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      position: absolute;
      top: 0;
      left: 0;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
    // .image-uploader__uploader
    &__uploader {
      border: 1px dashed var(--success-600);
      border-radius: 8px;
      position: absolute;
      z-index: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      color: var(--success-600);
      input {
        display: none;
      }
    }
    // .image-uploader__icon
    &__icon {
      &:deep() {
        svg {
          width: 30px;
          height: 30px;
        }
      }
    }
    // .image-uploader__text
    &__text {
      padding: 4px;
      text-align: center;
    }
    &._circle {
      border-radius: 50%;
      .image-uploader__preview,
      .image-uploader__uploader {
        border-radius: 50%;
      }
    }
  }
</style>
