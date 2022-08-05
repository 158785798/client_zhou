<template>
  <main :class="['main', {trans: trans}]" v-show="pub">
    <div style="margin-bottom: 40px;display: flex; justify-content: space-between">
      <strong style="font-size: 16px">快捷发布</strong>
      <i class="iconfont iconfontchahao1" @click="showPub"></i>
    </div>
    <el-input
        v-model="content"
        type="textarea"
        :autosize="{ minRows: 2, maxRows: 4 }"
        placeholder="对你的猫猫说些什么？"
    />
    <div ref="dragImg" style="margin-top: 10px">
      <div style="display: inline-block; margin: 4px 2px; cursor: move; position: relative" v-for="item in blogImgs"
           :data-id="item.name">
        <div class="image-picbed" style="overflow: hidden; width: 96px; height: 96px; border-radius: 7px">
          <img v-if="item.direction==='h'" :src="item.img_uri" alt="" width="96">
          <img v-else :src="item.img_uri" alt="" height="96">
        </div>
        <strong @click="del_img(item)">
          <i class="iconfont iconfontchahao1 del-img"></i>
        </strong>
      </div>
      <el-upload v-if="blogImgs.length !== 0"
                 :show-file-list="false"
                 :headers="headers"
                 accept="image/*"
                 :on-success="upload_success"
                 :action="action"
                 style="display: inline-block;margin: 4px 2px;border: 2px solid rgba(0,0,0,0.21); border-radius: 7px;vertical-align: top;">
        <div
            style="display: flex;  color:rgba(0,0,0,0.21); height: 92px;width: 92px;justify-content: center; align-items: center;">
          <i class="iconfont iconfontjiahao"></i>
        </div>
      </el-upload>
    </div>
    <div style="display:flex;margin-top: 10px;">
      <div style="display: flex; align-items: center; flex: 1;">
            <span :class="{'item-sw': isEmojiShow}" @click="isEmojiShow=!isEmojiShow">
              <i @click="" class="iconfont iconfontxiaolian item" style="font-size: 20px"></i>
            </span>
        <span>
          <el-upload
              :show-file-list="false"
              :headers="headers"
              accept="image/*"
              :on-success="upload_success"
              :action="action">
          <i class="iconfont iconfontimage item" style="font-size: 20px; display: inline-block"></i>
      </el-upload>

            </span>
      </div>
      <el-button v-loading="loading" @click="publish_blog" :disabled="content===''"
                 style="border-radius: 20px; background-color: #f18e63;color: white"><strong>发送</strong>
      </el-button>
    </div>
    <div v-show="isEmojiShow"
         style="padding: 10px;box-shadow: 0 0 10px 5px rgba(12,12,12,0.33);width: 470px;height: 330px;min-width:6.25rem;
             overflow-y:auto;position: absolute;margin: 10px; background-color: #fff; border-radius: 10px">
                <span @click="push_emoji(item)" style="display: inline-block" v-for="item in emojis" class="emoji"
                      :key="item.id">
                    <img :src="item.url" alt="" width="24">
                </span>
    </div>

  </main>
</template>

<script>
import {computed, onMounted, reactive, toRefs} from "vue";
import {useStore} from "vuex";
import instance from "../api/request.js";
import {ElMessage} from "element-plus";
import {Sortable} from "sortablejs";
import {useRoute, useRouter} from "vue-router";

export default {
  name: "Pub",
  emits: ['unshift_blog'],
  setup(props, context) {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const self = reactive({
      loading: false,
      pub: computed(() => {
        return store.state.pub
      }),
      trans: computed(() => {
        return store.state.trans
      }),
      blogs: computed(() => {
        return store.state.blogs
      }),
      content: '',
      dragImg: null,
      isEmojiShow: false,
      action: 'http://8.141.150.118:8096/api/upload_img',
      emojis: [],
      headers: {Authorization: window.localStorage.getItem('token_zhou')},
      blogImgs: [],
      showPub: () => {
        if (self.pub) {
          store.commit('set_pub', {name: 'trans', value: !self.pub})
          setTimeout(() => {
            store.commit('set_pub', {name: 'pub', value: !self.pub})
          }, 100)
        } else {
          store.commit('set_pub', {name: 'pub', value: !self.pub})

          setTimeout(() => {
            store.commit('set_pub', {name: 'trans', value: !self.pub})
          }, 10)
        }
      },
      push_emoji: (item) => {
        self.content += item.display_name
      },
      publish_blog: async () => {
        self.loading = true
        await router.push('TiamoBlog')
        const res = await instance.post('/publish_blog', {content: self.content, images: self.blogImgs})
        context.emit('unshift_blog', res.data)
        store.commit('set_pub', {name: 'pub', value: false})
        self.loading = false
        self.blogImgs = []
        self.content = ''
        ElMessage.success('发布成功！')

      },
      upload_success: (res) => {
        self.blogImgs.push(res)
      },
      del_img: (item) => {
        self.blogImgs.splice(self.blogImgs.indexOf(item), 1)
      }
    })
    onMounted(async () => {
      const sortable = Sortable.create(self.dragImg, {
            animation: 150,
            onEnd: () => {
              let arr = sortable.toArray()
              arr = arr.slice(0, arr.length - 2)
            }
          }
      )
      const res1 = await instance.get('/get_emojis')
      self.emojis = res1.data
    })
    return {
      ...toRefs(self)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../global";

.main {
  transition-duration: 0.2s;
  z-index: 100;
  position: fixed;
  width: 640px;
  padding: 20px;
  border-radius: 15px;
  background-color: white;
  margin: auto;
  left: 0;
  right: 0;
  top: 300px
}

.item {
  cursor: pointer;
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
  z-index: 100;
  position: absolute;
  cursor: default;
}

.item:hover {
  background-color: $icon-hover-bg-color;
  color: $icon-hover-color;
}

.del-img {
  transform: scale(0.6);
  color: white;
  padding: 5px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  right: 0;
  top: 0;
  cursor: pointer;
  z-index: 200
}

.del-img:hover {
  color: $icon-hover-color !important;
  background-color: transparent !important;
}

.emoji {
  cursor: pointer;
  border-radius: 50%;
  padding: 5px;
}

.emoji:hover {
  background-color: $icon-hover-bg-color;
}

.iconfontchahao1:hover {
  color: $icon-hover-color;
}

.trans {
  transform: translateY(-30%);
}

.image-picbed:hover::before {
  content: "";
  display: block;
  height: 96px;
  width: 96px;
  background-color: rgba(0, 0, 0, 0.18);
  position: absolute;
  border-radius: 7px;
  z-index: 100;
}


</style>
