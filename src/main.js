import {createApp} from 'vue'
import App from './App.vue'
import router from "./router/index.js"
import store from "./store/index.js"
import ElementPlus from 'element-plus'
import socket from "./utils/socket.js";
import 'default-passive-events'
import 'element-plus/dist/index.css'
import './global.scss'
import './assets/font/iconfont.css'


// const socketIo = new VueSocketIO({
//   debug: true,
//   connection: 'http://127.0.0.1:8090/msg/1',
//   options: {
//     // 创建时是否自动连接 我们这里设定为false,在指定页面再开启
//     autoConnect: true,
//     // 路径(默认值：/socket.io/)
//     path: "/msg/",
//     // 目前有两种传输方式：HTTP long-polling（可简称：polling）、WebSocket
//     transports: ['polling'],
//     // 附加请求头（在服务器端的 socket.handshake.headers 对象中找到）
//     extraHeaders: {"Access-Control-Allow-Origin": '*'},
//   }
// })
const app = createApp(App)
app.config.globalProperties.$socket = socket
app.use(ElementPlus).use(store).use(router).mount('#app')
