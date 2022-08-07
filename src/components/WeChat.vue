<template>
  <div style="margin: auto;width: 500px;">
    <div class="container" id="container">
      <div v-for="(item, index) in chatData" style="margin: 18px auto">
        <div v-if="item.id===clientId"
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


</template>

<script>
import {useStore} from "vuex";
import {computed, onMounted, onUnmounted, reactive, toRefs} from "vue";
import {ElMessage} from "element-plus";

export default {
  name: "WeChat",
  setup() {
    const store = useStore()
    const self = reactive({
          textDiv: null,
          lockReconnect: false,
          chatData: computed(() => store.state.chatInfo),
          clientId: computed(() => store.state.userInfo.id),
          enter_to_send: (event) => {
            if (!event.shiftKey && event.key === 'Enter') {
              event.preventDefault()
              self.sendMessage()
            }
          },
          initWS: (clientId) => {
            const url = process.env.NODE_ENV === 'development' ? `ws://127.0.0.1:8090/ws/${clientId}`
                : `ws://8.141.150.118:8096/ws/${clientId}`
            self.ws = new WebSocket(url)
            self.ws.onmessage = (event) => {
              console.log(11111,JSON.parse(event.data));
              store.commit('push_chatInfo', JSON.parse(event.data))
            }
            self.ws.onclose = () => {
              if (self.lockReconnect) {
                return
              }
              self.lockReconnect = true
              //没连接上会一直重连，设置延迟避免请求过多
              setTimeout(() => {
                self.initWS(clientId)
                self.lockReconnect = false
              }, 2000)
            }
          },
          sendMessage: () => {
            const content = self.textDiv.innerText
            if (content.replace(/\s+/g, '') === '') {
              ElMessage.warning('不能发送空消息！')
              self.textDiv.innerText = ''
              return false
            }
            const msg = {id: self.clientId, avatarUrl: store.state.userInfo.avatarUrl, content: content}
            self.ws.send(JSON.stringify(msg))
            store.commit('push_chatInfo', msg)
            self.textDiv.innerText = ''
            return false
          }
        }
    )
    self.initWS(self.clientId)
    onMounted(() => {
      const div = document.getElementById('container')
      div.scrollTop = div.scrollHeight;
    })
    onUnmounted(() => {
      delete self.ws
    })
    return {
      ...toRefs(self)
    }

  }
}
</script>

<style scoped>
.container {
  text-align: left;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.72);
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
