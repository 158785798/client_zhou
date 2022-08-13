<template>
  <div>
    <SelfIndex v-if="is_self"></SelfIndex>
    <OtherIndex v-else></OtherIndex>
  </div>
</template>

<script>
import {computed, reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import SelfIndex from "./SelfIndex.vue";
import OtherIndex from "./OtherIndex.vue";

export default {
  name: "UIndex",
  components: {
    SelfIndex,
    OtherIndex,
  },
  setup: function () {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const self = reactive({
      is_self: computed(() => store.state.local.userInfo.id == route.query.u_id)
    })
    return {
      ...toRefs(self)
    }

  }
}
</script>

<style scoped>

</style>
