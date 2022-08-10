<template>
  <div>
    <transition-group appear tag="div" name="u-cell">
      <div v-for="blog in blogs" :key="blog.id">
        <UserCell
            :cur_blog_id="cur_blog_id"
            :blog="blog"
            @show_delDialog="show_delDialog"
            @success_callback="success_callback"
            @back_blog_id="back_blog_id"
        ></UserCell>
      </div>
    </transition-group>
  </div>
</template>

<script>
import UserCell from "../../components/UserCell.vue";

export default {
  name: "Blog",
  components:{
    UserCell,
  }
}
</script>

<style scoped>

</style>