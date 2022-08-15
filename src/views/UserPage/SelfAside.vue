<template>
  <div style="position: sticky;top:100px;">
    <div style="display: flex; justify-content: center">
      <el-upload ref="upload" :beforeUpload="beforeUpload" accept=".png, .jpg, .jpeg"
                 name="file" :show-file-list="false" :headers="{authorization: 'JWT ' + token}"
                 :http-request="customRequest">
        <img :src="userInfo.avatarUrl" alt="" class="user-avatar">
      </el-upload>
    </div>
    <div
        style="color: #ff00ff;display: flex; justify-content: space-between;align-items: center; margin: 0 0 15px 0">
      <span style="font-size: 20px;">{{ userInfo.username }}</span>
      <span style="font-size: 14px">
              <span class="cursor-pointer nva" style="margin-right: 20px">{{ userInfo.fans }} 粉丝</span>
              <span class="cursor-pointer nva" style="margin: 0 5px">{{ userInfo.be_fans }} 关注</span>
            </span>
    </div>
    <div class="bio-btn cursor-pointer" style="border-radius: 5px; padding: 5px
        ;background-color: #f6f8fa; text-align: center">
      <b style="color: #51565b">Add a bio</b>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed, reactive, toRefs, onMounted} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useMutations} from "../../utils/hooks.js";
import {getBase64} from "../../utils/tools.js";
import {instance} from "../../api/request.js";

export default {
  name: "SelfIndex",
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['show_global_tip', 'show_cropper'])
    const self = reactive({
      upload: null,
      userInfo: {},
      token: computed(() => window.localStorage.getItem('token_zhou')),
      beforeUpload(file) {
        if (file.size > 10240000) {
          alert('图片不能超过10M！')
          return false
        }
        return true
      },
      customRequest: async (info) => {
        getBase64(info.file, imgB64 => {
          mutations.show_cropper({
            index: 1,
            title: 'Update Your Avatar',
            flag: 'avatar',
            origin_b64: imgB64,
            name: 'ss'
          })
        })
      },
    })
    onMounted(async () => {
      const res = await instance.get('/get_userinfo', {params: {u_id: Number(route.query.u_id)}})
      self.userInfo = res.data
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

.user-avatar {
  border-radius: 50%;
  width: 296px;
  height: 296px;
  transform: translateY(-20px);
}

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
