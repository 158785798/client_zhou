import {createRouter, createWebHashHistory} from 'vue-router'
import Home from "../views/Home/Home.vue";
import HIndex from "../views/Home/HIndex.vue";
import Login from "../views/Login.vue";
import OurMeow from "../views/OurMeow.vue";
import SignUp from "../views/SignUp.vue";
import UIndex from "../views/UserPage/UIndex.vue";
import PasswordReset from "../views/PasswordReset.vue";
import CommentPage from "../views/TiamoBlog/SingleCell.vue";
import WeChat from "../components/WeChat.vue";
import Square from "../views/TiamoBlog/Square.vue";
import TIndex from "../views/TiamoBlog/TIndex.vue";
import Blog from "../views/UserPage/Blog.vue";
import Album from "../views/UserPage/Album.vue";

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
      redirect: '/HIndex',
      meta: {
        title: 'Candy Cats'
      },
      component: Home,
      children: [
        {
          path: '/HIndex',
          name: 'HIndex',
          meta: {
            title: 'HIndex'
          },
          component: HIndex
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
          path: '/UIndex',
          name: 'UIndex',
          redirect: '/UIndex/Blog',
          meta: {
            title: 'UIndex'
          },
          component: UIndex,
          children:[
            {
              path: 'Blog',
              name: 'Blog',
              meta: {
                title: 'Blog'
              },
              component: Blog,
            },
            {
              path: 'Album',
              name: 'Album',
              meta: {
                title: 'Album'
              },
              component: Album,
            }
          ]

        },
        {
          path: '/TIndex',
          name: 'TIndex',
          redirect: '/Square',
          meta: {
            title: 'TIndex'
          },
          component: TIndex,
          children: [
            {
              path: '/Square',
              name: 'Square',
              meta: {
                title: 'Square'
              },
              component: Square,
            },
            {
              path: '/CommentPage',
              name: 'CommentPage',
              meta: {
                title: 'CommentPage'
              },
              component: CommentPage,
            }]
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
      return next({name: 'Login', query: {next: to.name}})
    }
  }
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
export default router


