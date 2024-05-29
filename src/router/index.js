import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '@/store/auth'

const Products = () => import('@/views/Products.vue')
const Login = () => import('@/views/Login.vue')
const Registration = () => import('@/views/Registration.vue')
const Product = () => import('@/views/Product.vue')
const ProductMulti = () => import('@/views/ProductMulti.vue')
const Profile = () => import('@/views/Profile.vue')
const Orders = () => import('@/views/Orders.vue')
const Chats = () => import('@/views/Chats.vue')
const Chat = () => import('@/views/Chat.vue')
const ProductChats = () => import('@/views/ProductChats.vue')
const Comments = () => import('@/views/Comments.vue')
const Comment = () => import('@/views/Comment.vue')
const ProductComments = () => import('@/views/ProductComments.vue')
const ProfileEdit = () => import('@/views/ProfileEdit.vue')
const Variant = () => import('@/views/Variant.vue')
const Withdrawer = () => import('@/views/Withdrawer.vue')

const routes = [
  { path: '/', name: 'products', component: Products },
  { path: '/product/:id', name: 'product', component: Product },
  { path: '/product-multi/:id', name: 'product-multi', component: ProductMulti },
  { path: '/product-comments/:id', name: 'product-comments', meta: { layout: 'empty' }, component: ProductComments },
  { path: '/product-chats/:id', name: 'product-chats', component: ProductChats },
  { path: '/product-variant/:id', name: 'product-variant', component: Variant },
  { path: '/profile', name: 'profile', component: Profile },
  { path: '/profile-edit', name: 'profile-edit', component: ProfileEdit },
  { path: '/orders', name: 'orders', component: Orders },
  { path: '/chats', name: 'chats', component: Chats },
  { path: '/chat/:id', name: 'chat', meta: { layout: 'empty' }, component: Chat },
  { path: '/comments', name: 'comments', component: Comments },
  { path: '/comment/:id', name: 'comment', meta: { layout: 'empty' }, component: Comment },
  { path: '/login', name: 'login', meta: { layout: 'empty' }, component: Login },
  { path: '/registration', name: 'registration', meta: { layout: 'empty' }, component: Registration },
  { path: '/withdrawer', name: 'withdrawer', component: Withdrawer }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuth()
  if (to.name === 'login' || to.name === 'registration') {
    next()
    return
  }
  if (!auth.isAuth) {
    await auth.getProfile()
  }
  next()
})
export default router
