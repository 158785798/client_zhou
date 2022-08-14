<template>
  <div>
    <el-backtop :bottom="100" class="backtop">
      <i class="iconfont iconfonttubiao02" style="font-size: 20px"></i>
    </el-backtop>
    <div style="margin-top:24px;border-bottom: 1px solid hotpink">
      <div style="margin-left: 306px;padding: 0;">
        <div style="display: flex;font-size: 14px;">
          <span v-for="(each, index) in nvas1" :class="['cursor-pointer', {active: index==nva_index}]"
                @click="to_tab(each.to, {tab: each.tab, index: index}, index)"
                style="width: 100px;height: 48px;margin:0 10px;display: flex;justify-content: center;align-items: center;">
            <span class="nva">
              <span :class="['iconfont', each.icon]"></span>
            <span style="padding: 0 8px">{{ each.name }}</span>
            </span>

          </span>
        </div>

        <div ref="underline" style="width: 100px;border-top: 3px solid red;
        transform: translateX(10px);transition-duration: .3s"></div>
      </div>

    </div>
    <div style="display: flex;">
      <aside style="width: 296px; margin-right: 20px;">
        <div style="position: sticky;top:100px;">
          <div style="display: flex; justify-content: center">
            <img :src="userInfo.avatarUrl" alt="" class="user-avatar">
          </div>
          <div
              style="color: #ff00ff;display: flex; justify-content: space-between;align-items: center; margin: 0 0 15px 0">
            <span style="font-size: 20px;">{{ userInfo.username }}</span>
            <span style="font-size: 14px">
              <span class="cursor-pointer" style="margin-right: 20px">{{ userInfo.fans }} 粉丝</span>
              <span class="cursor-pointer" style="margin: 0 5px">{{ userInfo.be_fans }} 关注</span>
            </span>

          </div>
          <div style="overflow: hidden; border-radius: 10px">
            <div v-show="userInfo.username" style="overflow: hidden;width: 592px; transition-duration: .2s"
                 :class="{follow: userInfo.follow}">
              <a-button type="primary" danger
                        style="transition-duration: 0.5s;font-weight: 700;border-radius: 10px;width: 296px"
                        @click="follow_in">
                <i class="iconfont iconfontjiahao" style="font-size: 12px; margin-right: 5px;"></i>
                关注
              </a-button>
              <div style="width: 296px; display: inline-block">
                <div style="display: flex">
                  <a-button type="text"
                            style="flex: 1;margin-right:10px;font-weight: 700;background-color: rgba(145,144,144,0.2);border-radius: 10px"
                            @click="follow_in">
                    取消关注
                  </a-button>
                  <a-button type="text"
                            style="flex: 1;font-weight: 700;background-color: rgba(145,144,144,0.2);border-radius: 10px"
                            @click="show_global_tip('再等等')">私信
                  </a-button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </aside>
      <aside style="flex: 1; margin-top: 20px">
        <router-view :key="route.path + JSON.stringify(route.query)"></router-view>
        <div style="text-align: center; color: rgba(0,0,0,0.53)">
          <img src="../../assets/loading2.gif" alt="" style="border-radius: 20px" width="150" v-show="endLoading">
          <span v-show="!endLoading&&!loading">我是有底线的o(*￣▽￣*)o</span>
        </div>
      </aside>

    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed, onMounted, reactive, toRefs, onBeforeMount} from "vue";
import {useRouter, useRoute} from "vue-router";
import {instance} from "../../api/request.js";
import {useMutations} from "../../utils/hooks.js";
import {getBase64} from "../../utils/tools.js";

export default {
  name: "OtherIndex",
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['show_global_tip', 'show_cropper'])
    const self = reactive({
      underline: null,
      loading: true,
      endLoading: false,
      nva_index: 0,
      userInfo: {},
      nvas1: [
        {name: 'Overview', icon: 'iconfontchongwutubiao18', to: 'Blog', tab: 'blog'},
        {name: '收藏', icon: 'iconfontshoucang1', to: 'Blog', tab: 'collection'},
        {name: '相册', icon: 'iconfontxiangce', to: 'Album', tab: 'album'},
      ],
      nvas2: [
        {name: '粉丝', icon: 'iconfontchongwutubiao18', to: 'Blog', tab: 'blog'},
        {name: '关注', icon: 'iconfontshoucang1', to: 'Blog', tab: 'collection'},
      ],
      to_tab: (to, query, index) => {
        self.nva_index = index
        self.underline.style.marginLeft = index * 120 + 'px'
        query.u_id = self.userInfo.id
        router.push({name: to, query: query})
      },
      follow_in: async () => {
        const res = await instance.get('/follow_in', {
          params: {
            be_user_id: self.userInfo.id,
            follow: self.userInfo.follow
          }
        })
        if (self.userInfo.follow) {
          self.userInfo.fans--
        } else {
          self.userInfo.fans++
        }
        self.userInfo.follow = !self.userInfo.follow

        const text = self.userInfo.follow ? '关注成功' : '取消关注'
        mutations.show_global_tip(text)
      },

    })
    onBeforeMount(async () => {
      const res = await instance.get('/get_userinfo', {params: {u_id: Number(route.query.u_id)}})
      self.userInfo = res.data
    })
    onMounted(async () => {
      self.nva_index = Number(route.query.index)
      self.underline.style.marginLeft = self.nva_index * 120 + 'px'
    })
    return {
      ...toRefs(self),
      ...mutations,
      route
    }
  },
}
</script>

<style lang="scss" scoped>
.follow {
  margin-left: -100%;
}

.user-avatar {
  border-radius: 50%;
  width: 296px;
  height: 296px;
  transform: translateY(-20px);
}

.nva {
  padding: 5px 8px;
  border-radius: 5px;
  font-weight: 600;
}

.nva:hover {
  //background-color: rgba(246, 179, 150, 0.8);
  color: deeppink;

}

.active {
  color: deeppink;
  font-weight: 800;
  transform: scale(1.2);
  transition-duration: 0s;
}

</style>
