<template>
  <div>

  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";

export default {
  name: "Corner",
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
