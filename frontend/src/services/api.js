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

export const getOperationDetail = async (woNumber, operationNum) => {
  const res = await axios.get(`${BASE_URL}/workorder/${encodeURIComponent(woNumber)}/operations/${encodeURIComponent(operationNum)}`)
  return res.data
}

export const uploadRoutingPdf = async (file) => {
  const formData = new FormData()
  formData.append('file', file)
  const res = await axios.post(`${BASE_URL}/routing/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export const createNote = async (woNumber, operationNum, noteText, authorName, authorDept) => {
  const res = await axios.post(
    `${BASE_URL}/workorder/${encodeURIComponent(woNumber)}/operations/${encodeURIComponent(operationNum)}/notes`,
    { noteText, authorName, authorDept }
  )
  return res.data
}
