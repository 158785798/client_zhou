<template>
  <div class="f-main">
    <a-spin class="spin" :spinning="fans.loading"></a-spin>
    <span class="default-text" v-show="fans.value.length===0 && !fans.loading">空空如也</span>
    <div style="display:flex; justify-content: space-between">
      <div>
          <span v-for="(item, index) in nva" @click="to_nva(index)" :class="{active: index==fans.index}"
                class="nva cursor-pointer" style="padding: 5px; margin-right: 20px">{{ item.name }}</span>
      </div>
      <i class="iconfont iconfontchahao1 cursor-pointer" @click="show_fans({show: false})"></i>
    </div>


    <div ref="underline" class="underline"></div>
    <div style="overflow:hidden;">
      <div class="navItem_left" style="padding:10px;display: flex; align-items: center"
           v-for="item in fans.value">
        <div style="display: flex; align-items: center;flex: 1;">
          <img @click="to_tab('UIndex', {u_id: item.id})" :src="item.avatarUrl" alt="" @error="set_default"
               style="width: 50px; height: 50px; border-radius: 50%">
          <div style=" margin: 0 10px">
            <div @click="to_tab('UIndex', {u_id: item.id})" class="cursor-pointer">{{ item.username }}</div>
            <div style="color: #939393; margin: 3px 0">无敌帅</div>
          </div>
        </div>

        <a-button v-if="fans.index===0" type="text"
                  style="margin-right:10px;font-weight: 700;background-color: rgba(145,144,144,0.2);border-radius: 10px"
                  @click="follow_in(item)">
          {{ item.follow ? '互相关注':'回关' }}
        </a-button>
        <a-button v-else type="text"
                  style="margin-right:10px;font-weight: 700;background-color: rgba(145,144,144,0.2);border-radius: 10px"
                  @click="follow_in(item)">
          {{ item.follow ? '互相关注':'已关注' }}
        </a-button>
      </div>
    </div>
    <div class="bottom-linear"></div>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted, computed} from "vue";
import {useStore} from "vuex";
import {useRouter, useRoute} from "vue-router";
import {useMutations} from "../utils/hooks.js";
import {get_fans, set_default, to_tab} from "../utils/tools.js";
import {instance} from "../api/request.js";

export default {
  name: "Fans",
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const mutations = useMutations('session', ['clear_fans', 'show_fans', 'show_global_tip'])
    const self = reactive({
      fans: computed(() => store.state.session.fans),
      userInfo: computed(() => store.state.session.cur_userInfo),
      underline: null,
      nva: [
        {name: '粉丝'},
        {name: '关注'}
      ],
      follow_in: async (item) => {
        const res = await instance.get('/follow_in', {
          params: {
            be_user_id: item.id,
            follow: item.follow
          }
        })
        item.follow = !item.follow

        const text = item.follow ? '关注成功' : '取消关注'
        mutations.show_global_tip(text)
      },
      to_nva: async (index) => {
        self.underline.style.marginLeft = index * 56 + 'px'
        mutations.clear_fans()
        await get_fans(self.userInfo.id, index)
      },
    })
    onMounted(() => {
      if (self.underline) {
        self.underline.style.marginLeft = self.fans.index * 56 + 'px'
      }

    })
    return {
      ...toRefs(self),
      set_default,
      to_tab,
      ...mutations
    }
  }
}
</script>

<style lang="scss" scoped>
.f-main {
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  position: fixed;
  height: 70vh;
  z-index: 500;
  width: 560px;
  border-radius: 10px;
  background-color: #f4e6e6;
  padding: 20px 30px
}

.iconfontchahao1 {
  transform: translate(-10px -10px);
}

.spin {
  height: 10px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  position: absolute;
}

.underline {
  width: 20px;
  border-top: 3px solid red;
  transform: translateX(10px);
  transition-duration: .3s
}

.default-text {
  width: 60px;
  left: 0;
  right: 0;
  top: 40%;
  margin: auto;
  position: absolute;
}

.follow-in {
  background-color: #fff;
  border-radius: 20px;
  border-color: #f18e63;
  color: #f18e63
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

.bottom-linear {
  border-radius: 10px;
  z-index: 1;
  left: 0;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(240, 6, 248, 0), #f199d5);
  position: absolute;
  bottom: 0;
  height: 80px;
  width: 100%;
}

.active {
  color: deeppink;
  font-weight: 800;
  transform: scale(1.2);
  transition-duration: 0s;
}

</style>