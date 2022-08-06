<template>
  <div style="width: 100%;  display: flex; justify-content: center;">
    <div
        class="carousel-container"
        @mouseenter="showArrow"
        @mouseleave="hideArrow"
    >
      <span
          :class="[
          'iconfont',
          'iconfontarrow-left',
          'arrow',
          { showLeftArrow: isShowArrow },
        ]"
          @click="previous"
      ></span>
      <span
          :class="[
          'iconfont',
          'iconfontarrow-right',
          'arrow',
          { showRightArrow: isShowArrow },
        ]"
          @click="next"
      ></span>
      <ul
          @mouseenter="activeUL"
          @mouseleave="disactiveUL"
          style="display: flex; position: absolute; bottom: 0; width: 100%;
          justify-content: center; padding: 0 0 10px; margin-bottom: 0;"
      >
        <li @mouseenter="toCurImg(item)" v-for="item in count" :key="item">
          <button :class="['pointer',{ isactiveUL: isactiveUL, isactive: isactive(item) }]"></button>
        </li>
      </ul>
      <div ref="sss" class="img-area" style="margin-left: -100%;">
        <a href="javascript:" target="_blank" v-for="(item, index) in imgList" :key="index">
          <img :src="item" alt="" width="464">
        </a>
      </div>
    </div>
  </div>
</template>

<script>


import {onBeforeMount, onMounted, onUnmounted, reactive, toRefs, ref, computed} from "vue";
import {useStore} from "vuex";
import instance from "../api/request.js";

export default {
  name: "CatCarousel",
  setup() {
    const store = useStore()
    const get_images = async () => {
      const res = await instance.get('/get_images')
      self.imgList = res.images
      self.count = res.count
      self.imgList.unshift(self.imgList[self.imgList.length - 1])
      self.imgList.push(self.imgList[1])
    }
    const self = reactive({
      index: 0,
      timer: '',
      imgWidth: 464,
      autoPlay: true,
      isShowArrow: false,
      isactiveUL: false,
      flag: true,
      imgList: '',
      count: '',
      sss: null,
      previous: () => {
        if (!self.flag) return
        self.flag = false
        self.index--
        if (self.index < 1) {
          self.index = self.imgList.length - 2
          self.sss.style.marginLeft = -self.imgWidth * (self.imgList.length - 1) + "px"
          self.sss.style.transitionDuration = "0s"
          setTimeout(self.bb, 5)
          setTimeout(self.cc, 5)
        } else {
          self.sss.style.marginLeft = -self.imgWidth * self.index + "px"
          self.sss.style.transitionDuration = "0.5s"
          setTimeout(self.cc, 10)
        }
      },
      aa: () => {
        self.sss.style.marginLeft = -self.imgWidth * self.index + "px"
        self.sss.style.transitionDuration = "0.5s"
      },
      bb: () => {
        self.sss.style.marginLeft = -self.imgWidth * self.index + "px"
        self.sss.style.transitionDuration = "0.5s"
      },
      cc: () => {
        self.flag = true
      },
      next: () => {
        if (!self.flag) return
        self.flag = false
        self.index++
        if (self.index > self.imgList.length - 2) {
          self.index = 1
          self.sss.style.marginLeft = "0"
          self.sss.style.transitionDuration = "0s"
          setTimeout(self.aa, 5)
          setTimeout(self.cc, 5)
        } else {
          self.sss.style.marginLeft = -self.imgWidth * self.index + "px"
          self.sss.style.transitionDuration = "0.5s"
          setTimeout(self.cc, 10)
        }
      },
      toCurImg: (item) => {
        if (!self.flag) return
        self.flag = false
        self.index = item
        self.sss.style.marginLeft = -self.imgWidth * item + "px"
        self.sss.style.transitionDuration = "0.5s"
        setTimeout(self.cc, 10)
      },
      isactive: (item) => {
        if (self.index > self.imgList.length - 2) {
          return item === self.index - self.imgList.length + 2
        }
        return item === self.index
      },
      activeUL: () => {
        self.isactiveUL = true
      },
      disactiveUL: () => {
        self.isactiveUL = false
      },
      showArrow: () => {
        self.isShowArrow = true;
        clearInterval(self.timer)
      },
      hideArrow: () => {
        self.isShowArrow = false;
        setTimeout(self.trans, 3000)
      },
      auto1: () => {
        self.index = 1
        self.sss.style.marginLeft = -self.imgWidth * self.index + "px"
        self.sss.style.transitionDuration = "0s"
        setTimeout(self.aa, 10)
      },
      auto2: () => {
        self.index++
        self.sss.style.marginLeft = -self.imgWidth * self.index + "px"
        self.sss.style.transitionDuration = "0.5s"
      },
      trans: () => {
        if (self.index > self.imgList.length - 2) {
          self.auto1()
          clearInterval(self.timer)
          self.timer = setInterval(self.trans, 0)
        } else {
          self.auto2()
          clearInterval(self.timer)
          self.timer = setInterval(self.trans, 3000)
        }
      },

    })


    onBeforeMount(() => {

      get_images()

    })


    onMounted(() => {
      if (self.autoPlay) {
        self.trans()
      }
    })
    onUnmounted(() => {
          clearInterval(self.timer)
        }
    )


    return {
      ...toRefs(self),
      get_images
    }

  }
}
</script>
<style scoped>
.carousel-container {
  overflow: hidden !important;
  position: relative;
  border-radius: 20px;
  box-shadow: 0 0 20px 1px #cedcd9;
}

.img-area {
  display: flex;
}

.pointer {
  margin: auto 4px;
  width: 16px;
  background-color: #aabeca;
  height: 5px;
  border: none;
  border-radius: 10px;
  transition-duration: 0.2s;
  outline: none;
}

.isactiveUL {
  height: 9px;
  transition-duration: 0.2s;
}

.isactive {
  transform: scaleX(1.5);
  background-color: #5289c0;
}

li {
  list-style: none;
}

.arrow {
  position: absolute;
  color: #fff;
  border: 2px solid rgba(170, 190, 202, 0.6);
  background-color: rgba(128, 170, 196);
  top: 48%;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  font-size: 20px;
  /*width: 40px;*/
  transition-duration: 0.2s;
}

.arrow:hover {
  transition-duration: 0.2s;
  background-color: rgba(128, 170, 196, 0.6);
}

.iconfontarrow-left {
  left: -35px;
}

.iconfontarrow-right {
  right: -35px;
}

.showLeftArrow {
  left: 5px;
}

.showRightArrow {
  right: 5px;
}
</style>
