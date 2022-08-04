<template>
  <el-backtop :bottom="100">
    <div style="height: 100%;width: 100%;box-shadow: red;text-align: center;line-height: 40px;color: #1989fa;">
      TOP
    </div>
  </el-backtop>
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
    <main v-loading="loading" style="margin: 15px 10px 0 10px; padding: 0; z-index:60;flex: 1">
      <Cell @show_delDialog="show_delDialog" :blogs="blogs"></Cell>
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
import {computed, onMounted, reactive, toRefs} from "vue";
import instance from "../api/request.js";
import {ElMessage} from "element-plus";
import {Sortable} from 'sortablejs'
import {useStore} from "vuex";
import {useRouter} from "vue-router";

export default {
  name: "TiamoBlog",
  components: {
    Cell
  },
  setup() {
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
      blogs: computed(() => {
        return store.state.blogs
      }),
      largeImgPath: '',
      delDialog: false,
      blog_id: null,
      blog_index: null,
      loading: false,
      to_tab: (u_id) => {
        router.push({name: 'UserPage', params: {u_id: u_id}})
      },
      u_confirm: async () => {
        store.commit('spliceBlogs', self.blog_index)
        self.delDialog = false
        ElMessage.success('删除成功!')
        const res = await instance.delete('/del_blog', {params: {blog_id: self.blog_id, flag: 'all'}})
      },
      u_cancel: () => {
        self.delDialog = false
      },
      show_delDialog: (blog_id, blog_index) => {
        self.blog_id = blog_id
        self.blog_index = blog_index
        self.delDialog = true
      },
    })
    onMounted(async () => {
      self.loading = true
      const res1 = await instance.get('/get_taste')
      self.taste = res1.data
      const res2 = await instance.get('/get_blogs', {params: {flag: 'all'}})
      store.commit('set_blogs', res2.data)
      self.loading = false
    })
    return {
      ...toRefs(self)
    }
  }

}
</script>

<style lang="scss" scoped>
$icon-hover-color: #f18e63;
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
