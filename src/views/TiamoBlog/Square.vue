<template>
  <main>
    <div style="width: 100%">
      <transition-group appear tag="div" name="bound-in">
        <div v-for="blog in blogs" :key="blog.id">
          <Cell :blog="blog">
            <div>
              <i class="iconfont iconfontxialajiantouxiao cursor-pointer ico ico-bg"
                 style="padding:6px; border-radius: 50%"
                 @click="set_blog_id(blog.id)" :class="{'up-dropdown-menu': blog.id===cur_blog_id}"></i>
              <div v-show="blog.id===cur_blog_id" style="width:150px;overflow: hidden;
        background-color: #fff;z-index: 10;position: absolute;margin-top: 2px;right:20px;border-radius: 6px; box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.25);">
                <div style="font-size: .875rem" class="navItem_left cursor-pointer" v-for="m in blog.dropdown_menus"
                     @click="to_do(m, blog.id)">
                  <div style="padding:10px 15px">
                    <strong class="iconfont hover" :class="m.icon"
                            style="margin-right: 10px;font-size: 14px;background-color: rgba(0,0,0,0.1); padding: 8px; border-radius: 50%"></strong>
                    <span>{{ m.name }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Cell>
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

import {computed, onMounted, onUnmounted, reactive, toRefs, watch} from "vue";
import {instance} from "../../api/request.js";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {useMutations} from "../../utils/hooks.js";
import {scroll} from "../../utils/tools.js";
import Cell from "../../components/Cell.vue";
import {to_do} from "../../utils/tools.js";


export default {
  name: "Square",
  props: ['loading'],
  emits: ['finish'],
  components: {
    Cell
  },
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const mutations = useMutations('session', ['concat_blogs', 'clear_blogs', 'set_blog_id'])
    const self = reactive({
      cur_blog_id: computed(() => store.state.session.cur_blog_id),
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
      to_do: to_do,
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
    })
    onMounted(async () => {
      mutations.clear_blogs()
      window.addEventListener('scroll', scroll(self), false)
      const res = await instance.get('/get_taste')
      self.taste = res.data
      await self.get_blogs()
      context.emit('finish')
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', scroll, false)
    })
    return {
      ...toRefs(self),
      ...mutations
    }
  }

}
</script>

<style lang="scss" scoped>
.up-dropdown-menu:after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  position: absolute;
  cursor: pointer;
}

</style>
