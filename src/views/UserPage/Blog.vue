<template>
  <div>
    <transition-group appear tag="div" name="bound-in">
      <div v-for="blog in blogs" :key="blog.id">
        <Cell :blog="blog">
          <div style="">
            <span style="color: rgba(0,0,0,0.47);font-size: 12px; margin-right: 5px">{{ blog.permission_text }}</span>
            <i class="iconfont iconfontxialajiantouxiao cursor-pointer ico ico-bg" style="padding:5px; border-radius: 50%"
               @click="set_blog_id(blog.id)" :class="{'up-dropdown-menu': blog.id===cur_blog_id}"></i>
            <div v-show="blog.id===cur_blog_id" style="width:150px;overflow: hidden;
        background-color: #fff;z-index: 10;position: absolute;margin-top: 2px;right:20px;border-radius: 6px; box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.25);">
              <div style="font-size: .875rem" class="navItem_left cursor-pointer" v-for="menu in blog.dropdown_menus"
                   @click="to_do(menu, blog.id)">
                <div style="padding:10px 15px">
                  <strong class="iconfont hover" :class="menu.icon"
                          style="margin-right: 10px;font-size: 14px;background-color: rgba(0,0,0,0.1); padding: 8px; border-radius: 50%"></strong>
                  <span>{{ menu.name }}</span>
                </div>
              </div>
            </div>

          </div>
        </Cell>
      </div>
    </transition-group>
    <div style="text-align: center; color: rgba(0,0,0,0.53)">
      <img src="../../assets/loading2.gif" alt="" style="border-radius: 20px" width="150" v-show="endLoading">
      <span v-show="!endLoading&&!loading">我是有底线的o(*￣▽￣*)o</span>
    </div>
  </div>
</template>

<script>
import {instance} from "../../api/request.js";
import {reactive, toRefs, computed, onMounted, onUnmounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {useMutations} from "../../utils/hooks.js";
import {scroll, to_do} from "../../utils/tools.js";
import Cell from "../../components/Cell.vue";

export default {
  name: "Blog",
  components: {
    Cell,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const mutations = useMutations('session', ['concat_blogs', 'clear_blogs', 'set_blog_id',])
    const self = reactive({
      cur_blog_id: computed(() => store.state.session.cur_blog_id),
      pageNum: 1,
      loading: true,
      endLoading: true,
      pageSize: 7,
      serverPageSize: 7,
      blogs: computed(() => store.state.session.blogs),
      noMore: computed(() => {
        return self.pageSize > self.serverPageSize || self.endLoading
      }),
      to_do: to_do,
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
    })
    onMounted(async () => {
      window.addEventListener('scroll', scroll(self), false)
      mutations.clear_blogs()
      await self.get_blogs(route.query.index)
      self.loading = false
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', scroll, false)
        mutations.set_blog_id(null)
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
