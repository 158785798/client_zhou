import router from "../router/index.js";
import store from "../store/index.js";
import d from "../assets/error.jpg";
import {instance} from "../api/request.js";

const set_default = (e) => {
  e.srcElement.src = d
}

const get_fans = async (u_id, index, is_self) => {
  store.commit('session/show_fans', {show: true, index: index})
  const res = await instance.get('/get_fans', {params: {u_id: u_id, index: index, is_self: is_self}})
  store.commit('session/concat_fans', res.data)
}

const to_tab = async (to, query) => {
  store.commit('session/show_fans', {show: false})
  query['index'] = 0
  await router.push({name: to, query: query})
}

const to_do = (menu, blog_id) => {

  if (menu.id === 1) {
    store.commit('session/show_global_tip', '置顶成功')
  } else if (menu.id === 8) {
    store.commit('session/show_global_tip', '取消置顶')
  } else if ([2, 3, 4].includes(menu.id)) {
    store.commit('session/show_global_tip', '修改成功')
  } else if (menu.id === 5) {
    store.commit('session/show_dialog', {obj_id: blog_id, text: '确定删贴吗？'})
  } else if (menu.id === 6) {
    store.commit('session/show_global_tip', '收藏成功')
  } else if (menu.id === 7) {
    store.commit('session/show_global_tip', '已举报')
  }
}

const getBase64 = (file, callback) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = () => callback(reader.result);
}

const scroll = (self) => {
  window.onscroll = () => {
    // 整个页面的高度
    const scrollHeight = document.body.scrollHeight
    // 当前可视区的顶部到页面顶部的高度，||是做兼容处理的
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
    // 当前可视区的高度
    const clientHeight = document.documentElement.clientHeight
    // 可视区底部到页面底部的高度，即滚动条与底部的距离
    const instance = scrollHeight - scrollTop - clientHeight
    // 当滚动条与底部的距离小于100时就触发加载数据
    if (instance < 100) {
      if (self.noMore) return
      self.endLoading = true
      setTimeout(() => {
        self.pageNum++
        self.get_blogs()
      }, 1000)
    }
  }
}

export {
  get_fans,
  set_default,
  to_tab,
  to_do,
  getBase64,
  scroll
}
