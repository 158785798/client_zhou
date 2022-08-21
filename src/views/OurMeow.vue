<template>
  <div style="padding-bottom: 50px">
  <div style="text-align: center; font-size: 60px;color: purple">
      <strong>Make our meow better, be together</strong>
  </div>
  <el-carousel v-if="images.length!==0" type="card" height="800px" :autoplay="false" indicator-position="none" arrow="always">
    <el-carousel-item v-for="(src, index) in images.slice(16,23)" :key="index">
      <img :src="src.middle" alt="" style="width: 630px;">
    </el-carousel-item>
  </el-carousel>
  <ul style="margin: 20px 0; padding: 0">
    <li v-for="(src, index) in images" class="imgItem" @click="show_image_preview({images: images, index: index})">
      <div class="wrapper">
        <img :src="src.middle" alt="" style="width: 162px; background-clip: padding-box">
      </div>

    </li>
  </ul>
  </div>


</template>

<script>
import CatCarousel from "../components/CatCarousel.vue";
import {onBeforeMount, reactive, toRefs} from "vue";
import {instance} from "../api/request.js";
import {useMutations} from "../utils/hooks.js";

export default {
  name: "OurMeow",
  components: {
    CatCarousel
  },
  setup() {
    const {show_image_preview} = useMutations('session', ['show_image_preview'])
    const self = reactive({
      images: []
    })
    onBeforeMount(async () => {
      const res = await instance.get('/get_images')
      self.images = res.images
    })
    return {
      ...toRefs(self),
      show_image_preview
    }
  }
}
</script>

<style lang="scss" scoped>

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.imgItem {
  float: left;
  width: 162px;
  height: 192px;
  overflow: hidden;
  margin: 8px 8px 0;
  border-radius: 12px;

}

.wrapper {
  transition-duration: .5s;
}

.wrapper:hover {
  transform: scale(1.5);
}
</style>
