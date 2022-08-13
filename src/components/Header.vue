<template>
  <div class="header">
    <div class="flex-align-items">
      <a href="javascript:" @click="to_tab('Home')" style="display: flex; align-items: center;">
        <img src="../assets/logo.png" alt=""
             style="border-radius: 50%; width: 48px; margin-left: 20px">
        <strong style="margin-left: 10px">Candy Cats</strong>
      </a>
    </div>
    <div>
      <audio loop="loop" id="audio" autoplay="autoplay"
             src="https://auspollo.top/static/music/cats.mp3"></audio>
    </div>
    <div>
      <img v-if="play" src="../assets/music_start.png" alt="" style="width: 40px" @click="playMusic">
      <img v-else src="../assets/music_stop.png" alt="" style="width: 40px" @click="playMusic">
    </div>

    <div class="flex-align-items" style="justify-content: space-around; margin: auto 0;position: relative">
      <a href="javascript:" class="homeMenus" @mouseenter="aboutShow=true" @mouseleave="aboutShow=false">
        <strong style="margin: auto 10px;">
          About
        </strong></a>
      <div :class="{about: aboutShow}" style="transform: scale(0);position: absolute;z-index: 100">
        好好生活，慢慢遇见
        <br>
        Company is better than detail than love.
      </div>
      <a href="javascript:" v-for="(item, index) in homeMenus" :key="index">
        <a href="javascript:" class="homeMenus" @click="to_tab(item.route)">
          <strong style="margin: auto 10px;">
            {{ item.name }}
          </strong></a>
      </a>
      <div v-if="JSON.stringify(userInfo) === '{}'" style="margin-left: 20px; margin-right: 20px">
        <a href="javascript:" class="login" @click="to_tab('Login')">
          <strong>Sign in</strong>
        </a>
        <a href="javascript:" @click="to_tab('SignUp')" class="login" style="border: 1px solid #f9f7f8;">
          <strong>Sign up</strong></a>
      </div>

      <div v-else class="flex-align-items cursor-pointer"
           style="position: relative;color:#000;margin-left: 30px; margin-right: 20px">
        <div class="flex-align-items">
          <span @click="show_msg_box"
                style="user-select: none;margin-right: 20px;padding-right: 20px;color: rgba(0,0,0,0.5);" class="u-msg">
          <i style=" font-size: 20px" class="iconfont iconfontyoujian u-msg"></i>
            <span v-show="msgCount!=0" style="padding: 0 5px;font-size: 12px;background-color: red;
            color: #fff;border-radius:10px;position: absolute;line-height: 1.2;
            transform: translate(-8px, -5px)">
              <span v-if="msgCount<=99">{{ msgCount }}</span>
              <span v-else>99+</span>
            </span>
            </span>
          <div @click="dropdownMenuShow=!dropdownMenuShow" class="header-link flex-align-items"
               :class="{'dropdown-menu-sw': dropdownMenuShow}">
            <img :src="userInfo.avatarUrl" alt="" style="width: 24px; border-radius: 50%">
            <span class="dropdown-caret"></span>
          </div>
        </div>

        <div v-show="dropdownMenuShow" class="dropdown-menu">
          <a @click="to_tab('UIndex', userInfo.id)" href="javascript:" class="header-nva-current-user"
             style="padding: 8px 16px; display: block;white-space: nowrap">
            Signed in as <strong>
            {{ userInfo.username }}
          </strong>
          </a>
          <el-divider style="margin: 5px"></el-divider>

          <a href="javascript:" style="padding: 8px 16px; display: block;color:#4b4a4a;white-space: nowrap;"
             class="sss" @click="signOut">
            Sign out
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive, toRefs} from "vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";

export default {
  name: "Header",
  props: ['msgCount'],
  emits: ['show_msg_box'],
  setup(props, context) {
    const store = useStore()
    const router = useRouter();
    onMounted(() => {
          setTimeout(() => {
            const audio = document.getElementById('audio')
            self.play = !audio.paused
            if (store.state.autoPlayTip) {
              store.commit('local/set_autoPlayTip', false)
              ElMessage.warning('您的浏览器不支持自动播放， 请手动点击')
            }
          }, 500)
        }
    )
    const self = reactive({
          play: true,
          aboutShow: false,
          dropdownMenuShow: false,
          show_msg_box: () => {
            context.emit('show_msg_box')
          },
          playMusic: () => {
            const audio = document.getElementById('audio')
            self.play ? audio.pause() : audio.play()
            self.play = !self.play
          },
          signOut: () => {
            self.dropdownMenuShow = false
            window.localStorage.removeItem('token_zhou')
            store.commit('local/set_autoPlayTip', true)
            store.commit('local/clearUserInfo')
            router.push('Home')

          },
          userInfo: computed(() => store.state.local.userInfo),
          homeMenus: [
            {
              name: 'OurMeow',
              route: 'OurMeow',
            },
            {
              name: 'TiamoBlog',
              route: 'TIndex',
            },
            {
              name: 'WeChat',
              route: 'WeChat',
            },
          ],
          to_tab: (route, u_id = null) => {
            self.dropdownMenuShow = false
            router.push({name: route, query: {u_id: u_id, index: 0}})
          },
        }
    )
    return {
      ...toRefs(self)
    }
  }
}
</script>

<style scoped>
.header {
  border-radius: 10px;
  background: linear-gradient(rgba(243, 157, 47, 0.9), rgba(220, 161, 220, 0.94));
  box-shadow: 0 0 20px 3px rgba(171, 172, 176, 0.91);
  position: fixed;
  width: 1250px;
  top: 0;
  z-index: 100;
  padding: 4px 0;
  display: flex;
  justify-content: space-between;
  margin: auto;
}

.dropdown-menu {
  position: absolute;
  width: 180px;
  font-size: 14px;
  background-color: #fff;
  box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.25);
  border-radius: 8px;
  overflow: hidden;
  right: 10px;
  z-index: 1000;
  top: 45px
}

.flex-align-items {
  display: flex;
  align-items: center;
}


.dropdown-menu:before {
  content: '';
  top: -16px;
  right: 9px;
  left: auto;
  position: absolute;
  display: inline-block;
  border: 8px solid transparent;
  border-bottom-color: #ffffff;
}

.dropdown-menu-sw::after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 80;
  position: fixed;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.09);
}

.sss:hover {
  background-color: #2e7ccd;
  color: white !important;
}

.dropdown-caret {
  display: inline-block;
  width: 0;
  height: 0;
  vertical-align: middle;
  content: "";
  border-style: solid;
  border-width: 4px 4px 0;
  border-right-color: transparent;
  border-bottom-color: transparent;
  border-left-color: transparent;
}

.about {
  transform: scale(1.2) !important;
  box-shadow: 0 0 10px 5px #bf7380;
  border-radius: 20px;
  top: 60px;
  left: -30px;
  color: #f4e6e6;
  padding: 20px;
  transition-duration: 0.5s;
  background-color: #4daabe
}

.login {
  font-size: 16px;
  margin: auto 5px;
  color: #666363;
  padding: 3px;
  border-radius: 7px
}

.login:hover {
  color: #2f2b2b;
}

</style>
