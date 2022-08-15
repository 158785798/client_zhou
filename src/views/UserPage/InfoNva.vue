<template>
  <div
      style="color: #b60598;display: flex; justify-content: space-between;align-items: center; margin: 0 0 15px 0">
    <span style="font-size: 20px;">{{ cur_userInfo.username }}</span>
    <span style="font-size: 14px">
              <span v-for="(item, index) in nva" @click="get_fans(cur_userInfo.id,index, is_self)" class="cursor-pointer nva"
                    style="margin-right: 20px">{{
                  index === 0 ? cur_userInfo.fans : cur_userInfo.be_fans
                }} {{ item.name }}</span>
            </span>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted, computed} from "vue";
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";
import {get_fans} from "../../utils/tools.js";

export default {
  name: "InfoNva",
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const self = reactive({
      cur_userInfo: computed(() => store.state.session.cur_userInfo),
      userInfo: computed(() => store.state.local.userInfo),
      is_self: computed(() => self.cur_userInfo.id === self.userInfo.id),
      nva: [
        {name: '粉丝'},
        {name: '关注'}
      ],
    })
    onMounted(() => {
    })
    return {
      ...toRefs(self),
      get_fans
    }
  }
}
</script>

<style scoped>

</style>
