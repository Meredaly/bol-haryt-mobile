import { ref } from 'vue'
import { GET_SHOPS } from '@/api/shop.api'

export function useShops(form) {
  const shops = ref([])
  const getShops = async (page = 1) => {
    try {
      const { data } = await GET_SHOPS({
        limit: 20,
        page: page
      })

      shops.value =
        data?.map((shop) => ({
          id: shop.id,
          name: shop.market_name
        })) || []
    } catch (error) {
      console.error(error)
    }
  }

  const selectedShop = ref([])
  const selectShop = (shop) => {
    selectedShop.value = shop
    form.seller = shop.id
  }

  return {
    shops,
    selectedShop,
    getShops,
    selectShop
  }
}
