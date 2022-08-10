<template>
  <div v-loading="msgBoxLoading" style="background-color: white;z-index:1000;top:180px;width: 400px;height: 500px;
  position: absolute; left: 0; right: 0; margin: auto; border-radius: 10px; overflow: hidden">
    <i @click="show_msg_box" class="iconfont iconfontchahao1"
       style="position: absolute; right: -30px;color: #fff;font-size: 20px "></i>
    <transition name="u-cell">
      <div style="overflow: auto;width: 100%;height: 100%;padding: 20px;">
        <div v-show="msgBox.length!==0" v-for="each in msgBox" class="cursor-pointer"
             :style="{color:(each.clicked? 'rgba(0,0,0,0.5)': '#cf00ee')}"
             style="display: flex;margin-bottom: 1.5rem; align-items: center">
          <img :src="each.userInfo.avatarUrl" alt="" @click="to_tab('UIndex', {u_id: each.userInfo.id})"
               style="border-radius: 50%;width: 40px; height: 40px; margin-right: 10px">
          <div style="flex: 1;display: flex; align-items: center; justify-content: space-between; font-size: 13px;"
               @click="to_tab('CommentPage', {blog_id: each.blog_id,msg_id: each.id, clicked: each.clicked, flag: each.flag})">
            <div>
              <div style="overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp:1;
      -webkit-box-orient:vertical;display:-webkit-box;width: 250px;line-height: 1.5; font-size: 13px">
                <span style="margin-right: 5px">{{ each.userInfo.username }}</span>
                <span v-if="each.flag==='comment'">
              <strong>评论</strong> 了我：<span v-html="each.comment_content"></span>
            </span>
                <span v-else>
              <i style="color: red;" class="iconfont iconfontaixin"></i>赞了我的帖子
            </span>
              </div>
              <div>{{ each.pub_time }}</div>
            </div>
            <span v-if="each.img" style="overflow: hidden; width: 56px; height: 56px; border-radius: 7px">
            <img v-if="each.direction==='h'" :src="each.middle" alt="" width="56">
            <img v-else :src="each.middle" alt="" height="56">
          </span>
            <span v-html="each.blog_content" style="overflow: hidden;text-overflow: ellipsis;-webkit-line-clamp:2;
      -webkit-box-orient:vertical;display:-webkit-box; font-size: 12px;width: 56px;
      height: 40px;padding: 7px; border-radius: 7px">
        </span>
          </div>
        </div>
        <div v-show="msgBox.length===0 && msgBoxLoading" style="text-align: center; margin-top: 100px">
          空空如也ε=ε=ε=(~￣▽￣)~
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import {reactive, toRefs} from "vue";
import instance from "../api/request.js";
import {useRouter} from "vue-router";

export default {
  name: "MsgBox",
  props: ['msgBox', 'msgBoxLoading'],
  emits: ['show_msg_box'],
  setup(props, context) {
    const router = useRouter()
    const self = reactive({
      loading: true,
      show_msg_box: async () => {
        context.emit('show_msg_box')
      },
      to_tab: async (to, query) => {
        context.emit('show_msg_box', 'sub')
        if (!query.clicked) {
          await instance.get('/click_msg', {params: {msg_id: query.msg_id, flag: query.flag}})
        }
        await router.push({name: to, query: query})
      },
    })
    return {
      ...toRefs(self)
    }
  }
}
</script>

<style scoped>

</style>
