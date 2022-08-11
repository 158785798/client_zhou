<template>
  <div style="display:flex;justify-content: center; align-items: center; margin-top: 100px;padding: 30px;">
    <div style="margin-right: 30px">
      <div v-for="user in users" style="border-radius:6px;padding:3px 5px;display: flex;justify-content: left;background-color: #fff;">
        <img class="u-avatar" :src="user.avatarUrl" alt="">
        <span class="u-content">
            {{ user.username }}
          </span>
      </div>

    </div>
    <div style="width: 500px;background-color: rgba(255, 255, 255, 0.72);border-radius: 5px;">
      <div class="container" id="container">
        <div v-for="(item, index) in chatData" style="margin: 18px auto">
          <div v-if="item.id===userInfo.id"
               style="display: flex;justify-content: right;">

          <span class="u-content" style="background-color: #09e509;">
            {{ item.content }}
          </span>
            <span class="content-caret-right"></span>
            <img class="u-avatar" :src="item.avatarUrl" alt="">

          </div>
          <div v-else style="display: flex;justify-content: left;">
            <img class="u-avatar" :src="item.avatarUrl" alt="">
            <span class="content-caret-left"></span>
            <span class="u-content" style="background-color: #fff;">
            {{ item.content }}
          </span>
          </div>
        </div>

      </div>
      <div class="textDiv" ref="textDiv" contenteditable="true" @keydown="enter_to_send"
           aria-placeholder="Enter发送  Shift+Enter换行"></div>
      <el-button @click="sendMessage">send</el-button>
    </div>
  </div>


</template>

<script>
import {useStore} from "vuex";
import {computed, onMounted, getCurrentInstance, reactive, toRefs} from "vue";
import {ElMessage} from "element-plus";

export default {
  name: "WeChat",
  setup() {
    const socket = getCurrentInstance().proxy.$socket
    socket.on('broadcast', (data) => {
      store.commit('local/push_chatInfo', JSON.parse(data))
    })
    const store = useStore()
    const self = reactive({
      users:[
          {username: '张三', avatarUrl: 'http://8.141.150.118/static/img.png'},
          {username: '张三', avatarUrl: 'http://8.141.150.118/static/img.png'},
          {username: '张三', avatarUrl: 'http://8.141.150.118/static/img.png'},
          {username: '张三', avatarUrl: 'http://8.141.150.118/static/img.png'},
      ],
          textDiv: null,
          lockReconnect: false,
          chatData: computed(() => store.state.local.chatInfo),
          userInfo: computed(() => store.state.local.userInfo),
          enter_to_send: (event) => {
            if (!event.shiftKey && event.key === 'Enter') {
              event.preventDefault()
              self.sendMessage()
            }
          },
          sendMessage: () => {
            const content = self.textDiv.innerText
            if (content.replace(/\s+/g, '') === '') {
              ElMessage.warning('不能发送空消息！')
              self.textDiv.innerText = ''
              return false
            }
            const msg = {
              id: self.userInfo.id,
              username: self.userInfo.username,
              avatarUrl: self.userInfo.avatarUrl,
              content: content
            }
            socket.emit('broadcast', JSON.stringify(msg))
            store.commit('local/push_chatInfo', msg)
            self.textDiv.innerText = ''
            return false
          }
        }
    )
    onMounted(() => {
      const div = document.getElementById('container')
      div.scrollTop = div.scrollHeight;
    })
    // onUnmounted(() => {
    //   delete self.ws
    // })
    return {
      ...toRefs(self)
    }

  }
}
</script>

<style scoped>
.container {
  text-align: left;
  height: 300px;
  color: rgba(0, 0, 0);
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px
}

.textDiv {
  min-height: 24px;
  max-height: 100px;
  width: 500px;
  text-align: left;
  padding: 5px;
  background-color: #FFF;
  border-radius: 5px 5px;
  overflow-y: auto;
  font-size: 0.9em;
  outline: none;
  cursor: text;
}


.content-caret-right {
  display: inline-block;
  width: 0;
  height: 0;
  vertical-align: middle;
  content: "";
  border: 4px solid transparent;
  border-left-color: #09e509;
  border-right: none;
  margin-right: 5px;
  margin-top: 8px;
}

.content-caret-left {
  display: inline-block;
  width: 0;
  height: 0;
  vertical-align: middle;
  content: "";
  border: 4px solid transparent;
  border-right-color: #ffffff;
  border-left: none;
  margin-left: 5px;
  margin-top: 8px;
}

.textDiv:empty::before {
  color: #b2b1b1;
  content: attr(aria-placeholder);
}

.u-content {
  word-break: break-all;
  white-space: pre-wrap;
  max-width: 400px;
  padding: 2px 10px 4px;
  border-radius: 6px;
}

.u-avatar {
  width: 30px;
  height: 30px;
  border-radius: 6px
}

.input_width {
  width: 300px;
}

</style>
