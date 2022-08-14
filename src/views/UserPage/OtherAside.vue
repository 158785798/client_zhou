<template>
  <div style="position: sticky;top:100px;">
    <div style="display: flex; justify-content: center">
      <img :src="userInfo.avatarUrl" alt="" class="user-avatar">
    </div>
    <div
        style="color: #ff00ff;display: flex; justify-content: space-between;align-items: center; margin: 0 0 15px 0">
      <span style="font-size: 20px;">{{ userInfo.username }}</span>
      <span style="font-size: 14px">
              <span class="cursor-pointer nva" style="margin-right: 20px">{{ userInfo.fans }} 粉丝</span>
              <span class="cursor-pointer nva" style="margin: 0 5px">{{ userInfo.be_fans }} 关注</span>
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
</template>

<script>
import {useStore} from "vuex";
import {reactive, toRefs} from "vue";
import {useRouter, useRoute} from "vue-router";
import {instance} from "../../api/request.js";
import {useMutations} from "../../utils/hooks.js";

export default {
  name: "OtherIndex",
  props: ['userInfo'],
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['show_global_tip'])
    const self = reactive({
      underline: null,
      loading: true,
      endLoading: false,
      nva_index: 0,
      follow_in: async () => {
        const res = await instance.get('/follow_in', {
          params: {
            be_user_id: props.userInfo.id,
            follow: props.userInfo.follow
          }
        })
        if (props.userInfo.follow) {
          props.userInfo.fans--
        } else {
          props.userInfo.fans++
        }
        props.userInfo.follow = !props.userInfo.follow
        const text = props.userInfo.follow ? '关注成功' : '取消关注'
        mutations.show_global_tip(text)
      },
    })
    return {
      ...toRefs(self),
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
