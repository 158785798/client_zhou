<template>
  <div>
    <el-backtop :bottom="100" class="backtop">
      <i class="iconfont iconfonttubiao02" style="font-size: 20px"></i>
    </el-backtop>
    <div :class="[{'cut-img-mask': showCutImg},{'scale-cut-img': !showCutImg}]" @click="openCutImg"></div>
    <CutImg :imgUrl="cutImgUrl" :class="['cropper-avatar', {'scale-cut-img': !showCutImg}]"
            @closeCutImg="showCutImg=false"></CutImg>
    <div class="u-del-blog" v-show="delDialog">
      <div style="margin-bottom: 20px; ">确定要删帖吗？</div>
      <el-button size="small" @click="u_confirm">确认</el-button>
      <el-button size="small" @click="delDialog=false">取消</el-button>
    </div>
    <div style="margin-top:24px;border-bottom: 1px solid hotpink">
      <div style="margin-left: 316px;padding: 0;">
        <div style="display: flex;font-size: 14px;">
          <span v-for="(each, index) in nvas" class="cursor-pointer"
                @click="to_tab(each.to, {tab: each.tab, index: index}, index)"
                style="width: 100px;height: 48px;margin:0 10px;display: flex;justify-content: center;align-items: center;"
          >
            <span class="nva">
              <span :class="['iconfont', each.icon]"></span>
            <span style="padding: 0 8px">{{ each.name }}</span>
            </span>

          </span>
        </div>

        <div ref="underline"
             style="width: 100px;border: 2px solid red;transform: translateX(10px);transition-duration: .3s"></div>
      </div>

    </div>
    <div style="display: flex;">
      <aside style="width: 296px; margin-right: 20px" :class="{'del-blog': delDialog}">
        <div style="position: relative;width: 296px;height: 280px">
          <el-upload ref="upload" :beforeUpload="beforeUpload" accept=".png, .jpg, .jpeg"
                     name="file" :show-file-list="false" :headers="{authorization: 'JWT ' + token}"
                     :http-request="customRequest">
            <div>
              <img :src="userInfo.avatarUrl" alt="" style="position: absolute;top:-30px;
            border-radius: 50%;width: 296px;height: 296px"
                   class="user-avatar">
            </div>
          </el-upload>
        </div>
        <div style="font-size: 20px;display: flex; justify-content: space-between;align-items: center">
          <span style="margin: 0 10px">{{ userInfo.username }}</span>
          <el-button style="margin: 0 10px;border-radius: 20px" @click="success_callback('关注成功')">关注</el-button>
        </div>
        <div class="bio-btn cursor-pointer" style="margin: 20px 10px;border-radius: 5px; padding: 5px
        ;background-color: #f6f8fa; text-align: center">
          <b style="color: #51565b">Add a bio</b>
        </div>
        <div>
        </div>
      </aside>
      <aside style="flex: 1; margin-top: 20px">
        <router-view :key="route.path + JSON.stringify(route.query)"></router-view>
        <div style="text-align: center; color: rgba(0,0,0,0.53)">
          <img src="../../assets/loading2.gif" alt="" style="border-radius: 20px" width="150" v-show="endLoading">
          <span v-show="!endLoading&&!loading">我是有底线的o(*￣▽￣*)o</span>
        </div>
      </aside>

    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed, onUnmounted, onMounted, reactive, toRefs} from "vue";
import {useRouter, useRoute} from "vue-router";
import instance from "../../api/request.js";
import CutImg from "../../components/CutImg.vue";
import {scroll} from "../../utils/tools.js";

export default {
  name: "UIndex",
  components: {
    CutImg,

  },

  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const getBase64 = (file, callback) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => callback(reader.result);
    }
    const self = reactive({
      upload: null,
      underline: null,
      showCutImg: false,
      delDialog: false,
      showUploadAvatarMask: false,
      isUploadAvatarMaskShow: false,
      loading: true,
      endLoading: false,
      nva_index: 0,
      userInfo: {},
      cutImgUrl: '',
      token: computed(() => window.localStorage.getItem('token_zhou')),
      nvas: [
        {name: 'Overview', icon: 'iconfontchongwutubiao18', to: 'Blog', tab: 'blog'},
        {name: '收藏', icon: 'iconfontshoucang1', to: 'Blog', tab: 'collection'},
        {name: '相册', icon: 'iconfontxiangce', to: 'Album', tab: 'album'},
      ],
      to_tab: (to, query, index) => {
        self.nva_index = index
        self.underline.style.marginLeft = index * 120 + 'px'
        query.u_id = self.userInfo.id
        router.push({name: to, query: query})
      },
      u_confirm: async () => {
        self.blogs = self.blogs.filter(item => item.id !== self.blog_id)
        self.delDialog = false
        const res = await instance.delete('/del_blog', {params: {blog_id: self.blog_id}})
        if (res.code === 200) {
          context.emit('success_callback', '删除成功')
        }
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
    })
    onMounted(async () => {
      self.nva_index = Number(route.query.index)
      const res = await instance.get('/get_userinfo', {params: {u_id: route.query.u_id}})
      self.userInfo = res.data
    })
    return {
      ...toRefs(self),
      route
    }
  },
}
</script>

<style lang="scss" scoped>
.bio-btn:hover {
  background-color: #f3f4f6 !important;
}

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

.u-del-blog {
  background-color: #e5b77a;
  padding: 20px;
  border-radius: 10px;
  z-index: 100;
  position: fixed;
  text-align: center;
  width: 200px;
  margin: auto;
  left: 0;
  right: 0;
  top: 300px;
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

.nva {
  padding: 5px 8px;
  border-radius: 5px;
}

.nva:hover {
  background-color: rgba(246, 179, 150, 0.5);

}

.active {
  border-bottom: 3px solid deeppink;
  color: deeppink;
  font-weight: 600;
  transform: scale(1.1);
  transition-duration: 0s;
}

</style>
