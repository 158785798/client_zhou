<template>
  <div class="cut-img-main">
    <div style="padding: 15px 0 0 0;display: flex; justify-content: space-between">
      <strong>Update Your Avatar</strong>
      <i class="iconfont iconfontguanbi1 close-cut-img cursor-pointer" @click="closeCutImg"
      ></i>
    </div>
    <div style="width: 100%; height: 100%; display: flex;justify-content: center;">

      <div style="position: relative">
        <VueCropper :centerBox="false" :fixedBox="true" :canMoveBox="false" :fixedNumber="[1,1]" :fixed="true"
                    :autoCrop="true"
                    style="border-radius: 20px;overflow: hidden;"
                    :img="imgUrl" ref="cropper" :info="false"/>
      </div>
      <div
          style="display: flex; flex-direction: column; justify-content: space-between; align-items: center; margin-left: 20px">
        <div
            style="margin-left: 20px; justify-content: center; align-items: center">
          <div style="margin: 20px auto">
            <i class="iconfont iconfontxuanzhuan-1 img-cut-tool cursor-pointer" @click="rotateRight"></i>
            <i class="iconfont iconfontxuanzhuan-2 img-cut-tool cursor-pointer" @click="rotateLeft"></i>
          </div>

          <div style="margin: 20px auto">
            <i class="iconfont iconfontjiahao img-cut-tool cursor-pointer" @click="zoomIn" style="font-size: 20px !important;"></i>
            <i class="iconfont iconfontshouqi img-cut-tool cursor-pointer" @click="zoomOut"></i>
          </div>

        </div>
        <el-button v-loading="loading" @click="getCronData">Upload</el-button>
      </div>
    </div>
  </div>

</template>

<script>
import {computed, reactive, toRefs} from "vue";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import instance from "../api/request.js";
import {VueCropper} from "vue-cropper";
import 'vue-cropper/dist/index.css';

export default {
  name: "CutImg",
  props: {
    imgUrl: String
  },
  components: {
    VueCropper
  },
  setup(props, context) {
    const store = useStore()
    const self = reactive({
      avatarUploading: computed(() => store.state.avatarUploading !== self.showCutImgLoading),
      showCutImgLoading: false,
      cropper: null,
      loading: false,
      emit_finish: () => {
        context.emit('closeCutImg')
        ElMessage.success('update success!')
      },
      uploadAvatar: async (data) => {
        self.loading = true
        const res = await instance.post('/update_avatar', {user_id: store.state.userInfo.id, file: data})
        if (res.code === 200) {
          store.commit('saveUserInfo', {avatarUrl: res.avatarUrl})
          self.emit_finish()
        } else {
          ElMessage.error(res.msg)
        }
        self.loading = false
      },
      closeCutImg: () => {
        if (!store.state.avatarUploading) {
          context.emit('closeCutImg')
        }
      },

      getCronData: () => {
        if (self.loading) {
          return
        }
        self.cropper.getCropData(data => {

          self.uploadAvatar(data)
        })
      },
      rotateRight: () => {
        self.cropper.rotateRight()
      },
      zoomIn: () => {
        self.cropper.changeScale(0.8)
      },
      zoomOut: () => {
        self.cropper.changeScale(-0.8)
      },
      rotateLeft: () => {
        self.cropper.rotateLeft()
      },
    })
    return {
      ...toRefs(self)
    }
  },
}

</script>

<style scoped>
.cut-img-main {
  z-index: 600;
  width: 550px;
  background: #f1f1f1;
  padding: 0 30px 50px 50px;
  border-radius: 15px;
  transition-duration: 0.5s;
}

.close-cut-img {
  font-size: 30px;
  width: 30px;
  color: #f1f1f1;
  text-align: center;
  transition-duration: 0.2s;
  transform: translate(60px, -25px);
  border-radius: 50%;
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
