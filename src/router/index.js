import {createRouter, createWebHashHistory} from 'vue-router'
import Home from "../views/Home/Home.vue";
import Index from "../views/Home/Index.vue";
import Login from "../views/Login.vue";
import OurMeow from "../views/OurMeow.vue";
import SignUp from "../views/SignUp.vue";
import UserPage from "../views/UserPage.vue";
import PasswordReset from "../views/PasswordReset.vue";
import TiamoBlog from "../views/TiamoBlog.vue";
import WeChat from "../components/WeChat.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/Home',
      meta: {
        title: 'Candy Cats'
      },
    },
    {
      path: '/Home',
      name: 'Home',
      redirect: '/Index',
      meta: {
        title: 'Candy Cats'
      },
      component: Home,
      children: [
        {
          path: '/Index',
          name: 'Index',
          meta: {
            title: 'Index'
          },
          component: Index
        },
        {
          path: '/OurMeow',
          name: 'OurMeow',
          meta: {
            title: 'OurMeow'
          },
          component: OurMeow
        },
        {
          path: '/UserPage',
          name: 'UserPage',
          meta: {
            title: 'UserPage'
          },
          component: UserPage

        },
        {
          path: '/TiamoBlog',
          name: 'TiamoBlog',
          meta: {
            title: 'TiamoBlog'
          },
          component: TiamoBlog
        },
        {
          path: '/WeChat',
          name: 'WeChat',
          meta: {
            title: 'WeChat'
          },
          component: WeChat
        }
      ]
    },
    {
      path: '/Login',
      name: 'Login',
      meta: {
        title: 'Login'
      },
      component: Login
    },
    {
      path: '/SignUp',
      name: 'SignUp',
      meta: {
        title: 'SignUp'
      },
      component: SignUp
    },
    {
      path: '/PasswordReset',
      name: 'PasswordReset',
      meta: {
        title: 'PasswordReset'
      },
      component: PasswordReset
    },


  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return {left: 0, top: 0}
    }
  },
})
router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  const arr = ['WeChat']
  if (to.name !== 'Home' && to.name !== 'Index' && to.name !== 'Login' && to.name !== 'SignUp') {
    if (!window.localStorage.getItem('token_zhou')) {
      return next({name: 'Login', query:{next: to.name}})
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router


