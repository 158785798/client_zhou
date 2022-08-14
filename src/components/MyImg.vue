<template>
  <div v-if="flag==='imgPreview'">
    <img v-if="each.direction==='h'" :src="each.middle" alt="" style="max-height: 92vh">
    <img v-else :src="each.middle" alt="" style="max-width: 100vw">
  </div>
  <div v-else>
    <img v-if="each.direction==='h'" :src="each.small? each.small: each.middle" alt="" :width="width"
         style="cursor: zoom-in">
    <img v-else :src="each.small? each.small: each.middle" alt="" :height="width" style="cursor: zoom-in">
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

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
    const self = reactive({})
    return {
      ...toRefs(self)
    }

  }
}
</script>

<style scoped>

</style>
