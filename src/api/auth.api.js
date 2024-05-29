import { request } from './generic.api'

export const AUTH = (data) => request({ url: `/api/seller/auth/login/`, data, method: 'POST' })

export const CHECK_SELLER_AUTH = () => request({ url: `/api/seller/auth/login/?lang=all`, method: 'GET' })

export const REGISTRATION = ({ data }) => request({ url: '/api/seller/', data, method: 'POST', file: true })

export const EDIT_PROFILE = ({ data, id }) => request({ url: `/api/seller/${id}`, data, method: 'PUT', file: true })
