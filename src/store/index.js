import {createStore} from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import {local} from "./modules/local.js";
import {session} from "./modules/session.js";

// const modulesFiles = import.meta.globEager('./modules/*.js')
// const modules = Object.entries(modulesFiles).reduce((modules, [path, mod]) => {
//   const moduleName = path.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')
//   modules[moduleName] = mod.default
//   return modules
// }, {})

export default createStore({
  modules:{
    local,
    session
  },

  plugins: [createPersistedState({
    paths: ['local'],
  })],
  state: {
    pageRefresh: {
      userInfoRefresh: true,
      userFollowedMomentsRefresh: true,
      allMomentsRefresh: true,
    },
  },
  mutations: {

    updateUserMoments(state, payload) {
      state.userMoments = payload
    },
  }
})
