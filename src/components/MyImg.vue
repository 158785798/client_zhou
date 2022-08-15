<template>
  <div v-if="flag==='imgPreview'">
    <img ref="img" v-if="each.direction==='h'" :src="each.middle" @error.once="set_default" alt=""
         style="max-height: 92vh">
    <img ref="img" v-else :src="each.middle" alt="" @error.once="set_default" style="max-width: 100vw">
  </div>
  <div v-else>
    <img ref="img" v-if="each.direction==='h'" :src="each.small? each.small: each.middle" alt="" :width="width"
         @error.once="set_default" style="cursor: zoom-in">
    <img ref="img" v-else :src="each.small? each.small: each.middle" @error.once="set_default" alt="" :height="width"
         style="cursor: zoom-in">
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {set_default} from "../utils/tools.js";

export default {
  name: "MyImg",
  props: {
    each: {
      type: Object
    },
    width: {
      default() {
        return 96
      }
    },
    flag: {
      default() {
        return 'default'
      }
    }
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const self = reactive({
      img: null,

    })
    return {
      ...toRefs(self),
      set_default
    }

  }
}
</script>

<style scoped>

</style>
