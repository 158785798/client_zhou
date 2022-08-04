<template>
  <div style="font-size: 18px;background-color: #fff;padding: 20px;margin-bottom: 8px; border-radius: 6px"
       v-for="(item, index) in blogs" :key="item.id">
    <header style="display: flex; ">
      <img class="avatar" :src="item.userInfo.avatarUrl" alt="" style="width: 40px; height: 40px; border-radius: 50%"
           @click="to_tab(item.userInfo.id)">
      <div style="margin: 10px" class="avatar">
        <div style="margin-bottom: 5px; cursor: pointer" @click="to_tab(item.userInfo.id)">
          <strong>{{ item.userInfo.username }}</strong>
        </div>
        <div style="color: rgba(0,0,0,0.47); font-size: 12px">
          {{ item.pub_time }}
        </div>
      </div>
      <div style="text-align: right; flex: 1">
        <i v-if="item.is_self" class="iconfont iconfontshanchu1" @click="show_delDialog(item.id, index)"></i>
      </div>
    </header>
    <div class="content" style="font-size: 14px;margin-left: 50px" v-html="item.content">
    </div>
    <div style="margin: 4px 50px">
      <div style="display: inline-block; margin: 4px 2px" v-for="(each, index) in item.images"
           :data-id="each.name">
        <div @click="set_current_groups(item, index)"
             style="overflow: hidden; width: 96px; height: 96px; border-radius: 7px">
          <img v-if="each.direction==='h'" :src="each.middle" alt="" width="96" style="cursor: zoom-in">
          <img v-else :src="each.middle" alt="" height="96" style="cursor: zoom-in">
        </div>
      </div>
    </div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between; color: #808080;">
      <div v-if="!item.is_like" title="点赞" class="content-btn">
        <span class="btn-item" @click="like(item)">
          <i class="iconfont iconfontxin" style="font-size: 14px"></i>
          <span v-if="item.likes !==0" style="font-size: 13px;margin-left: 5px">{{ item.likes }}</span>
          <span v-else style="font-size: 13px; margin-left: 5px">赞</span>
          </span>
      </div>

      <div v-else title="点赞" class="content-btn">
        <span class="btn-item" @click="like(item)">
          <i class="iconfont iconfontaixin" style="font-size: 14px;color: red"></i>
          <span v-if="item.likes !==0" style="font-size: 13px;margin-left: 5px">{{ item.likes }}</span>
          <span v-else style="font-size: 13px; margin-left: 5px">赞</span>
          </span>
      </div>

      <div title="评论" class="content-btn">
        <span class="btn-item" @click="comment(item)" :class="{'is-open': item.commentShow}">
        <i class="iconfont iconfontico_pinglun"></i>
        <span style="font-size: 13px;margin-left: 5px">239</span>
          </span>
      </div>
      <div title="转发" class="content-btn">
        <span class="btn-item">
        <i class="iconfont iconfontzhuanfa1"></i>
        <span style="font-size: 13px;margin-left: 5px">405</span>
          </span>
      </div>
    </div>
    <Comment v-if="item.commentShow" :blog_id="item.id"></Comment>
  </div>
  <div v-show="curentImgGroups.length !== 0"
       style="display: flex;flex-direction:column;position: fixed;top:0; bottom: 0; left: 0; right: 0;z-index: 300">
    <div
        style="position: relative; flex: 1;justify-content:center;align-items: center;display: flex;overflow: hidden; ">
      <div :class="{'item-sw': curentImgGroups.length !== 0}" @click="curentImgGroups=[]"></div>
      <div style="z-index: 300;">
        <img v-if="cur_each.direction==='h'" :src="cur_each.large" alt="" style="max-height: 92vh">
        <img v-else :src="cur_each.large" alt="" style="max-width: 100vw">
      </div>
    </div>

    <div style="display: flex; justify-content: center; background-color: rgba(0,0,0,0.8);z-index: 300">
      <div v-for="(each, index) in curentImgGroups" @click="to_cur(index)"
           style="margin: 15px 3px; width: 55px; height: 55px; overflow: hidden;position: relative"
           :class="{'is-active': cur_index===index}">
        <div :class="{'bottom-item': cur_index!==index}">
          <img v-if="each.direction==='h'" :src="each.middle" alt="" width="55" style="cursor: pointer;">
          <img v-else :src="each.middle" alt="" height="55" style="cursor: pointer;">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed, reactive, toRefs} from "vue";
import {useRouter} from "vue-router";
import instance from "../api/request.js";
import {ElMessage} from "element-plus";
import Comment from './Comment.vue'

export default {
  name: "Cell",
  components:{
    Comment
  },
  props: {
    blogs: {
      type: Array,
    },
    showlikes: {
      type: Boolean,
      default() {
        return true;
      }
    },
    iscomment: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },
  emits: [
    'show_delDialog'
  ],
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const self = reactive({
      blogs: props.blogs,
      curentImgGroups: [],
      cur_each: {},
      cur_index: 0,
      pageRefresh: computed(() => store.state.pageRefresh),
      userInfo: computed(() => store.state.userInfo),
      iscomment: props.iscomment,
      loading: false,
      show_delDialog: (blog_id, blog_index) => {
        context.emit('show_delDialog', blog_id, blog_index)
      },
      to_cur: (index) => {
        self.cur_index = index
        self.cur_each = self.curentImgGroups[index]
      },
      set_current_groups: (item, index) => {
        self.curentImgGroups = item.images
        self.cur_each = item.images[index]
        self.cur_index = index
      },

      to_tab: (u_id) => {
          router.push({name: 'UserPage', params: {u_id: u_id}})
      },
      follow_in: async (value) => {
        const res = await instance.get('/follow_in', {params: {moment_id: value.id}})
        if (res.message === 'success') {
          store.commit('updateUserFollowedMoments', res.moments)
          store.commit('refreshAllMoments', value.user)
        }
      },
      like: async (item) => {
        if (item.is_like) {
          await instance.get('/dislike', {params: {blog_id: item.id}})
          item.is_like = false
          item.likes--
        } else {
          await instance.get('/like', {params: {blog_id: item.id}})
          item.is_like = true
          item.likes++
        }
      },
      comment:(item)=>{
        item.commentShow = !item.commentShow
        if (item.commentShow){

        }
      },
      show_comment_page: (value) => {
        if (!self.iscomment) {
          router.push({name: 'comment_page', params: {value: value}})
        }
      }
    })
    return {
      ...toRefs(self)
    }
  },


}
</script>

<style lang="scss" scoped>
$icon-hover-color: #f18e63;
.content-btn {
  flex: 1;
  display: flex;
  justify-content: center;
}

.btn-item:hover {
  cursor: pointer;
  color: $icon-hover-color;
}

.bottom-item:after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  cursor: pointer;
}



.bottom-item:hover:after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: transparent;
  position: absolute;
  cursor: pointer;
}

.is-active {
  border: 3px solid $icon-hover-color;
}
.is-open{
  color: $icon-hover-color
}

.item-sw::before {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 120;
  position: fixed;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.6);
}

</style>
