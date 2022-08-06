<template>
  <div class="h-hrader">
    <Header></Header>
  </div>

  <transition name="pub">
    <Pub v-show="pub" @unshift_blog="unshift_blog" @close_pub="pub=false"></Pub>
  </transition>
  <el-container style="margin: 50px auto">
    <div style="width: 100%; position: relative">
      <div :class="{'pub': pub}" @click="pub=!pub" style="position: fixed;right: 0; left: 0; margin: auto;z-index:120;text-align: center">
    <div class="iconfont iconfontjiahao " style="font-size: 30px;color: red;transform: translate(-200px, -35px)"></div>
  </div>
      <router-view :blog="blog"/>
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
      pub: false,
      unshift_blog:(value)=>{
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

.pub-enter-active, .pub-leave-active {
  transition: all .3s linear;
}
.pub-enter-from, .pub-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(200px) rotateX(90deg);

}
.pub-enter-to ,.pub-leave-from /* .fade-leave-active below version 2.1.8 */ {
  //transform: translateY(0) rotateX(-180deg);
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

@media screen and (max-width: 800px) {
  .h-hrader {
    width: 100%;
  }
}
</style>
