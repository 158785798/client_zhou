<template>
  <div
      style="text-align: right; padding:30px 0; font-size: 18px;
      display: flex; justify-content: space-between; align-items: center">
    <div>
      <img src="../assets/logo.png" alt="" style="border-radius: 50%; width: 40px"
           @click="toTab('Home')">
    </div>
    <div>
      <span style="margin-right: 5px; color: #413c37">Password is ready?</span>
      <a href="javascript:" @click="toTab('Login')">
        Sign in →
      </a>
    </div>
  </div>
  <div v-if="returnToLogin">
    <div style="margin: 30px auto">Password changed successfully</div>
    <el-button @click="toTab('Login')">Return to login</el-button>
  </div>
  <div v-else>
    <summary style="font-size: 24px">Reset your password</summary>

    <main class="container">
      <div
          style="display: flex;border-radius: 10px;justify-content: center;padding: 20px;box-shadow: 0 0 20px 5px rgba(0,0,0,0.33)">
        <el-form
            v-loading="loading"
            label-position="top"
            :model="model"
            style="color:#201e1e; "
        >
          <div v-for="(item , index) in menus" style="text-align: left;" :key="index">
            <div v-show="item.id < num" style="color: green">
              <summary>{{ item.title }}</summary>
              <el-form-item prop="username">
                <div style="display: flex;margin-top: 10px; align-items: center; height: 25px; width: 420px">
                <span style="margin-right: 10px">
                <i v-if="item.status==='1'" class="iconfont iconfontjiantou_xiangyou"></i>
                <i v-else-if="item.status==='2'" class="iconfont iconfontduihao"></i>
                <i v-else-if="item.status==='3'" class="iconfont iconfontguanbi1"></i>
              </span>
                  <el-input :type="item.type" :show-password="item.type==='password'"
                            clearable @click="currentIndex=index+1" @focusout="checkModel(item)"
                            @focusin="item.status='1'"
                            v-model="model[item.modelItem]"/>
                  <el-button class="cursor-pointer" :class="{valid: item.btnValid}" @click="extendMenu(item,index)"
                             v-if="item.id===currentIndex"
                             style="background-color: transparent !important;color: rgba(128,128,128,0.57);font-size:12px;padding: 5px; margin-left: 3px;border-radius: 5px;border: 1px solid rgba(128,128,128,0.55)">
                    {{ item.btnText }}<span v-show="t!==0 && item.id===4">{{ t }}</span>
                  </el-button>
                  <el-button v-else
                             style="visibility: hidden;font-size:12px;padding: 5px; margin-left: 4px;border: 1px solid green">
                    Continue
                  </el-button>
                </div>
              </el-form-item>
            </div>
          </div>
          <el-button class="cursor-pointer" :class="{'signup-btn-valid': signUpBtnValid}" @click="signUp"
                     style="background-color: gray;color:#fff;padding: 8px 10px;font-size: 16px;margin: 20px auto;border-radius: 50px;border: none">
            Change password
          </el-button>
        </el-form>
      </div>

    </main>
    <span>{{ currentErr }}</span>
  </div>
</template>

<script>
import {computed, onMounted, reactive, ref, toRefs} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {ElMessage} from "element-plus";
import instance from "../api/request";

