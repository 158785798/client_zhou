<template>
  <div
      style="font-size: 18px;background-color: #fff;padding: 20px;margin-bottom: 8px; border-radius: 6px;position: relative">
    <header style="display: flex; justify-content: space-between">
      <img :src="blog.userInfo.avatarUrl" alt="" style="width: 40px; height: 40px; border-radius: 50%"
           @click="to_tab('UIndex', {u_id: blog.userInfo.id})">
      <div style="margin: 10px; flex: 1">
        <div style="margin-bottom: 5px;">
          <strong class="cursor-pointer" @click="to_tab('UIndex', {u_id: blog.userInfo.id})">{{
              blog.userInfo.username
            }}</strong>
        </div>
        <div style="color: rgba(0,0,0,0.47); font-size: 12px">
          {{ blog.create_time }}
        </div>
      </div>
      <div style="">
        <span style="color: rgba(0,0,0,0.47);font-size: 12px; margin-right: 5px">{{ blog.permission_text }}</span>
        <i class="iconfont iconfontxialajiantouxiao cursor-pointer ico ico-bg" style="padding:5px; border-radius: 50%"
           :class="{'up-dropdown-menu': blog.id===cur_blog_id}"></i>
        <div v-show="blog.id===cur_blog_id" style="width:150px;overflow: hidden;
        background-color: #fff;z-index: 10;position: absolute;margin-top: 2px;right:20px;border-radius: 6px; box-shadow: 0 0 10px 5px rgba(0, 0, 0, 0.25);">
          <div style="font-size: .875rem" class="navItem_left cursor-pointer" v-for="menu in blog.dropdown_menus"
               @click="to_do(menu, blog.id)">
            <div style="padding:10px 15px">
              <strong class="iconfont hover" :class="menu.icon"
                      style="margin-right: 10px;font-size: 14px;background-color: rgba(0,0,0,0.1); padding: 8px; border-radius: 50%"></strong>
              <span>{{ menu.name }}</span>
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
        <div @click="show_image_preview({images: blog.images, index: index})"
             style="overflow: hidden; width: 96px; height: 96px; border-radius: 7px">
          <img v-if="each.direction==='h'" :src="each.small? each.small: each.middle" alt="" width="96" style="cursor: zoom-in">
          <img v-else :src="each.small? each.small: each.middle" alt="" height="96" style="cursor: zoom-in">
        </div>
      </div>
    </div>
    <div style="margin-top: 15px; display: flex; justify-content: space-between; color: #808080;">
      <div v-if="!blog.is_like" title="点赞" class="content-btn">
        <span class="btn-blog cursor-pointer ico" @click="like(blog)">
          <i class="iconfont iconfontxin" style="font-size: 14px"></i>
          <span v-if="blog.likes !==0" style="font-size: 13px;margin-left: 5px">{{ blog.likes }}</span>
          <span v-else style="font-size: 13px; margin-left: 5px">赞</span>
          </span>
      </div>

      <div v-else title="点赞" class="content-btn">
        <span class="btn-blog cursor-pointer ico" @click="like(blog)">
          <i class="iconfont iconfontaixin" style="font-size: 14px;color: red"></i>
          <span v-if="blog.likes !==0" style="font-size: 13px;margin-left: 5px">{{ blog.likes }}</span>
          <span v-else style="font-size: 13px; margin-left: 5px">赞</span>
          </span>
      </div>

      <div title="评论" class="content-btn">
        <span ref="comment_btn" class="btn-blog cursor-pointer ico" @click="comment(blog)"
              :class="{'is-open': blog.commentShow}">
        <i class="iconfont iconfontico_pinglun"></i>
        <span v-if="blog.comments !==0" style="font-size: 13px;margin-left: 5px">{{ blog.comments }}</span>
          <span v-else style="font-size: 13px; margin-left: 5px">评论</span>
        </span>

      </div>
      <div title="转发" class="content-btn">
        <span class="btn-blog cursor-pointer ico">
        <i class="iconfont iconfontzhuanfa1"></i>
        <span style="font-size: 13px;margin-left: 5px">405</span>
          </span>
      </div>
    </div>
    <Comment v-if="blog.commentShow" @succ_comment="blog.comments++" :blog_id="blog.id"></Comment>
  </div>
</template>

<script>
import {useStore} from "vuex";
import {computed, onMounted, onUnmounted, reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import instance from "../api/request.js";
import Comment from './Comment.vue'
import {to_tab} from "../utils/tools.js";
import {useMutations} from "../utils/hooks.js";

export default {
  name: "UserCell",
  components: {
    Comment
  },
  props: {
    blog: {
      type: Object,
    },
    cur_blog_id: {
      type: Number,
      default() {
        return -1
      }
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
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['to_cur', 'show_image_preview',
      'show_global_tip', 'show_dialog'])
    const self = reactive({
      comment_btn: null,
      cur_blog_id: computed(() => store.state.session.cur_blog_id),
      pageRefresh: computed(() => store.state.pageRefresh),
      userInfo: computed(() => store.state.local.userInfo),
      iscomment: props.iscomment,
      loading: false,
      to_do: async (menu, blog_id) => {
        mutations.set_blog_id(blog_id)
        if (m.id === 1) {
          mutations.show_global_tip('置顶成功')
        } else if (m.id === 2) {
          mutations.show_global_tip('修改成功')
        } else if (m.id === 3) {
          mutations.show_global_tip('修改成功')
        } else if (m.id === 4) {
          mutations.show_global_tip('修改成功')
        } else if (m.id === 5) {
          mutations.show_dialog({obj_id: blog_id, text: '确定删贴吗？'})
        } else if (m.id === 6) {
          mutations.show_global_tip('收藏成功')
        } else if (m.id === 7) {
          mutations.show_global_tip('举报成功')
        }
      },
      to_tab: to_tab,
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
          router.push({name: 'comment_page', query: {value: value}})
        }
      }
    })
    onMounted(() => {
      if (route.query.flag === 'comment') {
        self.comment_btn.click()
      }
    })
    return {
      ...toRefs(self),
      ...mutations
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

.up-dropdown-menu:after {
  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  position: absolute;
  cursor: pointer;
}

.hover {
  color: #707070
}

.hover:hover {
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
