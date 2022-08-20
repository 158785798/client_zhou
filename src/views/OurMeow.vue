<template>
  <!--  <div style="display: flex; justify-content: center">-->
  <!--    <div style="width: 464px">-->
  <!--      <CatCarousel></CatCarousel>-->
  <!--    </div>-->
  <!--  </div>-->
  <ul style="margin: 0; padding: 0">
    <li v-for="(src, index) in images" class="imgItem" @click="show_image_preview({images: images, index: index})">
      <div class="wrapper">
        <img :src="src.middle" alt="" style="width: 162px; background-clip: padding-box">
      </div>

    </li>
  </ul>
  <div style="text-align: center; padding-top: 100px; font-size: 60px;color: purple">
    <p>
    <strong>Build our meow better, together</strong>
    </p>
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
