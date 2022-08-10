<template>
  <main>
    <div style="width: 100%">
      <transition-group appear tag="div" name="u-cell">
        <div v-for="blog in blogs" :key="blog.id">
          <UserCell @back_blog_id="back_blog_id" :cur_blog_id="cur_blog_id" :blog="blog"></UserCell>
        </div>
      </transition-group>
    </div>
  </main>
</template>

<script>
import UserCell from "../../components/UserCell.vue";
import {onBeforeMount, onMounted, reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import instance from "../../api/request.js";

export default {
  name: "CommentPage",
  components: {
    UserCell,
  },
  emits: [
    'success_callback', 'finish'
  ],
  setup() {
    const router = useRouter()
    const route = useRoute()
    const self = reactive({
      cur_blog_id: -1,
      blogs: [],
      show_delDialog: (blog_id) => {
        self.blog_id = blog_id
        self.delDialog = true
      },
      success_callback: (message) => {
        context.emit('success_callback', message)
      },
      back_blog_id: (blog_id) => {
        if (self.cur_blog_id === blog_id) {
          self.cur_blog_id = -1
        } else {
          self.cur_blog_id = blog_id
        }
      },
    })

    onBeforeMount(async () => {
      const res = await instance.get('/get_blog', {params: {blog_id: route.query.blog_id}})
      self.blogs.push(res.data)
      context.emit('finish')
    })
    return {
      ...toRefs(self)
    }
  },

}
</script>

<style scoped>

</style>
