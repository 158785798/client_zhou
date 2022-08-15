<template>
  <div style="position: sticky;top:100px;">
    <div style="display: flex; justify-content: center">
      <img v-if="cur_userInfo" :src="cur_userInfo.avatarUrl" @error="set_default" alt="" class="user-avatar">
    </div>
    <InfoNva v-if="cur_userInfo"></InfoNva>
    <div v-if="cur_userInfo" style="font-size: 20px;margin: 20px 0;color: deeppink">
      <strong>{{ cur_userInfo.bio }}</strong>
    </div>
    <div style="overflow: hidden; border-radius: 10px">
      <div v-if="cur_userInfo" style="overflow: hidden;width: 592px; transition-duration: .2s"
           :class="{follow: cur_userInfo.follow}">
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
              已关注
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
</template>

<script>
import {useStore} from "vuex";
import {reactive, toRefs, onMounted, computed} from "vue";
import {useRouter, useRoute} from "vue-router";
import {instance} from "../../api/request.js";
import {useMutations} from "../../utils/hooks.js";
import {get_fans, set_default} from "../../utils/tools.js";
import InfoNva from "./InfoNva.vue";

export default {
  name: "OtherIndex",
  components: {
    InfoNva
  },

  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['show_global_tip', 'set_cur_user_info'])
    const self = reactive({
      loading: true,
      endLoading: false,
      cur_userInfo: computed(() => store.state.session.cur_userInfo),
      follow_in: async () => {
        const res = await instance.get('/follow_in', {
          params: {
            be_user_id: self.cur_userInfo.id,
            follow: self.cur_userInfo.follow
          }
        })
        if (self.cur_userInfo.follow) {
          self.cur_userInfo.fans--
        } else {
          self.cur_userInfo.fans++
        }
        self.cur_userInfo.follow = !self.cur_userInfo.follow
        const text = self.cur_userInfo.follow ? '关注成功' : '取消关注'
        mutations.show_global_tip(text)
      },
    })
    onMounted(async () => {
      const res = await instance.get('/get_userinfo', {params: {u_id: Number(route.query.u_id)}})
      mutations.set_cur_user_info(res.data)
    })
    return {
      ...toRefs(self),
      get_fans,
      set_default,
      ...mutations,
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
