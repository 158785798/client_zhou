import router from "../router/index.js";

const to_tab = async (to, query) => {
  query['index'] = 0
  await router.push({name: to, query: query})
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
  to_tab,
  scroll

}