<template>
  <div style="position: sticky;top:100px;">
    <div style="display: flex; justify-content: center">
      <el-upload class="user-avatar" ref="upload" :beforeUpload="beforeUpload" accept=".png, .jpg, .jpeg"
                 name="file" :show-file-list="false" :headers="{authorization: 'JWT ' + token}"
                 :http-request="customRequest">
        <img class="user-avatar main-bg" v-if="cur_userInfo" :src="cur_userInfo.avatarUrl" @error="set_default" alt="">
      </el-upload>
    </div>
    <InfoNva v-if="cur_userInfo"></InfoNva>
    <div v-if="cur_userInfo" style="font-size: 20px;margin: 20px 0;color: deeppink">
    <strong>{{ cur_userInfo.bio }}</strong>
      </div>
    <div v-show="bioShow">
      <a-input v-model:value="bio" style="border-radius: 8px" placeholder="Add your bio"></a-input>
      <a-button style="border-radius: 8px;color: white; background-color: #55a532" @click="save_bio">save</a-button>
      <a-button style="border-radius: 8px;margin-left: 10px" @click="close_bio">cancel</a-button>
    </div>
    <div class="bio-btn main-bg cursor-pointer" style="border-radius: 5px; padding: 5px
        ;text-align: center" @click="bioShow=true" v-show="!bioShow">
      <b  style="color: #51565b">Add a bio</b>
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
import {get_fans, getBase64, set_default} from "../../utils/tools.js";
import {instance} from "../../api/request.js";
import InfoNva from "./InfoNva.vue";


export default {
  name: "SelfIndex",
  components: {
    InfoNva
  },
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['set_bio','show_global_tip', 'show_cropper', 'set_cur_user_info'])
    const self = reactive({
      upload: null,
      bioShow: false,
      bio: '',
      cur_userInfo: computed(() => store.state.session.cur_userInfo),
      token: computed(() => window.localStorage.getItem('token_zhou')),
      beforeUpload(file) {
        if (file.size > 10240000) {
          alert('图片不能超过10M！')
          return false
        }
        return true
      },
      save_bio: async () => {
        console.log(self.bio)
        const res = instance.get('/save_bio', {params: {bio: self.bio}})
        mutations.set_bio(self.bio)
        self.bio = ''
        self.bioShow = false
      },
      close_bio: () => {
        self.bio = ''
        self.bioShow = false
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
      mutations.set_cur_user_info(res.data)
    })
    return {
      ...toRefs(self),
      ...mutations,
      get_fans,
      set_default,
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
