<template>
  <div style="font-size: 18px;background-color: #fff;padding: 20px;margin-bottom: 8px; border-radius: 6px;position: relative">
    <header style="display: flex; justify-content: space-between">
      <img class="avatar" :src="blog.userInfo.avatarUrl" alt="" style="width: 40px; height: 40px; border-radius: 50%"
           @click="to_tab(blog.userInfo.id)">
      <div style="margin: 10px; flex: 1">
        <div style="margin-bottom: 5px;">
          <strong class="avatar" @click="to_tab(blog.userInfo.id)">{{ blog.userInfo.username }}</strong>
        </div>
        <div style="color: rgba(0,0,0,0.47); font-size: 12px">
          {{ blog.pub_time }}
        </div>
      </div>
      <div style="">
        <i class="iconfont iconfontxialajiantouxiao" style="padding:6px; border-radius: 50%" @click="back_blog_id(blog.id)" :class="{'up-dropdown-menu': blog.id===cur_blog_id}"></i>
        <div v-show="blog.id===cur_blog_id" style="width:150px;overflow: hidden;
        background-color: #fff;z-index: 10;position: absolute;margin-top: 2px;right:20px;border-radius: 6px; box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.25);">
          <div style="cursor: pointer;font-size: .875rem" class="navItem_left" v-for="m in blog.dropdown_menus" @click="to_do(m, blog.id, index)">
            <div style="padding:10px 15px">
              <strong class="iconfont hover" :class="m.icon" style="margin-right: 10px;font-size: 14px;background-color: rgba(0,0,0,0.1); padding: 8px; border-radius: 50%"></strong>
              <span>{{ m.name }}</span>
            </div>
          </div>
        </div>

      </div>
    </header>
    <div class="content" style="font-size: 14px;margin-left: 50px;line-height: 1.5" v-html="blog.content">
    </div>
    <div style="margin: 4px 50px">
      <div style="display: inline-block; margin: 4px 2px" v-for="(each, index) in blog.images"
           :data-id="each.name">
        <div @click="set_current_groups(blog, index)"
             style="overflow: hidden; width: 96px; height: 96px; border-radius: 7px">
          <img v-if="each.direction==='h'" :src="each.middle" alt="" width="96" style="cursor: zoom-in">
          <img v-else :src="each.middle" alt="" height="96" style="cursor: zoom-in">
        </div>
      </div>
    </div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between; color: #808080;">
      <div v-if="!blog.is_like" title="点赞" class="content-btn">
        <span class="btn-blog" @click="like(blog)">
          <i class="iconfont iconfontxin" style="font-size: 14px"></i>
          <span v-if="blog.likes !==0" style="font-size: 13px;margin-left: 5px">{{ blog.likes }}</span>
          <span v-else style="font-size: 13px; margin-left: 5px">赞</span>
          </span>
      </div>

      <div v-else title="点赞" class="content-btn">
        <span class="btn-blog" @click="like(blog)">
          <i class="iconfont iconfontaixin" style="font-size: 14px;color: red"></i>
          <span v-if="blog.likes !==0" style="font-size: 13px;margin-left: 5px">{{ blog.likes }}</span>
          <span v-else style="font-size: 13px; margin-left: 5px">赞</span>
          </span>
      </div>

      <div title="评论" class="content-btn">
        <span class="btn-blog" @click="comment(blog)" :class="{'is-open': blog.commentShow}">
        <i class="iconfont iconfontico_pinglun"></i>
        <span v-if="blog.comments !==0" style="font-size: 13px;margin-left: 5px">{{ blog.comments }}</span>
          <span v-else style="font-size: 13px; margin-left: 5px">评论</span>
        </span>

      </div>
      <div title="转发" class="content-btn">
        <span class="btn-blog">
        <i class="iconfont iconfontzhuanfa1"></i>
        <span style="font-size: 13px;margin-left: 5px">405</span>
          </span>
      </div>
    </div>
    <Comment v-if="blog.commentShow" :blog_id="blog.id"></Comment>
  </div>
  <teleport to="body">
    <div v-show="curentImgGroups.length !== 0"
         style="display: flex;flex-direction:column;position: fixed;top:20px; bottom: 0; left: 0; right: 0;z-index: 300">
      <div
          style="position: relative; flex: 1;justify-content:center;align-items: center;display: flex;overflow: hidden; ">
        <div :class="{'blog-sw': curentImgGroups.length !== 0}" @click="curentImgGroups=[]"></div>
        <div style="z-index: 300;">
          <img v-if="cur_each.direction==='h'" :src="cur_each.large" alt="" style="max-height: 92vh">
          <img v-else :src="cur_each.large" alt="" style="max-width: 100vw">
        </div>
      </div>

      <div style="display: flex; justify-content: center; background-color: rgba(0,0,0,0.8);z-index: 300">
        <div v-for="(each, index) in curentImgGroups" @click="to_cur(index)"
             style="margin: 15px 3px; width: 55px; height: 55px; overflow: hidden;position: relative"
             :class="{'is-active': cur_index===index}">
          <div :class="{'bottom-blog': cur_index!==index}">
            <img v-if="each.direction==='h'" :src="each.middle" alt="" width="55" style="cursor: pointer;">
            <img v-else :src="each.middle" alt="" height="55" style="cursor: pointer;">
          </div>
        </div>
      </div>
    </div>
  </teleport>

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
  components: {
    Comment
  },
  props: {
    blog: {
      type: Object,
    },
    index: {
      type: Number
    },
    cur_blog_id: {
      type: Number
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
    'show_delDialog',
    'back_blog_id'
  ],
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const self = reactive({
      curentImgGroups: [],
      cur_each: {},
      cur_index: 0,
      pageRefresh: computed(() => store.state.pageRefresh),
      userInfo: computed(() => store.state.userInfo),
      iscomment: props.iscomment,
      loading: false,
      to_do:async (m, blog_id, blog_index)=>{
        if (m.id===1){

        }else if(m.id===2){

        }else if(m.id===3){

        }else if(m.id===4){

        }else if(m.id===5){
          self.show_delDialog(blog_id, blog_index)
        }else if(m.id===6){

        }
        self.back_blog_id(blog_id)
      },
      back_blog_id:(blog_id)=>{
        context.emit('back_blog_id', blog_id)
      },
      show_delDialog: (blog_id, blog_index) => {
        context.emit('show_delDialog', blog_id, blog_index)
      },
      to_cur: (index) => {
        self.cur_index = index
        self.cur_each = self.curentImgGroups[index]
      },
      set_current_groups: (blog, index) => {
        self.curentImgGroups = blog.images
        self.cur_each = blog.images[index]
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
      like: async (blog) => {
        if (blog.is_like) {
          await instance.get('/dislike', {params: {blog_id: blog.id}})
          blog.is_like = false
          blog.likes--
        } else {
          await instance.get('/like', {params: {blog_id: blog.id}})
          blog.is_like = true
          blog.likes++
        }
      },
      comment: (blog) => {
        blog.commentShow = !blog.commentShow
        if (blog.commentShow) {

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
@import "../global";

.navItem_left:hover {
  background-color: #f2f2f2;
}

.content-btn {
  flex: 1;
  display: flex;
  justify-content: center;
}

.btn-blog:hover {
  cursor: pointer;
  color: $icon-hover-color;
}

.bottom-blog:after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  cursor: pointer;
}


.bottom-blog:hover:after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: transparent;
  position: absolute;
  cursor: pointer;
}
.up-dropdown-menu:after{
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  position: absolute;
  cursor: pointer;
}

.hover{
  color: #707070
}
.hover:hover{
  color: #707070
}
.is-active {
  border: 3px solid $icon-hover-color;
}

.is-open {
  color: $icon-hover-color
}

.blog-sw::before {
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
