<template>
  <div>
    <el-backtop :bottom="100" class="backtop">
      <i class="iconfont iconfonttubiao02" style="font-size: 20px"></i>
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
            <img :src="userInfo.avatarUrl" alt="" style="border-radius: 50%;width: 6rem;height: 6rem"
                 class="user-avatar">
          </div>
        </el-upload>
        <div style="flex: 1;margin-left: 20px">
          <div style="margin: 5px auto">
            <strong>{{ userInfo.username }}</strong>
          </div>
          <span>粉丝 3735.8万</span>

        </div>
        <div>
          <el-button style="border-radius: 20px" @click="success_callback('关注成功')">关注</el-button>
        </div>
      </div>
      <div style="font-size: 12px; color: rgba(0,0,0,0.49);margin: 5px">
        IP归属地： 湖南
      </div>
    </header>

    <UserCell @show_delDialog="show_delDialog" @success_callback="success_callback" @back_blog_id="back_blog_id" :cur_blog_id="cur_blog_id" :blog="blog"
          :index="index" v-for="(blog, index) in blogs"></UserCell>
    <div style="text-align: center; color: rgba(0,0,0,0.53)">
      <!--        <span v-loading="true"  element-loading-background="transparent" v-if="endLoading"></span>-->
      <img src="../assets/loading2.gif" alt="" style="border-radius: 20px" width="150" v-show="endLoading">
      <span v-show="!endLoading&&!loading">我是有底线的o(*￣▽￣*)o</span>
    </div>
  </div>
</template>

<script>
import CutImg from "../components/CutImg.vue";
import {useStore} from "vuex";
import {computed, onUnmounted, onMounted, reactive, toRefs} from "vue";
import {useRouter, useRoute} from "vue-router";
import instance from "../api/request.js";
import {ElMessage} from "element-plus";
import UserCell from "../components/UserCell.vue";

export default {
  name: "UserPage",
  components: {
    CutImg,
    UserCell,
  },
  emits:[
    'success_callback'
  ],
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
      blog_id: null,
      blog_index: null,
      cur_blog_id: -1,
      pageNum: 1,
      pageSize: 7,
      serverPageSize: 7,
      loading: true,
      endLoading: false,
      success_callback:(message)=>{
        context.emit('success_callback', message)
      },
      back_blog_id: (blog_id) => {
        if (self.cur_blog_id === blog_id) {
          self.cur_blog_id = -1
        } else {
          self.cur_blog_id = blog_id
        }

      },
      noMore: computed(() => {
        return self.pageSize > self.serverPageSize || self.endLoading
      }),
      underlineNavIndex: 0,
      dropdownMenus: [
      {name: '置顶', icon: 'iconfont iconfonticon_zhiding'},
      {name: '广场可见', icon: 'iconfont iconfontpengyouquan'},
      {name: '粉丝可见', icon: 'iconfont iconfontziyuan'},
      {name: '仅自己可见', icon: 'iconfont iconfontyonghu'},
      {name: '删帖', icon: 'iconfont iconfontshanchu2', fu: (blog_id, blog_index)=>{
          self.show_delDialog(blog_id, blog_index)
          self.back_blog_id(blog_id)
        }},
    ],
      u_confirm: async () => {
        self.blogs.splice(self.blog_index, 1)
        self.delDialog = false
        ElMessage.success('删除成功!')
        const res = await instance.delete('/del_blog', {params: {blog_id: self.blog_id}})

      },
      u_cancel: () => {
        self.delDialog = false
      },
      show_delDialog: (blog_id, blog_index) => {
        self.blog_id = blog_id
        self.blog_index = blog_index
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
        const res2 = await instance.get('/get_blogs', {
          params: {
            flag: 'user',
            u_id: route.params.u_id,
            pageNum: self.pageNum,
            pageSize: self.pageSize
          }
        })
        self.serverPageSize = res2.data.length
        self.blogs = self.blogs.concat(res2.data)
        self.endLoading = false
      },
      scroll() {
        window.onscroll = () => {
          // 整个页面的高度
          const scrollHeight = document.body.scrollHeight
          // 当前可视区的顶部到页面顶部的高度，||是做兼容处理的
          const scrollTop = document.body.scrollTop || document.documentElement.scrollTop
          // 当前可视区的高度
          const clientHeight = document.documentElement.clientHeight
          // 可视区底部到页面底部的高度，即滚动条与底部的距离
          const instance = scrollHeight - scrollTop - clientHeight
          // 当滚动条与底部的距离小于100时就触发加载数据
          if (instance < 100) {
            if (self.noMore) return
            self.endLoading = true
            setTimeout(() => {
              self.pageNum++
              self.get_blogs()
            }, 1000)
          }
        }
      }
    })
    onMounted(async () => {
      window.addEventListener('scroll', self.scroll, false)
      const res = await instance.get('/get_userinfo', {params: {u_id: route.params.u_id}})
      self.userInfo = res.data
      await self.get_blogs()
      self.loading = false
    })
    onUnmounted(() => {
      window.removeEventListener('scroll', self.scroll, false)
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
