<template>
  <div
      style="color: #b60598;display: flex; justify-content: space-between;align-items: center; margin: 0 0 15px 0">
    <span style="font-size: 20px;">{{ userInfo.username }}</span>
    <span style="font-size: 14px">
              <span v-for="(item, index) in nva" @click="get_fans(userInfo.id,index)" class="cursor-pointer nva" style="margin-right: 20px">{{
                  userInfo.fans[index]
                }} {{item.name}}</span>
            </span>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted} from "vue";
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";
import {get_fans} from "../../utils/tools.js";

export default {
  name: "InfoNva",
  props: ['userInfo'],
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const self = reactive({
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