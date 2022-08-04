import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'

const modulesFiles = import.meta.globEager('./modules/*.js')
const modules = Object.entries(modulesFiles).reduce((modules, [path, mod]) => {
  const moduleName = path.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
  modules[moduleName] = mod.default
  return modules
}, {})

export default createStore({
  modules,
  plugins: [createPersistedState({
        storage: window.localStorage
      }
  )],
  state: {
    userInfo: {},
    t: 0,
    passwordReset_t: 0,
    autoPlayTip: true,
    chatInfo: [],
    pageRefresh: {
      userInfoRefresh: true,
      userFollowedMomentsRefresh: true,
      allMomentsRefresh: true,
    },
    pub: false,
    trans: false,
    blogs: []
  },
  mutations: {
    saveUserInfo(state, payload) {
      for (let i in payload) {
        state.userInfo[i] = payload[i]
      }
    },
    clearUserInfo(state) {
      state.userInfo = {}
    },
    set_pub(state, payload) {
      state[payload.name] = payload.value
    },
    set_blogs(state, payload) {
      state.blogs = payload
    },
    unShiftBlogs(state, payload) {
      state.blogs.unshift(payload)
    },
    spliceBlogs(state, payload) {
      state.blogs.splice(payload, 1)
    },
    set_t(state, payload) {
      state.t = payload
    },
    set_autoPlayTip(state, payload) {
      state.autoPlayTip = payload
    },
    set_passwordReset_t(state, payload) {
      state.passwordReset_t = payload
    },
    push_chatInfo(state, payload) {
      state.chatInfo.push(payload)
      setTimeout(() => {
        const div = document.getElementById('container')
        div.scrollTop = div.scrollHeight;
      }, 10)
    },
    updateUserMoments(state, payload) {
      state.userMoments = payload
    },
  }
})
