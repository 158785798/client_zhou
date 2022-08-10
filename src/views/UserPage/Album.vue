<template>
  <div>
    <div v-for="(urls, month) in pictures">
      <h3>{{month}}月</h3>
      <div style="display: flex;">
        <div v-for="each in urls" style="width: 100px; height: 100px; overflow: hidden">
        <img :src="each.avatarName" alt="" style="width: 96px">
        </div>
      </div>
    </div>

  </div>

</template>

<script>
import {useRouter, useRoute} from "vue-router";
import {useStore} from "vuex";
import {reactive, toRefs, onMounted} from "vue";
import instance from "../../api/request.js";

export default {
  name: "Album",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const self = reactive({
      pictures: {}
    })
    onMounted(async () => {
      const u_id = Number(route.query.u_id)
      const res = await instance.get('/get_album', {params: {u_id: u_id}})
      console.log(res.data);
      self.pictures = res.data
    })
    return {
      ...toRefs(self)
    }
  }
}
</script>

<style scoped>

</style>
