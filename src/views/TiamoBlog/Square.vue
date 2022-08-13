<template>
  <main>
    <div style="width: 100%">
      <transition-group appear tag="div" name="bound-in">
        <div v-for="blog in blogs" :key="blog.id">
          <SquareCell :blog="blog"></SquareCell>
        </div>
      </transition-group>
    </div>
    <div style="text-align: center; color: rgba(0,0,0,0.53)">
      <img src="../../assets/loading2.gif" alt="" style="border-radius: 20px" width="150" v-show="endLoading">
      <span v-show="!endLoading&&!loading">我是有底线的o(*￣▽￣*)o</span>
    </div>
  </main>
</template>

<script>

import SquareCell from "../../components/SquareCell.vue";
import {computed, onMounted, onUnmounted, reactive, toRefs, watch} from "vue";
import instance from "../../api/request.js";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {useMutations} from "../../utils/hooks.js";
import {scroll} from "../../utils/tools.js";


export default {
  name: "Square",
  props: ['loading'],
  emits: ['finish'],
  components: {
    SquareCell
  },
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const mutations = useMutations('session', ['concat_blogs', 'clear_blogs'])
    const self = reactive({
      blogs: computed(() => store.state.session.blogs),
      largeImgPath: '',
      blog_id: null,
      pageNum: 1,
      pageSize: 7,
      serverPageSize: 7,
      endLoading: false,
      noMore: computed(() => {
        return self.pageSize > self.serverPageSize || self.endLoading
      }),

      get_blogs: async () => {
        const res2 = await instance.get('/get_blogs', {
          params: {
            flag: 'all', pageNum: self.pageNum,
            pageSize: self.pageSize
          }
        })
        self.serverPageSize = res2.data.length
        mutations.concat_blogs(res2.data)
        self.endLoading = false
      },
      scroll: scroll,
    })
    onMounted(async () => {
      mutations.clear_blogs()
      window.addEventListener('scroll', self.scroll(self), false)
      const res1 = await instance.get('/get_taste')
      self.taste = res1.data
      await self.get_blogs()
      context.emit('finish')
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', self.scroll, false)
    })
    return {
      ...toRefs(self)
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
