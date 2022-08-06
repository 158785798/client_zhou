<template>
  <el-backtop :bottom="100" class="backtop">
    <i class="iconfont iconfonttubiao02" style="font-size: 20px"></i>
  </el-backtop>
  <transition name="fade">
  <div v-show="successFollow" style="
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-radius: 10px;
  background-color: rgba(0,0,0,0.76); width: 200px;
  height: 130px; left:0; right:0;top:0;bottom:0;
  z-index: 3000; margin: auto">
    <div>
    <div class="iconfont iconfonticon_succeed" style="font-size: 40px;margin: 10px; font-weight: lighter"></div>
      <div>关注成功</div>
    </div>
  </div>
  </transition>
  <div class="common-layout" style="display: flex;height: 100%" :class="{'del-blog': delDialog}">
    <div class="u-del-blog" v-show="delDialog">
      <div style="margin-bottom: 20px; ">确定要删帖吗？</div>
      <el-button size="small" @click="u_confirm">确认</el-button>
      <el-button size="small" @click="u_cancel">取消</el-button>
    </div>
    <aside style="height: 100%;background-color: #fff;margin-top: 15px;width:200px;border-radius: 6px;">
      <div style="position: sticky;top:60px;">
        <div style="font-size: 25px; margin: 10px 20px;height: 100%;">首页</div>
        <div style="cursor: pointer;" class="navItem_left" v-for="item in nvamenus">
          <div style=" padding:10px 20px">
            <i :class="item.icon" style="margin-right: 18px"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>
        <div style="height: 100%"></div>
      </div>
    </aside>
    <main v-loading="loading" style="margin: 15px 10px 0 10px; padding: 0;flex: 1">
      <Cell @show_delDialog="show_delDialog" @back_blog_id="back_blog_id" :cur_blog_id="cur_blog_id" :blog="blog" :index="index" v-for="(blog, index) in blogs"></Cell>
      <div style="text-align: center; color: rgba(0,0,0,0.53)">
        <!--        <span v-loading="true"  element-loading-background="transparent" v-if="endLoading"></span>-->
        <img src="../assets/loading2.gif" alt="" style="border-radius: 20px" width="150" v-show="endLoading">
        <span v-show="!endLoading&&!loading">我是有底线的o(*￣▽￣*)o</span>
      </div>
    </main>
    <aside style="height: 100%;margin-top: 15px;width:300px;border-radius: 6px;">
      <div style="position: sticky;top:-50px;">
        <div class="right-card">
          <div style="margin-bottom: 10px; ">
            <span>猫猫热搜</span>
          </div>
          <div style="padding:8px; font-size: 12px; display: flex; justify-content: space-between"
               v-for="(item, index) in heatSearch">
            <div>
              <strong style="display: inline-block;color: red;font-size: 14px;width: 20px">{{ index + 1 }}</strong>
              <span style="margin: 0 3px">{{ item }}</span>
              <span style="color: rgba(0,0,0,0.6)">737.6万</span>
            </div>
            <span>😍</span>
          </div>
        </div>
        <div style="background-color: #fff;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;">
          <div style="padding: 10px 15px 10px 15px;">
            <span>你可能感兴趣的人</span>
          </div>
          <div class="navItem_left" style="padding:20px;display: flex; align-items: center"
               v-for="item in taste">
            <div @click="to_tab(item.id)" style="display: flex; align-items: center;flex: 1;">
              <img :src="item.avatarUrl" alt="" style="width: 50px; height: 50px; border-radius: 50%">
              <div style=" margin: 0 10px">
                <div>{{ item.username }}</div>
                <div style="color: #939393; margin: 3px 0">无敌帅</div>
              </div>
            </div>
            <div>
              <el-button style="border-radius: 20px;border-color: #f18e63; color: #f18e63">+关注</el-button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>

import Cell from "../components/Cell.vue";
import {computed, onMounted, onUnmounted, reactive, toRefs,watch} from "vue";
import instance from "../api/request.js";
import {ElMessage} from "element-plus";
import {Sortable} from 'sortablejs'
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  name: "TiamoBlog",
  props:['blog'],
  components: {
    Cell
  },
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const self = reactive({
      nvamenus: [
        {name: '全部关注', icon: 'iconfont iconfontchahao1'},
        {name: '最新猫猫', icon: 'iconfont iconfontshanchu1'},
        {name: '特别关注', icon: 'iconfont iconfontchahao1'},
        {name: '好友圈', icon: 'iconfont iconfontchahao1'},
      ],
      heatSearch: [
        '世界只有一个中国',
        '世界只有一个中国',
        '世界只有一个中国',
        '世界只有一个中国',
        '世界只有一个中国',
        '世界只有一个中国',
        '世界只有一个中国',
        '世界只有一个中国',
        '世界只有一个中国',
        '世界只有一个中国',
      ],
      taste: [],
      successFollow:false,
      blogs: [],
      largeImgPath: '',
      delDialog: false,
      blog_id: null,
      blog_index: null,
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
        router.push({name: 'UserPage', params: {u_id: u_id}})
      },
      u_confirm: async () => {
        self.blogs.splice(self.blog_index, 1)
        self.delDialog = false
        ElMessage.success('删除成功!')
        const res = await instance.delete('/del_blog', {params: {blog_id: self.blog_id}})
      },
      u_cancel: () => {
        self.delDialog = false
      },
      show_delDialog: (blog_id, blog_index) => {
        self.blog_id = blog_id
        self.blog_index = blog_index
        self.delDialog = true
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
    watch(() => props.blog, (newBlog, oldBlog)=>{
      console.log(newBlog);
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
@import "../global";
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.iconfonticon_succeed{
  cursor: default;
}
.iconfonticon_succeed:hover{
  color: #fff;
}

.navItem_left:hover {
  background-color: #f2f2f2;
}

.right-card {
  background-color: #fff;
  padding: 10px 15px 20px 15px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 10px;
}


</style>
