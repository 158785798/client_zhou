<template>
  <div>
  <img class="bg" src="https://github.githubassets.com/images/modules/site/home/hero-glow.svg" alt=""
       style="border-style: none;width: 100%; position: fixed;top: 0; left: 0; z-index: -2">
  <img src="../../assets/home_bg.png" alt="" style="width: 1250px;position: fixed; z-index: -1">
  <el-container>
    <el-main>
      <div style="display: flex; justify-content: space-between; margin: 100px 0;">
        <div style="width: 50%; margin: 0;text-align: left">
          <h1 style="font-size: 72px; margin: 0;">How much do you like cats</h1>
          <p style="font-size: 24px; color:#b9a240">
            Maybe it can be said that keeping a dog is to make you no longer lonely,
            while keeping a cat is to make your life more exquisite.
          </p>
        </div>
      </div>
    </el-main>
    <el-footer></el-footer>
    <div style="display: flex; justify-content: space-around; " id="sss">
      <div>
        <img class="content" src="../../assets/m1.png" alt=""
             style="border-radius: 10px;transition-duration: 0.6s;width: 200px"
             :class="{ccc: d}">
      </div>
      <div>
        <img class="content" src="../../assets/m2.png" alt=""
             style="border-radius: 10px;transition-duration: 0.6s;width: 200px;"
             :class="{ccc: d}">
      </div>
    </div>
    <div id="ddd"
         style="visibility: hidden;;border-radius: 10px;display: flex; align-items: center;justify-content: center;
         width: 80%; height: 120px; margin: 50px auto;
        transition-duration: 0.6s; font-size: 32px;color: wheat;"
         :class="{aaa:aa, b: aa}">
      <img src="../../assets/Welcome.gif" alt="" style="border-radius: 20px; height: 100px">
    </div>
  </el-container>
    </div>
</template>

<script>

import {onMounted, onUnmounted, reactive, toRefs} from "vue";
import Header from "../../components/Header.vue";

export default {
  name: "HIndex",
  setup() {
    const self = reactive({
      isVisible: false,
      aa: false,
      d: false,
      scroll: () => {
        const offset = document.getElementById('sss').getBoundingClientRect()
        const offsetTop = offset.top;
        // 进入可视区域
        if (offsetTop < 600) {
          self.isVisible = true
          self.aa = true
          self.d = true
        } else {
          self.isVisible = false
          self.aa = false
          self.d = false
        }

      },
    })
    onMounted(() => {
      window.addEventListener('scroll', self.scroll)
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', self.scroll)
    })
    return {
      ...toRefs(self)
    }
  }
}

</script>


<style lang="scss" scoped>

.header {

}

.content {
  box-shadow: 0 0 15px 3px #8d1752;
}


.ccc {
  transform: scale(1.2);
  transition-duration: 0.6s;
}

.aaa {
  visibility: visible !important;
  background-color: rgba(19, 199, 137, 0.75);
  width: 100% !important;
}

.b {
  transition-duration: 0.8s;
}


</style>
