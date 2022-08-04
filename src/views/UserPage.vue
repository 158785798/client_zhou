<template>
  <el-backtop :bottom="100">
    <div style="height: 100%;width: 100%;box-shadow: red;text-align: center;line-height: 40px;color: #1989fa;">
      TOP
    </div>
  </el-backtop>
  <div :class="[{'cut-img-mask': showCutImg},{'scale-cut-img': !showCutImg}]" @click="openCutImg"></div>
  <CutImg :imgUrl="cutImgUrl" :class="['cropper-avatar', {'scale-cut-img': !showCutImg}]"
          @closeCutImg="showCutImg=false"></CutImg>
  <header style="position: relative" :class="{'del-blog': delDialog}">
    <div class="u-del-blog" v-show="delDialog">
      <div style="margin-bottom: 20px; ">确定要删帖吗？</div>
      <el-button size="small" @click="u_confirm">确认</el-button>
      <el-button size="small" @click="u_cancel">取消</el-button>
    </div>
    <div style="display: flex;  align-items: center">
      <el-upload ref="upload" :beforeUpload="beforeUpload" accept=".png, .jpg, .jpeg"
                 name="file" :show-file-list="false" :headers="{authorization: 'JWT ' + token}"
                 :http-request="customRequest">
        <div style="position: relative">
          <img :src="userInfo.avatarUrl" alt="" style="border-radius: 50%;width: 6rem;height: 6rem" class="user-avatar">
        </div>
      </el-upload>
      <div style="flex: 1;margin-left: 20px">
        <div style="margin: 5px auto">
          <strong>{{ userInfo.username }}</strong>
        </div>
        <span>粉丝 3735.8万</span>

      </div>
      <div>
        <el-button style="border-radius: 20px">关注</el-button>
      </div>
    </div>
    <div style="font-size: 12px; color: rgba(0,0,0,0.49);margin: 5px">
      IP归属地： 湖南
    </div>
    <Cell @show_delDialog="show_delDialog" :item="item" :index="index" v-for="(item, index) in blogs"></Cell>
  </header>
</template>

<script>
import CutImg from "../components/CutImg.vue";
import {useStore} from "vuex";
import {computed, onBeforeMount, onMounted, reactive, toRefs} from "vue";
import {useRouter, useRoute} from "vue-router";
import instance from "../api/request.js";
import {ElMessage} from "element-plus";
import Cell from "../components/Cell.vue";


export default {
  name: "UserPage",
  components: {
    CutImg,
    Cell,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const getBase64 = (file, callback) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => callback(reader.result);
    }
    const self = reactive({
      token: computed(() => window.localStorage.getItem('token_zhou')),
      userInfo: {},
      showUploadAvatarMask: false,
      upload: null,
      delDialog: false,
      dd: computed(() => {
        return self.delDialog
      }),
      blogs: [],
      cutImgUrl: '',
      showCutImg: false,
      isUploadAvatarMaskShow: false,
      loading: false,
      blog_id: null,
      underlineNavIndex: 0,
      underlineNavItems: [
        {name: 'overview'},
        {name: 'repositories'},
        {name: 'projects'},
        {name: 'packages'},
      ],
      u_confirm: async () => {
        self.blogs.splice(self.blog_index, 1)
        self.delDialog = false
        ElMessage.success('删除成功!')
        const res = await instance.delete('/del_blog', {params: {blog_id: self.blog_id, flag: 'user'}})

      },
      u_cancel: () => {
        self.delDialog = false
      },
      show_delDialog: (blog_id) => {
        self.blog_id = blog_id
        self.delDialog = true
      },
      openCutImg: () => {
        if (store.state.avatarUploading) {
          self.showCutImg = false
        }
      },

      beforeUpload(file) {
        if (file.size > 10240000) {
          alert('图片不能超过10M！')
          return false
        }
        return true
      },
      customRequest: async (info) => {
        getBase64(info.file, cutImgUrl => {
          self.cutImgUrl = cutImgUrl
        })
        self.showCutImg = true
      },
      get_blogs: async () => {
        const res1 = await instance.get('/get_userinfo', {params: {u_id: route.params.u_id}})
        self.userInfo = res1.data
        const res2 = await instance.get('/get_blogs', {params: {u_id: route.params.u_id, flag: 'one'}})
        self.blogs.push(...res2.data)
      },
    })
    onMounted(() => {
      self.get_blogs()
    })
    return {
      ...toRefs(self)
    }
  },
}
</script>

<style lang="scss" scoped>
.cropper-avatar {
  transition-duration: 0.5s;
  position: absolute;
  left: 0;
  margin: 0 auto;
  right: 0;
  z-index: 1000
}


.scale-cut-img {
  transform: scale(0);
}

.user-avatar:hover::after {
  content: '\ec1d';
  font-family: iconfont;
  width: 8rem;
  height: 8rem;
  position: absolute;
  padding-top: 2rem;
  left: 0;
  top: 0;
  z-index: 200;
  border-radius: 50%;
  text-align: center;
  background: rgba(0, 0, 0, .7);
  color: #f1f1f1;
  cursor: pointer;
  font-size: 4rem;
}


.iconfontupload {
  width: 8rem;
  height: 8rem;
  position: absolute;
  padding-top: 2rem;
  left: 0;
  top: 0;
  border-radius: 50%;
  text-align: center;
  background: rgba(0, 0, 0, .7);
  color: #f1f1f1;
  cursor: pointer;
  font-size: 4rem;
}

.cut-img-mask:after {
  position: fixed;
  top: 0;
  content: "";
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: block;
  background: rgba(0, 0, 0, .5);
  transition-duration: 0.5s;
}

</style>
