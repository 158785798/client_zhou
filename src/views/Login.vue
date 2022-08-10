<template>
  <div style="text-align: center">
    <img src="../assets/logo.png" alt=""
         style="border-radius: 50%; width: 60px;margin: 100px auto 30px;"
         @click="toTab('Home')">
    <summary style="font-size: 24px">Sign in to CandyCats</summary>
    <main class="container" style="box-shadow: 0 0 20px 5px rgba(0,0,0,0.2)">
      <div style="display: flex; justify-content: center;">
        <el-form
            ref="ruleFormRef"
            :rules="rules"
            v-loading="loading"
            label-position="top"
            label-width="100px"
            :model="model"
            style="max-width: 280px;color:#201e1e; "
        >
          <el-form-item prop="username">
            <summary>Username or email address</summary>
            <el-input
                clearable
                placeholder="Username or email address here"
                v-model="model.username"/>
          </el-form-item>
          <el-form-item prop="password">
            <div style="display: flex;justify-content: space-between; width: 100%">
              <summary>Password</summary>
              <a href="javascript:" @click="toTab('PasswordReset')">Forgot password?</a>
            </div>
            <el-input
                clearable
                type="password"
                :show-password="true"
                placeholder="password here"
                v-model="model.password"/>
          </el-form-item>
          <el-button @click="submit">
            Sign In
          </el-button>
        </el-form>
      </div>
    </main>
    <div class="container" style="font-size: 12px; color: #201e1e">
      New to CandyCats?
      <a href="javascript:" @click="toTab('SignUp')">Create an account.</a></div>
    <div style="margin-top: 50px; font-size: 12px">
      <a style="margin: 10px" href="javascript:" v-for="item in groups">{{ item.name }}</a>
    </div>
  </div>

</template>

<script lang="ts">
import {computed, reactive, ref, toRefs} from "vue";
import {useRoute, useRouter} from "vue-router";
import {useStore} from "vuex";
import {ElMessage} from "element-plus";
import instance from '../api/request'
import * as url from "url";

export default {
  name: "Login",
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      groups: [
        {name: 'Terms'},
        {name: 'Privacy'},
        {name: 'Security'},
        {name: 'Contact CandyCats'},

      ],
      model: {
        username: '',
        password: '',
      },
      rules: {
        username: [
          {required: true, message: 'username is required', trigger: 'blur'},
          {
            min: 3,
            max: 18,
            message: '长度在 3 到 18 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          {required: true, message: 'password is required', trigger: 'blur'},
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: 'blur',
          },
        ],
      },
      toTab: (route) => {
        router.push({name: route})
      },
      loading: false,
      btnText: computed(() => (state.loading ? '登录中...' : '登录')),
      ruleFormRef: ref(null),
      submit: () => {
        console.log(process.env.NODE_ENV);
        if (state.loading) {
          return
        }
        state.ruleFormRef.validate(async valid => {
          if (valid) {
            state.loading = true
            const res = await instance.post('/login', state.model)
            if (res.code === 200) {
              ElMessage.success(`欢迎可爱的${res.username}!`)
              window.localStorage.setItem('token_zhou', res.token)
              store.commit('local/saveUserInfo', res)
              const p = route.query.next ? route.query.next : 'Home'
              await router.push(p)
            } else {
              ElMessage.error(res.msg)
            }
            state.loading = false

          }
        })
      },
    })

    return {
      ...toRefs(state),
    }
  },
}

</script>

<style scoped>
.reset-pwd {
  z-index: 100;
}

.reset-pwd:after {

  content: '';
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 80;
  position: fixed;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.2);

}

.container {
  background-color: #f6f8fa;
  width: 320px;
  margin: 20px auto;
  padding: 15px;
  border-radius: 10px;
}


</style>
