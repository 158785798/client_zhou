<template>
  <el-container v-loading="loading" style="display:flex; margin: 20px 0">
    <img src="../assets/img.png" alt="" style="width: 34px; height: 34px;border-radius: 50%">
    <div style="width: 100%; margin-left: 10px">
      <el-input style="margin-bottom: 10px"
                v-model="content"
                type="textarea"
                :autosize="{ minRows: 1, maxRows: 2 }"
                placeholder="发布你的评论"
      />
      <div style="display: flex; align-items: center; flex: 1;justify-content: space-between">
            <span :class="{'item-sw': isEmojiShow}" @click="isEmojiShow=!isEmojiShow">
              <i @click="" class="iconfont iconfontxiaolian item cursor-pointer ico ico-bg" style="font-size: 20px"></i>
            </span>
        <el-button :disabled="content===''" @click="comment">评论</el-button>
      </div>
      <div v-show="isEmojiShow"
           style="padding: 10px;box-shadow: 0 0 10px 5px rgba(12,12,12,0.33);width: 470px;height: 330px;min-width:6.25rem;
             overflow-y:auto;position: absolute;margin: 10px; background-color: #fff; border-radius: 10px;z-index: 100">
                <span @click="push_emoji(item)" style="display: inline-block" v-for="item in emojis" class="emoji cursor-pointer ico-bg"
                      :key="item.id">
                    <img :src="item.url" alt="" width="24">
                </span>
      </div>
    </div>
  </el-container>
  <div v-for="(item, index) in comments" style="font-size: 12px; margin-bottom: 20px ">
    <div style="display: flex;">
      <img @click="to_tab('UIndex', {u_id: item.userInfo.id})" :src="item.userInfo.avatarUrl" alt="" style="width: 34px; height: 34px; border-radius: 50%">

      <div style="margin-left: 10px; width: 100%">
        <div class="cursor-pointer" @click="to_tab('UIndex', {u_id: item.userInfo.id})" style="margin-bottom: 5px; color:#f18e63 ">{{ item.userInfo.username }}</div>
        <div style="color: rgba(0,0,0,0.53); display: flex; justify-content: space-between">
          <span>{{ item.pub_time }}</span>
          <div style="display: flex;font-size: 12px; text-align: center">
            <div v-if="item.is_self" title="删除" class="btn-item cursor-pointer ico ico-bg">
              <i @click="del_comment(item.id, index)" class="iconfont iconfontshanchu1"></i>
            </div>
            <div title="评论" class="btn-item cursor-pointer ico ico-bg" :class="{'is-open': item.commentShow}">
              <i class="iconfont iconfontico_pinglun" style="font-size: 12px"></i>
            </div>
            <div v-if="!item.is_like" title="点赞" class="btn-item cursor-pointer ico ico-bg" @click="like(item)" style="width: auto">
              <i class="iconfont iconfontxin" style="font-size: 12px"></i>
              <span v-if="item.likes !==0" style="margin-left: 5px">{{ item.likes }}</span>
              <span v-else>赞</span>
            </div>
            <div v-else title="点赞" class="btn-item cursor-pointer ico ico-bg" @click="like(item)" style="width: auto">
              <i class="iconfont iconfontaixin" style="color: red; font-size: 12px"></i>
              <span v-if="item.likes !==0" style="margin-left: 5px">{{ item.likes }}</span>
              <span v-else style="margin-left: 5px">赞</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style="margin-left: 44px; margin-top: 8px" v-html="item.content"></div>
  </div>
</template>

<script>
import {onMounted, reactive, toRefs} from "vue";
import instance from "../api/request.js";
import {ElMessage} from "element-plus";
import {useStore} from "vuex";
import router from "../router/index.js";
import {useRouter} from "vue-router";
import {to_tab} from "../utils/tools.js";

export default {
  name: "Comment",
  props: {
    blog_id: Number
  },
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const self = reactive({
      loading: true,
      content: '',
      emojis: [],
      comments: [],
      isEmojiShow: false,
      blog_id: props.blog_id,
      to_tab:to_tab,
      comment: async () => {
        const param = {blog_id: self.blog_id, content: self.content}
        const res = await instance.post('/comment', param)
        self.comments.unshift(res.data)
        self.content = ''
        self.isEmojiShow = false
        ElMessage.success('发布成功！')
      },
      del_comment: async (comment_id, index) => {
        self.comments.splice(index, 1)
        const res = await instance.delete('/del_comment', {params: {comment_id: comment_id}})
      },
      push_emoji: (item) => {
        self.content += item.display_name
      },
    })
    onMounted(async () => {
      const res1 = await instance.get('/get_emojis')
      self.emojis = res1.data
      const res = await instance.get('/get_comments', {params: {blog_id: self.blog_id}})
      self.comments = res.data
      self.loading = false
    })
    return {
      ...toRefs(self)
    }

  }
}
</script>

<style lang="scss" scoped>
@import "../global";

.btn-item {
  margin: 0 5px;
  width: 22px
}

.item {
  border-radius: 50%;
  padding: 8px;
  color: rgba(0, 0, 0, 0.58);
  font-weight: 600;
}

.item-sw::after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 80;
  position: absolute;
  cursor: default;
}

.emoji {
  border-radius: 50%;
  padding: 5px;
}


</style>
