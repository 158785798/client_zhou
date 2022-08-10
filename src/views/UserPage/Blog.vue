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
import instance from "../../api/request.js";
import {reactive, toRefs, computed, onMounted, onUnmounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {scroll} from "../../utils/tools.js";

export default {
  name: "Blog",
  components: {
    UserCell,
  },
  emits: [
    'success_callback'
  ],
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const self = reactive({
      cur_blog_id: -1,
      blog_id: null,
      pageNum: 1,
      pageSize: 7,
      serverPageSize: 7,

      blogs: [],

      dd: computed(() => self.delDialog),

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
      show_delDialog: (blog_id) => {
        self.blog_id = blog_id
        self.delDialog = true
      },
      noMore: computed(() => {
        return self.pageSize > self.serverPageSize || self.endLoading
      }),
      get_blogs: async (index) => {
        const res2 = await instance.get('/get_blogs', {
          params: {
            flag: 'user',
            u_id: route.query.u_id,
            index: index,
            pageNum: self.pageNum,
            pageSize: self.pageSize
          }
        })
        self.serverPageSize = res2.data.length
        self.blogs = self.blogs.concat(res2.data)
        self.endLoading = false
      },
      scroll: scroll
    })
    onMounted(async () => {
      await self.get_blogs(Number(route.query.index))
      self.loading = false
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', self.scroll, false)
    })
    window.addEventListener('scroll', self.scroll, false)
    return {
      ...toRefs(self)
    }

  }
}
</script>

<style scoped>

</style>
