import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './global.scss'
import './assets/font/iconfont.css'
import "animate.css/animate.min.css"


import router from "./router/index.js";
import store from "./store/index.js";


createApp(App).use(ElementPlus).use(store)
    .use(router).mount('#app')
