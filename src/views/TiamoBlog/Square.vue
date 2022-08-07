<template>
  <main v-loading="loading" style="margin: 15px 10px 0 10px; padding: 0;flex: 1">
  <div style="width: 100%">
    <transition-group appear tag="div" name="u-cell">
      <div v-for="blog in blogs" :key="blog.id">
        <SquareCell @back_blog_id="back_blog_id" :cur_blog_id="cur_blog_id" :blog="blog"></SquareCell>
      </div>
    </transition-group>
  </div>
  <div style="text-align: center; color: rgba(0,0,0,0.53)">
    <!--        <span v-loading="true"  element-loading-background="transparent" v-if="endLoading"></span>-->
    <img src="../../assets/loading2.gif" alt="" style="border-radius: 20px" width="150" v-show="endLoading">
    <span v-show="!endLoading&&!loading">我是有底线的o(*￣▽￣*)o</span>
  </div>
  </main>
</template>

<script>

import SquareCell from "../../components/SquareCell.vue";
import {computed, onMounted, onUnmounted, reactive, toRefs, watch} from "vue";
import instance from "../../api/request.js";
import {ElMessage} from "element-plus";
import {Sortable} from 'sortablejs'
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  name: "Square",
  props: ['blog'],
  components: {
    SquareCell
  },

  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const self = reactive({
      blogs: [],
      largeImgPath: '',
      blog_id: null,
      pageNum: 1,
      pageSize: 7,
      serverPageSize: 7,
      loading: true,
      endLoading: false,
      cur_blog_id: -1,
      back_blog_id: (blog_id) => {
        if (self.cur_blog_id === blog_id) {
          self.cur_blog_id = -1
        } else {
          self.cur_blog_id = blog_id
        }

      },
      noMore: computed(() => {
        return self.pageSize > self.serverPageSize || self.endLoading
      }),

      to_tab: (u_id) => {
        router.push({name: 'UserPage', query: {u_id: u_id}})
      },
      get_blogs: async () => {
        const res2 = await instance.get('/get_blogs', {
          params: {
            flag: 'all', pageNum: self.pageNum,
            pageSize: self.pageSize
          }
        })
        self.serverPageSize = res2.data.length
        self.blogs = self.blogs.concat(res2.data)
        self.endLoading = false
      },
      scroll() {
        window.onscroll = () => {
          // 整个页面的高度
          const scrollHeight = document.body.scrollHeight
          // 当前可视区的顶部到页面顶部的高度，||是做兼容处理的
          const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
          // 当前可视区的高度
          const clientHeight = document.documentElement.clientHeight
          // 可视区底部到页面底部的高度，即滚动条与底部的距离
          const instance = scrollHeight - scrollTop - clientHeight
          // 当滚动条与底部的距离小于100时就触发加载数据
          if (instance < 100) {
            if (self.noMore) return
            self.endLoading = true
            setTimeout(() => {
              self.pageNum++
              self.get_blogs()
            }, 1000)

          }
        }
      }
    })
    watch(() => props.blog, (newBlog, oldBlog) => {
      self.blogs.unshift(newBlog)
    })
    onMounted(async () => {
      window.addEventListener('scroll', self.scroll, false)
      const res1 = await instance.get('/get_taste')
      self.taste = res1.data
      await self.get_blogs()
      self.loading = false
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
