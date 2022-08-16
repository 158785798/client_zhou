<template>
  <router-view/>
  <Paw></Paw>
</template>

<script>
import {onMounted, reactive, toRefs} from "vue";
import Paw from "./components/Paw.vue";

export default {
  name: 'App',
  components:{
    Paw
  },
  setup (){
    const self = reactive({

    })
    return {
      ...toRefs(self)
    }
  }

}
</script>
<style lang="scss">
@import "variable";

.bg {
  background-color: $bgcolor;
}
</style>

