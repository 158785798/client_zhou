import axios from "axios";
import router from "../router/index.js";
import {ElMessage} from "element-plus";


const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8090/api' : 'https://auspollo.top/api',
})

instance.interceptors.request.use(
    config => {
      const authorization = window.localStorage.getItem('token_zhou')
      if (authorization) {
        config.headers.Authorization = authorization
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
)
instance.interceptors.response.use(
    response => {
      if (response.status !== 200) {
        if (response.status === 401) {
          router.push('/login')
        } else {
          ElMessage.error(response.data.msg)
        }
      }
      return response.data
    },
    error => {
      if (error.status === 401) {
        router.push('/login')
      } else {
        ElMessage.error(error.response.data.msg)

        return Promise.reject(error)
      }
    }
)
export default instance
