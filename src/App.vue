<template>
    <router-view/>
</template>

<script>
import {reactive, toRefs} from "vue";

export default {
  name: 'App',
  setup (){
    const self = reactive({
      ss: (e)=>{
        console.log(e.clientY)
      }
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

