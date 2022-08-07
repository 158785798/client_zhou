<template>
  <div class="h-hrader" @click="">
    <Header class="header" :msgCount="msgCount" @show_msg_box="show_msg_box"></Header>
  </div>
  <!--  <transition name="pub">-->
  <!--    <Pub v-show="pub" @success_callback="success_callback" @unshift_blog="unshift_blog" @close_pub="pub=false"></Pub>-->
  <!--  </transition>-->
  <transition name="fade">
    <div v-show="show">
      <div>
        <div class="iconfont iconfonticon_succeed" style="font-size: 40px;margin: 10px; font-weight: lighter"></div>
        <div>{{ message }}</div>
      </div>
    </div>
  </transition>
  <transition name="u-cell">
    <div v-show="msgBoxShow" style="background-color: white;z-index:1000;top:100px;width: 400px;height: 500px;
  position: absolute;overflow: auto; left: 0; right: 0; margin: auto; padding: 20px; border-radius: 10px">
      <div v-if="msgBox.length!==0" v-for="each in msgBox"
           style="display: flex;margin-bottom: 1.2rem;cursor: pointer; align-items: center">
        <img :src="each.userInfo.avatarUrl" alt="" @click=""
             style="border-radius: 50%;width: 40px; height: 40px; margin-right: 10px">
        <div style="flex: 1; font-size: 13px;color:rgba(0,0,0,0.5);">
          <span>
          {{ each.userInfo.username }}
          <i style="color: red; margin: 0 0 0 5px" class="iconfont iconfontaixin"></i>赞了我的帖子
            </span>
          <span v-show="each.img" style="overflow: hidden; width: 56px; height: 56px; border-radius: 7px">
            <img v-if="each.direction==='h'" :src="each.middle" alt="" width="56">
            <img v-else :src="each.middle" alt="" height="56">
          </span>
        </div>

      </div>
      <div v-else style="text-align: center; margin-top: 100px">
        空空如也ε=ε=ε=(~￣▽￣)~
      </div>

    </div>
  </transition>

  <el-container style="margin: 50px auto" :class="{'msg-box': msgBoxShow}" @click="msgBoxShow=false">
    <span @click="pub=!pub" style="position: fixed;z-index:120;transform: translate(200px, -35px)">
      <i class="iconfont iconfontjiahao " style="font-size: 30px;color: red;"></i>
  </span>
    <div style="width: 100%; position: relative" :class="{'pub': pub}" @click="pub=false">
      <!--      <router-view :blog="blog" @success_callback="success_callback"/>-->
    </div>
  </el-container>

</template>

<script>
import Header from "../../components/Header.vue";
import {computed, onMounted, reactive, toRefs} from "vue";
// import Pub from "../../components/Pub.vue";
import {useStore} from "vuex";
import instance from "../../api/request.js";

export default {
  name: "Home",
  components: {
    Header,
    // Pub
  },
  setup() {
    const store = useStore()
    const self = reactive({

      delDialog: false,
      blog: {},
      msgCount: 0,
      show: false,
      msgBoxShow: false,
      msgBox: [],
      message: '',
      pub: false,
      lockReconnect: false,
      clientId: computed(() => {
        return store.state.userInfo.id
      }),
      initWS: (clientId) => {
        const url = process.env.NODE_ENV === 'development' ? `ws://127.0.0.1:8090/ws/${clientId}`
            : `ws://8.141.150.118:8096/ws/${clientId}`
        self.ws = new WebSocket(url)
        self.ws.onmessage = (event) => {
          console.log('ssssssssssss', event);
          self.msgCount++
        }
        self.ws.onclose = () => {
          if (self.lockReconnect) {
            return
          }
          self.lockReconnect = true
          //没连接上会一直重连，设置延迟避免请求过多
          setTimeout(() => {
            self.initWS(clientId)
            self.lockReconnect = false
          }, 2000)
        }
      },
      show_msg_box: async () => {
        self.msgBoxShow = !self.msgBoxShow
        if (self.msgBoxShow) {
          const res = await instance.get('/get_box_msg')
          self.msgBox = res.data
        }
      },
      success_callback: (message) => {
        self.message = message
        self.show = true
        setTimeout(() => {
          self.show = false
        }, 1000)
      },
      unshift_blog: (value) => {
        self.blog = value
      },
      show_delDialog: () => {
        self.delDialog = true
      }
    })
    onMounted(() => {
      self.initWS(self.clientId)
    })
    return {
      ...toRefs(self)
    }
  }
}
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.iconfonticon_succeed {
  cursor: default;
}

.iconfonticon_succeed:hover {
  color: #fff;
}

.pub-enter-active, .pub-leave-active {
  transition: all .3s linear;
}

.pub-enter-from, .pub-leave-to {
  transform: translateY(200px) rotateX(90deg);
}

.h-hrader {
  border-radius: 10px;
  background: linear-gradient(rgba(243, 157, 47, 0.9), rgba(220, 161, 220, 0.94));
  box-shadow: 0 0 20px 3px rgba(171, 172, 176, 0.91);
  position: fixed;
  width: 1250px;
  top: 0;
  z-index: 100
}

.msg-box:after {
  content: '';
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 150;
  position: fixed;
}

.pub::after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  position: fixed;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.23);
}

.show {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.76);
  width: 200px;
  height: 130px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 3000;
  margin: auto
}

@media screen and (max-width: 800px) {
  .h-hrader {
    width: 100%;
  }
}
</style>
