<template>
  <el-backtop :bottom="100" class="backtop">
    <i class="iconfont iconfonttubiao02" style="font-size: 20px"></i>
  </el-backtop>

  <div class="common-layout" style="display: flex;height: 100%">
    <aside class="left-card main-bg" style="height: 100%;width:200px;border-radius: 6px;">
      <div style="position: sticky;top:60px;">
        <div style="font-size: 25px; margin: 10px 20px;height: 100%;">首页</div>
        <div class="navItem_left cursor-pointer" v-for="item in nvamenus">
          <div style=" padding:10px 20px">
            <i :class="item.icon" style="margin-right: 18px"></i>
            <span>{{ item.name }}</span>
          </div>
        </div>

        <div style="margin: 20px">
          更新日志 欢迎体验
        </div>
        <div>
          <div style="display: flex;margin:0 10px 20px 10px" v-for="(item, index) in logs">
            <div style="margin-right: 10px">{{ item.time }}</div>
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>
    </aside>
    <main v-loading="loading" style="margin: 0 10px; flex: 1">
      <router-view @finish="loading=false" :key="route.path + JSON.stringify(route.query)"></router-view>
    </main>
    <aside style="height: 100%;width:300px;border-radius: 6px;">
      <div style="position: sticky;top:-50px;">
        <div class="right-card main-bg cursor-pointer">
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
        <div class="main-bg cursor-pointer" style="border-radius: 6px;margin-bottom: 10px;">
          <div style="padding: 10px 15px 10px 15px;">
            <span>你可能感兴趣的人</span>
          </div>
          <div class="navItem_left" style="padding:20px;display: flex; align-items: center"
               v-for="item in taste">
            <div @click="to_tab('UIndex', {u_id: item.id})"
                 style="display: flex; align-items: center;flex: 1;">
              <img :src="item.avatarUrl" alt="" style="width: 50px; height: 50px; border-radius: 50%">
              <div style=" margin: 0 10px">
                <div>{{ item.username }}</div>
                <div style="color: #939393; margin: 3px 0">{{item.bio}}</div>
              </div>
            </div>
            <span v-if="item.follow" style="font-size: 12px;">
                <i class="iconfont iconfontduihao"></i>
                已关注
              </span>
            <a-button v-else type="text" @click="follow_in(item)"
                      style="background-color: #fff;border-radius: 20px;border-color: #f18e63; color: #f18e63">+关注
            </a-button>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import {instance} from "../../api/request.js";
import {to_tab} from "../../utils/tools.js";
import {useStore} from "vuex";

export default {
  name: "TIndex",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const self = reactive({
      userInfo: computed(() => store.state.local.userInfo),
      logs: [
        {text: '已启用关注功能', time: '8/14'},
        {text: '聊天功能已修复', time: '8/10'},
        {text: '消息盒子可以实时提示', time: '8/09'},
        {text: '已读消息显示灰色', time: '8/09'},
        {text: '评论消息自动打开评论页面', time: '8/09'},
        {text: '消息盒囊括点赞和评论消息', time: '8/09'},
        {text: '消息盒子可直达blog', time: '8/08'},
        {text: '消息盒子内头像直达个人主页', time: '8/08'},
      ],
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
      follow_in: async (item) => {
        if (item.follow) {
          const res = await instance.get('/follow_out', {
            params: {
              be_user_id: item.id,
            }
          })
        } else {
          const res = await instance.get('/follow_in', {
            params: {
              be_user_id: item.id,
            }
          })
        }

        item.follow = !item.follow
        const text = item.follow ? '关注成功' : '取消关注'
        mutations.show_global_tip(text)
      },
      taste: [],
      loading: true,
    })
    onMounted(async () => {
      const res = await instance.get('/get_taste')
      self.taste = res.data
    })

    return {
      ...toRefs(self),
      to_tab,
      route
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../global";

.navItem_left:hover {
  background-color: $main_bg_color;
}

.right-card {
  padding: 10px 15px 20px 15px;
  border-radius: 6px;
  margin-bottom: 10px;
}

</style>
