<template>
  <div class="cut-img-main">
    <div style="padding: 15px 0 0 0;display: flex; justify-content: space-between">
      <strong>{{cropper.title}}</strong>
    </div>
    <div style="position: relative; margin: 20px 0; border-radius: 15px;">
      <div style="border-radius: 15px; overflow: hidden">
        <VueCropper :fixed="true" :autoCropWidth="336" :auto-cropHeight="336"
                    :auto-crop="true" mode="cover"
                    :img="cropper.origin_b64" ref="myCropper" :info="false"/>
      </div>
      <div style="text-align: center; margin-top: 30px">
        <el-button v-loading="loading" @click="close_cropper">取消</el-button>
        <el-button type="primary" v-loading="loading" @click="upload">完成</el-button>
      </div>
      <div style="width: 100%;position: absolute; bottom: -80px; text-align: center">
        <i class="iconfont iconfontguanbi1 close-cut-img cursor-pointer" @click="close_cropper"
        ></i>
      </div>
    </div>
  </div>

</template>

<script>
import {computed, reactive, toRefs} from "vue";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import {instance} from "../api/request.js";
import {VueCropper} from "vue-cropper";
import 'vue-cropper/dist/index.css';
import {useMutations} from "../utils/hooks.js";

export default {
  name: "Cropper",
  components: {
    VueCropper
  },
  setup(props, context) {
    const store = useStore()
    const mutations = useMutations('session', ['close_cropper', 'replace_blog_image', 'close_cropper'])
    const self = reactive({
      avatarUploading: computed(() => store.state.avatarUploading !== self.showCutImgLoading),
      showCutImgLoading: false,
      cropper: computed(() => store.state.session.cropper),
      myCropper: null,
      loading: false,
      upload: () => {
        if (self.loading) return
        self.myCropper.getCropData(async (imgB64) => {
              self.loading = true
              const data = {
                u_id: store.state.local.userInfo.id,
                name: self.cropper.name,
                imgB64: imgB64,
                flag: self.cropper.flag,
              }
              const res = await instance.post('/upload_b64', data)
              if (self.cropper.flag === 'avatar') {
                store.commit('local/saveUserInfo', {avatarUrl: res.avatarUrl})
              } else {
                mutations.replace_blog_image(imgB64)
              }
              mutations.close_cropper()
              self.loading = false
            }
        )

      }
    })
    return {
      ...toRefs(self),
      ...mutations
    }
  }
}

</script>

<style lang="scss" scoped>
@import "../global";

.cut-img-main {
  z-index: 1000;
  width: 640px;
  height: 680px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  position: fixed;
  background-color: #f1f1f1;
  padding: 0 30px 50px 30px;
  border-radius: 15px;
  transition-duration: 0.5s;
}

.close-cut-img {
  font-size: 20px;
  padding: 5px;
  color: #f1f1f1;
  border: 1px solid #f1f1f1;
  border-radius: 50%;
}
.close-cut-img:hover{
  color: $icon-hover-color;
  border-color: $icon-hover-color;
}

.cut-img-loading {
  width: 350px;
  height: 350px;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red !important;
  z-index: 700;
  background: rgba(255, 255, 255, .5)

}

.upload-cut-avatar {
  /*text-align: center;*/
  /*color: #05509b;*/
  /*font-weight: 600;*/
  /*font-size: 15px !important;*/
  /*transition-duration: 0.2s;*/
  /*margin-bottom: 10px;*/
  /*margin-left: 10px;*/
  /*border-radius: 10px;*/
  /*background-color: rgb(233, 162, 104, 0.6);*/
  /*padding: 3px 10px;*/
  /*cursor: pointer;*/
}

/*.upload-cut-avatar:hover {*/
/*  background-color: rgb(233, 162, 104, 0.8);*/
/*}*/

.img-cut-tool {
  font-size: 25px !important;
  font-weight: 700;
  margin: 7px;
  transition-duration: 0.2s;
}

.img-cut-tool::before {
  padding: 5px;
  /*border: 3px solid rgba(84, 84, 84, 0.5);*/
  border-radius: 20px;
  /*box-shadow: 0 0 5px 1px rgb(155, 154, 152);*/

}

.img-cut-tool:hover {
  transform: scale(1.1);
}

</style>
