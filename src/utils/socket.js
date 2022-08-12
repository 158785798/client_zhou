import SocketIo from 'socket.io-client'
import store from "../store/index.js";
import {ElMessage} from "element-plus";


const url = process.env.NODE_ENV === 'development' ? 'ws://127.0.0.1:8090' : 'wss://auspollo.top'

const socket = SocketIo(
    url,
    {
      transports: ['websocket'],
      timeout: 36000000,
      reconnection: true,
      reconnectionDelay: 2000,
      cores: {
        origin: '*'
      },
      query: {
        u_id: store.state.local.userInfo.username
      }
    }
)
socket.on('connect', () => {
  console.log('连接成功！')
})
socket.on('online', (value) => {
  ElMessage.success(value+ '上线了 快去找 Ta 聊天吧！')
})
export default socket

