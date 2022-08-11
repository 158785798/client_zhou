<template>
  <div>
    <div v-for="(urls, month) in pictures" style="border-bottom: 1px solid rgba(237,111,149,0.38)">
      <h3>{{month}}</h3>
        <transition-group appear tag="div" name="bound-out">
          <div :key="index" v-for="(each, index) in urls" @click="show_image_preview({images: urls, index: index})"
               style="display: inline-block;margin:5px;overflow: hidden; width: 160px; height: 160px; border-radius: 7px">
            <img v-if="each.direction==='h'" :src="each.middle" alt="" width="160" style="cursor: zoom-in">
            <img v-else :src="each.middle" alt="" height="160" style="cursor: zoom-in">
        </div>
        </transition-group>

    </div>

  </div>

</template>

<script>
import {useRouter, useRoute} from "vue-router";
import {useStore} from "vuex";
import {reactive, toRefs, onMounted} from "vue";
import instance from "../../api/request.js";
import {useMutations} from "../../utils/hooks.js";

export default {
  name: "Album",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const mutations = useMutations('session', ['show_image_preview'])
    const self = reactive({
      pictures: {}
    })
    onMounted(async () => {
      const u_id = Number(route.query.u_id)
      const res = await instance.get('/get_album', {params: {u_id: u_id}})
      self.pictures = res.data
    })
    return {
      ...toRefs(self),
      ...mutations
    }
  }
}
</script>

<style scoped>

</style>
