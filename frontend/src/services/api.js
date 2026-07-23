import axios from 'axios'

const BASE_URL = 'http://localhost:5062/api'

export const importExcel = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await axios.post(`${BASE_URL}/import`, formData)
  return res.data
}

export const getDashboard = async () => {
  const res = await axios.get(`${BASE_URL}/dashboard`)
  return res.data
}

export const getWorkOrders = async (params = {}) => {
  const res = await axios.get(`${BASE_URL}/workorder`, { params })
  return res.data
}

export const getWorkOrderDetail = async (woNumber) => {
  const res = await axios.get(`${BASE_URL}/workorder/${encodeURIComponent(woNumber)}`)
  return res.data
}