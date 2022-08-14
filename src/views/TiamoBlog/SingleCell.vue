<template>
  <main>
    <div style="width: 100%">
      <transition-group appear tag="div" name="bound-in">
        <div v-for="blog in blogs" :key="blog.id">
          <Cell :blog="blog">
            <div style="">
              <span style="color: rgba(0,0,0,0.47);font-size: 12px; margin-right: 5px">{{ blog.permission_text }}</span>
              <i class="iconfont iconfontxialajiantouxiao cursor-pointer ico ico-bg" style="padding:5px; border-radius: 50%"
                 @click="set_blog_id(blog.id)" :class="{'up-dropdown-menu': blog.id===cur_blog_id}"></i>
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
          </Cell>
        </div>
      </transition-group>
    </div>
  </main>
</template>

<script>
import Cell from "../../components/Cell.vue";
import {onBeforeMount, onMounted, reactive, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {instance} from "../../api/request.js";
import {useMutations} from "../../utils/hooks.js";

export default {
  name: "CommentPage",
  components: {
    Cell,
  },
  setup(props, context) {
    const router = useRouter()
    const route = useRoute()
    const mutations = useMutations('session', ['show_global_tip', 'set_blog_id'])
    const self = reactive({
      cur_blog_id: -1,
      blogs: [],
      back_blog_id: (blog_id) => {
        if (self.cur_blog_id === blog_id) {
          self.cur_blog_id = -1
        } else {
          self.cur_blog_id = blog_id
        }
      },
    })

    onBeforeMount(async () => {
      const res = await instance.get('/get_blog', {params: {blog_id: route.query.blog_id}})
      self.blogs.push(res.data)
      context.emit('finish')
    })
    return {
      ...toRefs(self)
    }
  },

}
</script>

<style scoped>

</style>
