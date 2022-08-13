<template>
  <div :class="{'g-mask': maskShow}" @click="close_mask"></div>
  <Header class="header" :msgCount="msgCount" @show_msg_box="show_msg_box"></Header>
  <transition name="bound-in">
    <Pub v-if="pub" @close_pub="pub=false"></Pub>
  </transition>
  <transition name="fade">
    <div v-show="globalTip.show" class="g-tip">
      <div>
        <div class="iconfont iconfonticon_succeed" style="font-size: 40px;margin: 10px; font-weight: lighter"></div>
        <div>{{ globalTip.text }}</div>
      </div>
    </div>
  </transition>
  <MsgBox v-show="msgBoxShow" @show_msg_box="show_msg_box" :msgBox="msgBox" :msgBoxLoading="msgBoxLoading"></MsgBox>
  <div class="g-blog" v-show="dialog.show">
    <div style="margin-bottom: 20px; ">{{ dialog.text }}</div>
    <el-button size="small" @click="u_confirm">确认</el-button>
    <el-button size="small" @click="close_mask">取消</el-button>
  </div>
  <ImagePreview v-if="imagePreview.show"></ImagePreview>
  <Cropper v-show="cropper.show"></Cropper>
  <el-container style="margin: 50px auto" :class="{'msg-box': msgBoxShow}" @click="msgBoxShow=false">
    <span @click="pub=!pub" style="position: fixed;z-index:120;transform: translate(200px, -35px)">
      <i class="iconfont iconfontjiahao " style="font-size: 30px;color: red;"></i>
  </span>
    <div style="width: 100%;margin: 15px 0 0 0; position: relative" :class="{'pub': pub}" @click="pub=false">
      <router-view/>
    </div>
  </el-container>

</template>

<script>
import Pub from "../../components/Pub.vue";
import MsgBox from "../../components/MsgBox.vue";
import Cropper from "../../components/Cropper.vue";
import Header from "../../components/Header.vue";

import {useStore} from "vuex";
import instance from "../../api/request.js";
import {useRoute, useRouter} from "vue-router";
import {useMutations} from "../../utils/hooks.js";
import ImagePreview from "../../components/ImagePreview.vue";
import {getCurrentInstance, computed, onMounted, reactive, toRefs} from "vue";


export default {
  name: "Home",
  components: {
    Header,
    Pub,
    Cropper,
    MsgBox,
    ImagePreview
  },
  setup() {
    const socket = getCurrentInstance().proxy.$socket
    socket.on('prompt', () => {
      self.msgCount++
    })
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['concat_blogs', 'close_mask', 'remove_blog', 'show_global_tip'])
    const self = reactive({
      dialog: computed(() => store.state.session.dialog),
      imagePreview: computed(() => store.state.session.imagePreview),
      cropper: computed(() => store.state.session.cropper),
      maskShow: computed(() => self.dialog.show || self.cropper.show),
      msgCount: 0,
      globalTip: computed(() => store.state.session.globalTip),
      msgBoxShow: false,
      msgBoxLoading: true,
      msgBox: [],
      pub: false,
      clientId: computed(() => {
        return store.state.local.userInfo.id
      }),
      u_confirm: async () => {
        mutations.remove_blog()
        const blog_id = store.state.session.dialog.obj_id
        const res = await instance.delete('/del_blog', {params: {blog_id: blog_id}})
        if (res.code === 200) {
          mutations.show_global_tip('删除成功')
        }
      },
      show_msg_box: async (flag) => {
        if (flag === 'sub' && self.msgCount > 0) {
          self.msgCount--
        }
        self.msgBoxShow = !self.msgBoxShow
        if (self.msgBoxShow) {
          const res = await instance.get('/get_box_msg')
          self.msgBox = res.data
          self.msgBoxLoading = false
        }
      },
    })
    onMounted(async () => {
      const res = await instance.get('/get_msg_count')
      if (res.data > 99) {
        self.msgCount = 99
      } else {
        self.msgCount = res.data
      }
    })
    return {
      ...toRefs(self),
      ...mutations,
      route
    }
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 800px) {
  .header {
    width: 100%;
  }
}


.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.iconfonticon_succeed {
  cursor: default;
}

.iconfonticon_succeed:hover {
  color: #fff;
}

.pub-enter-active, .pub-leave-active {
  transition: all .3s linear;
}

.pub-enter-from, .pub-leave-to {
  transform: translateY(200px) rotateX(90deg);
}

.g-mask:after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  position: fixed;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.6);
}

.msg-box:after {
  content: '';
  background-color: rgba(0, 0, 0, 0.3);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 150;
  position: fixed;
}

.pub::after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  position: fixed;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.23);
}

.g-tip {
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  border-radius: 10px;
  background-color: rgba(0, 0, 0, 0.76);
  width: 200px;
  height: 130px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 500;
  margin: auto
}

.g-blog {
  background-color: #e5b77a;
  padding: 20px;
  border-radius: 10px;
  z-index: 300;
  position: fixed;
  text-align: center;
  width: 200px;
  margin: auto;
  left: 0;
  right: 0;
  top: 300px;
}

</style>
