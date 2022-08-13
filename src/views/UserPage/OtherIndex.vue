<template>
  <div>
    <el-backtop :bottom="100" class="backtop">
      <i class="iconfont iconfonttubiao02" style="font-size: 20px"></i>
    </el-backtop>
    <div style="margin-top:24px;border-bottom: 1px solid hotpink">
      <div style="margin-left: 400px;padding: 0;">
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
      <aside style="width: 380px; margin-right: 20px">
        <div style="position: relative;width: 296px;height: 280px">

          <img :src="userInfo.avatarUrl" alt="" style="position: absolute;top:-30px;left: 40px;
            border-radius: 50%;width: 296px;height: 296px"
               class="user-avatar">
        </div>
        <div style="font-size: 20px;display: flex; justify-content: space-between;align-items: center">
          <span style="margin: 0 10px">{{ userInfo.username }}</span>
          <el-button style="margin: 0 10px;border-radius: 20px" @click="show_global_tip('关注成功')">关注</el-button>
        </div>
        <div style="display: flex;font-size: 16px;justify-content: center;align-items: center;">
          <span v-for="(each, index) in nvas2" class="cursor-pointer"
                style="color:rgba(227,23,250,0.8);width: 120px;height: 48px;display: flex;justify-content: center;align-items: center;">
            <span class="nva">
              <span :class="['iconfont', each.icon]"></span>
            <span style="padding: 0 3px">{{ each.name }}</span>
            <span>999</span>
            </span>

          </span>
        </div>
        <div class="bio-btn cursor-pointer" style="margin: 20px 10px;border-radius: 5px; padding: 5px
        ;background-color: #f6f8fa; text-align: center">
          <b style="color: #51565b">Add a bio</b>
        </div>
        <div>
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
        {name: '被关注', icon: 'iconfontchongwutubiao18', to: 'Blog', tab: 'blog'},
        {name: '关注', icon: 'iconfontshoucang1', to: 'Blog', tab: 'collection'},
        {name: '私信', icon: 'iconfontxiangce', to: 'Album', tab: 'album'},
      ],
      to_tab: (to, query, index) => {
        self.nva_index = index
        self.underline.style.marginLeft = index * 120 + 'px'
        query.u_id = self.userInfo.id
        router.push({name: to, query: query})
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
.bio-btn:hover {
  background-color: #f3f4f6 !important;
}

.nva {
  padding: 5px 8px;
  border-radius: 5px;
  font-weight: 600;
}

.nva:hover {
  background-color: rgba(246, 179, 150, 0.8);
  color: deeppink;

}

.active {
  color: deeppink;
  font-weight: 800;
  transform: scale(1.2);
  transition-duration: 0s;
}

</style>
