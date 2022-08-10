export const local = {
  namespaced: true,
  state:{
    t: 0,
    chatInfo: [],
    userInfo: {},
    passwordReset_t: 0,
    autoPlayTip: true,
  },
  mutations:{
    saveUserInfo(state, payload) {
      for (let i in payload) {
        state.userInfo[i] = payload[i]
      }
    },
    push_chatInfo(state, payload) {
      state.chatInfo.push(payload)
      setTimeout(() => {
        const div = document.getElementById('container')
        div.scrollTop = div.scrollHeight;
      }, 10)
    },
    clearUserInfo(state) {
      state.userInfo = {}
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
  }
}
