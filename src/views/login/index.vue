<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <el-form class="form-content" ref="form" :model="form">
        <el-form-item >
          <el-input placeholder="手机号" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- el-col 柵格佈局，共24列；:span 指定佔用的大小；:offset 指定偏移量 -->
          <el-col :span="14">
            <el-input placeholder="验证码" v-model="form.code"></el-input>
          </el-col>
          <el-col :offset="1" :span="7">
            <el-button @click="handleSendCode">获取验证码</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// 引入極驗 JavaScript SDK 文件，通過window.initGeetest使用
import '@/vendor/gt'

export default {
  name: 'AppLogin',
  data () {
    return {
      form: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    handleLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => { // >=200 && <400 的状态码进入这里
        console.log(res.data)
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        this.$router.push({
          name: 'home'
        })
      }).catch((e) => {
        this.$message.error('登录失败，手机号或验证码错误')
      }) // >=400 的状态码进入这里
    },
    handleSendCode () {
      const { mobile } = this.form
      axios({
        method: 'GET',
        url: `https://mock.boxuegu.com/mock/434/v1_0/captchas/${mobile}`
      }).then(res => {
        const { data } = res.data
        window.initGeetest({
          // 以下配置參數來自服務端 SDK
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: data.new_captcha,
          product: 'bind' // 隱藏，直接彈出式
        }, function (captchaObj) {
          captchaObj.onReady(function () {
            // 驗證碼ready之後才能調用verify方法顯示驗證碼
            captchaObj.verify() // 彈出驗證碼內容框
          }).onSuccess(function () {
            const {
              geetest_challenge: challenge,
              geetest_seccode: seccode,
              geetest_validate: validate } =
            captchaObj.getValidate()
            axios({
              method: 'GET',
              url: `http://ttapi.research.itcast.cn/mp/v1_0/sms/codes/${mobile}`,
              params: {
                challenge,
                validate,
                seccode
              }
            }).then(res => {
              console.log(res.data)
            })
          }).onError(function () {
            // your code
          })
          // 在這裡註冊“發送驗證碼”按鈕的點擊事件，再驗證用戶是否輸入手機號以及手機號格式是否正確：
          // captchaObj.verify
        })
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login-wrap {
  height: 100%;
  background: url('../../assets/login_bg.jpg') center;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-head {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
    img {
      width: 200px;
    }
  }
  .form-wrap {
    width: 300px;
    padding: 25px;
    background-color: #fff;
    border-radius: 20px;
    .btn-login{
      width: 100%;
    }
  }
}
</style>
