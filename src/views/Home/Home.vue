<template>
  <div class="h-hrader">
    <Header></Header>
  </div>
  <Pub @unshift_blog="unshift_blog"></Pub>
  <el-container style="margin: 50px auto">
    <div style="width: 100%">
      <router-view :blog="blog"/>
    </div>
  </el-container>

</template>

<script>
import Header from "../../components/Header.vue";
import {reactive, toRefs} from "vue";
import Pub from "../../components/Pub.vue";

export default {
  name: "Home",
  components: {
    Header,
    Pub
  },
  setup() {
    const self = reactive({

      delDialog: false,
      blog: {},
      unshift_blog:(value)=>{
        self.blog = value
      },
      show_delDialog: () => {
        self.delDialog = true
      }
    })
    return {
      ...toRefs(self)
    }
  }
}
</script>

<style scoped>

.h-hrader {
  border-radius: 10px;
  background: linear-gradient(rgba(243, 157, 47, 0.9), rgba(220, 161, 220, 0.94));
  box-shadow: 0 0 20px 3px rgba(171, 172, 176, 0.91);
  position: fixed;
  width: 1250px;
  top: 0;
  z-index: 100
}

@media screen and (max-width: 800px) {
  .h-hrader {
    width: 100%;
  }
}
</style>