export default {
  name: "PasswordReset",
  setup: function () {
    onMounted(() => {
      if (store.state.t !== 0) {
        const item = self.menus[self.menus.length - 1]
        item.btnValid = false
        item.btnText = 'wait...'
        const timer = setInterval(() => {
          store.commit('set_t', store.state.t - 1)
          if (store.state.t === 0) {
            clearInterval(timer)
            item.btnValid = true
            item.btnText = 'send'
          }
        }, 1000)
      }
    })
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const self = reactive({
      returnToLogin: false,
      num: 2,
      currentIndex: 0,
      currentErr: '',
      signUpBtnValid: computed(() => {
        let n = ''
        self.menus.forEach(
            (x) => {
              n = n + x.status
            }
        )
        return n === '2222'
      }),
      t: computed(() => store.state.t),
      model: {
        email: '',
        password1: '',
        password2: '',
        code: ''
      },
      menus: [
        {
          id: 1,
          title: 'Enter your email',
          icon: '&#xe66a;',
          modelItem: 'email',
          status: '1',
          err: '邮箱格式不正确！',
          btnValid: false,
          btnText: 'Continue',
          type: 'text',
        },
        {
          id: 2,
          title: 'Password',
          icon: '&#xe66a;',
          modelItem: 'password1',
          status: '1',
          err: '密码应为 3到16 个字符',
          btnValid: false,
          btnText: 'Continue',
          type: 'password',
        },
        {
          id: 3,
          title: 'Confirm Password',
          icon: '&#xe66a;',
          modelItem: 'password2',
          status: '1',
          err: '两次密码不一致！',
          btnValid: false,
          btnText: 'Continue',
          type: 'password',
        },
        {
          id: 4,
          title: 'Enter verify code',
          icon: '&#xe66a;',
          modelItem: 'code',
          status: '1',
          err: '验证码应为6个字符',
          btnValid: true,
          btnText: 'Send',
          type: 'text',
        },
      ],
      send_verify_code: async (item) => {
        if (!item.btnValid) {
          return
        }
        store.commit('set_t', 30)
        item.btnValid = false
        item.btnText = 'wait...'
        const timer = setInterval(() => {
          store.state.t--
          store.commit('set_t', store.state.t - 1)
          if (store.state.t === 0) {
            clearInterval(timer)
            item.btnValid = true
            item.btnText = 'send'
          }
        }, 1000)
        const res = await instance.get('/get_email_code', {params: {'email': self.model.email}})
        if (res.code === 200) {
          ElMessage.success(res.msg)
        } else {
          ElMessage.error(res.msg)
        }
      },
      checkModel: async (item) => {
        const res = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (item.id === 1) {
          if (res.test(self.model.email)) {
            const res = await instance.get('/check_user', {params: {'email': self.model.email}})
            if (res.code === 200) {
              item.status = '3'
              item.btnValid = false
              self.currentErr = '邮箱尚未注册！'
              return false
            }
            item.status = '2'
            item.btnValid = true
            item.btnValid = true
            self.currentErr = ''
          } else {
            item.status = '3'
            item.btnValid = false
            self.currentErr = item.err
            return false
          }
        } else if (item.id === 2) {
          if (self.model.password1.length >= 3 && self.model.password1.length <= 12) {
            item.status = '2'
            item.btnValid = true
            self.currentErr = ''
          } else {
            item.status = '3'
            item.btnValid = false
            self.currentErr = item.err
            return false
          }
        } else if (item.id === 3) {
          if (self.model.password1 === self.model.password2) {
            item.status = '2'
            item.btnValid = true
            self.currentErr = ''
          } else {
            item.status = '3'
            item.btnValid = false
            self.currentErr = item.err
            return false
          }
        } else if (item.id === 4) {
          if (self.model.code.length === 6) {
            item.status = '2'
            self.currentErr = ''
          } else {
            item.status = '3'
            self.currentErr = item.err
            return false
          }
        }

        return true
      },
      toTab: (route) => {
        router.push({name: route})
      },
      extendMenu: async (item, index) => {
        if (!item.btnValid && item.id !== 4) {
          return
        }
        if (item.id !== 4) {
          self.currentIndex++
        }
        if (self.num <= self.menus.length) {
          if (index + 2 >= self.num) {
            self.num++
          }
        }
        if (item.id === 4) {
          await self.send_verify_code(item)
        }
      },
      loading: false,
      btnText: computed(() => (self.loading ? '登录中...' : '登录')),
      ruleFormRef: ref(null),
      signUp: async () => {
        if (!self.signUpBtnValid) {
          return
        }
        self.loading = true
        const res = await instance.post('/password_reset', self.model)
        if (res.code !== 200) {
          ElMessage.error(res.msg)
        } else {
          self.returnToLogin = true
        }
        self.loading = false

      }
    })
    return {
      ...toRefs(self),
    }

  },


}
</script>

<style scoped>
.signup-btn-valid {
  background-color: green !important;
}

.valid {
  color: green !important;
  border-color: green !important;
}

.container {
  background-color: #ebe8e8;
  width: 500px;
  margin: 20px auto;

  border-radius: 10px;
}

</style>
