import { request } from './generic.api'

export const GET_LOCATIONS = () => request({ url: `/api/order/address/?lang=all`, method: 'GET' })

export const GET_LOCATION = (data) => request({ url: `/api/order/address/${data.id}`, method: 'GET' })

export const ADD_LOCATION = (data) => request({ url: `/api/order/address/`, data, method: 'POST' })

export const EDIT_LOCATION = ({ id, data }) => request({ url: `/api/order/address/${id}`, data, method: 'PUT' })

export const DELETE_LOCATION = (data) => request({ url: `/api/order/address/${data.id}`, method: 'DELETE' })
