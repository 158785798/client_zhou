<template>
  <div>
    <transition-group appear tag="div" name="bound-in">
      <div v-for="blog in blogs" :key="blog.id">
        <UserCell :blog="blog"></UserCell>
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
import {useMutations} from "../../utils/hooks.js";

export default {
  name: "Blog",
  components: {
    UserCell,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const mutations = useMutations('session', ['concat_blogs', 'clear_blogs', 'set_blog_id',])
    const self = reactive({
      pageNum: 1,
      pageSize: 7,
      serverPageSize: 7,
      blogs: computed(() => store.state.session.blogs),
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
        mutations.concat_blogs(res2.data)
        self.endLoading = false
      },
      scroll: scroll
    })
    onMounted(async () => {
      mutations.clear_blogs()
      window.addEventListener('scroll', self.scroll(self), false)
      await self.get_blogs(route.query.index)
      self.loading = false
    })
    onUnmounted(() => {
        mutations.set_blog_id(null)
      window.removeEventListener('scroll', self.scroll, false)
    })

    return {
      ...toRefs(self)
    }

  }
}
</script>

<style scoped>

</style>
