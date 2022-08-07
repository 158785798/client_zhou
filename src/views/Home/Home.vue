<template>
  <div class="h-hrader">
    <Header :msgCount="msgCount"></Header>
  </div>
  <transition name="pub">
    <Pub v-show="pub" @success_callback="success_callback" @unshift_blog="unshift_blog" @close_pub="pub=false"></Pub>
  </transition>
  <transition name="fade">
    <div v-show="show">
      <div>
        <div class="iconfont iconfonticon_succeed" style="font-size: 40px;margin: 10px; font-weight: lighter"></div>
        <div>{{ message }}</div>
      </div>
    </div>
  </transition>

  <el-container style="margin: 50px auto">
    <span @click="pub=!pub" style="position: fixed;z-index:120;transform: translate(200px, -35px)">
      <i class="iconfont iconfontjiahao " style="font-size: 30px;color: red;"></i>
  </span>
    <div style="width: 100%; position: relative" :class="{'pub': pub}" @click="pub=false">
      <router-view :blog="blog" @success_callback="success_callback"/>
    </div>
  </el-container>

</template>

<script>
import Header from "../../components/Header.vue";
import {reactive, toRefs} from "vue";
import Pub from "../../components/Pub.vue";

export default {
  name: "Home",
  components: {
    Header,
    Pub
  },
  setup() {
    const self = reactive({

      delDialog: false,
      blog: {},
      msgCount: 0,
      show: false,
      message: '',
      pub: false,
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
