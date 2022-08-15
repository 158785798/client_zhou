<template>
  <div>
    <el-backtop :bottom="100" class="backtop">
      <i class="iconfont iconfonttubiao02" style="font-size: 20px"></i>
    </el-backtop>

    <div :class="{'g-mask': fans.show}" @click="show_fans({show: false})"></div>
    <transition name="widening">
      <Fans v-if="fans.show"></Fans>
    </transition>
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
      <aside style="width: 296px; margin-right: 20px">
        <SelfAside v-if="is_self"></SelfAside>
        <OtherAside v-else></OtherAside>
      </aside>
      <aside style="flex: 1; margin-top: 20px;">
        <router-view :key="route.path + JSON.stringify(route.query)"></router-view>
      </aside>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed, onMounted, reactive, toRefs} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useMutations} from "../../utils/hooks.js";
import SelfAside from "./SelfAside.vue";
import OtherAside from "./OtherAside.vue";
import Fans from "../../components/Fans.vue";


export default {
  name: "OtherIndex",
  components: {
    SelfAside,
    OtherAside,
    Fans
  },
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['show_global_tip', 'show_cropper', 'show_fans',])
    const self = reactive({
      is_self: computed(() => store.state.local.userInfo.id == route.query.u_id),
      underline: null,
      bb: false,
      nva_index: 0,
      fans: computed(() => store.state.session.fans),
      nvas1: [
        {name: 'Overview', icon: 'iconfontchongwutubiao18', to: 'Blog', tab: 'blog'},
        {name: '收藏', icon: 'iconfontshoucang1', to: 'Blog', tab: 'collection'},
        {name: '相册', icon: 'iconfontxiangce', to: 'Album', tab: 'album'},
      ],

      get_fans: () => {
        document.getElementById('app').style.overflow = 'hidden'
        self.bb = !self.bb
      },
      to_tab: (to, query, index) => {
        self.nva_index = index
        self.underline.style.marginLeft = index * 120 + 'px'
        query.u_id = route.query.u_id
        router.push({name: to, query: query})
      },
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
.friend-mask:after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 300;
  position: absolute;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.6);
}

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
  transition-duration: .2s;
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
