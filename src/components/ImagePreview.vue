<template>
  <div style="display: flex;flex-direction:column;position: fixed;top:20px; bottom: 0; left: 0; right: 0;z-index: 300">
    <span :class="{'g-mask': maskShow}" @click="close_mask"></span>
    <div style="position: relative; flex: 1;justify-content:center;align-items: center;display: flex;overflow: hidden;">
      <div style="z-index: 300">
        <MyImg :each="i_each" flag="imgPreview"></MyImg>
      </div>
    </div>

    <div style="display: flex; justify-content: center; background-color: rgba(0,0,0,0.8);z-index: 300">
      <div v-for="(each, index) in images" @click="to_cur(index)"
           style="margin: 15px 3px; width: 55px; height: 55px; overflow: hidden;position: relative"
           :class="{'is-active': i_index===index}">
        <div :class="{'bottom-blog': i_index!==index}">
          <MyImg :each="each" width="55"></MyImg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted, computed} from "vue";
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";
import {useMutations} from "../utils/hooks.js";
import MyImg from "./MyImg.vue";

export default {
  name: "ImagePreview",
  components: {
    MyImg
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const mutations = useMutations('session', ['to_cur', 'close_mask'])
    const self = reactive({
      images: computed(() => store.state.session.imagePreview.images),
      i_each: computed(() => store.state.session.imagePreview.item),
      i_index: computed(() => store.state.session.imagePreview.index),
      maskShow: computed(() => store.state.session.imagePreview.show),
    })
    onMounted(() => {

    })
    return {
      ...toRefs(self),
      ...mutations
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../global";

.is-active {
  border: 3px solid $icon-hover-color;
}


</style>
