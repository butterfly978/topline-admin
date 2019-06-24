<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑马头条号">
      </div>
      <!-- 配置校验规则
          rules 规则对象配置到 el-form 上,rules 中配置的校验字段必须和表单数据对象保持一致
          prop  校验字段配置到 el-form-item 上
        JavaScript 触发验证
          给 el-form 添加 ref
          调用 this.$refs['ref名字'].validate(valid => {}) 触发验证 -->
      <el-form class="form-content" ref="form" :model="form" :rules="rules">
        <el-form-item prop="mobile">
          <el-input placeholder="手机号" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- el-col 柵格佈局，共24列；:span 指定佔用的大小；:offset 指定偏移量 -->
          <el-col :span="14">
            <el-input placeholder="验证码" v-model="form.code"></el-input>
          </el-col>
          <el-col :offset="1" :span="7">
            <el-button @click="handleSendCode" :disabled="!!codeTimer">{{ codeTimer ? `剩余${codeTimeSeconds}秒` : '获取验证码' }}</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-checkbox class="agree-checkbox" v-model="form.agree"></el-checkbox>
          <span class="agree-text">我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a></span>
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
import { saveUser } from '@/utils/auth' // 按需加载，加载模块中非 export default 成员
const initCodeTimeSeconds = 60

export default {
  name: 'AppLogin',
  data () {
    return {
      form: { // 表单数据对象
        mobile: '',
        code: '',
        agree: ''
      },
      rules: { // 验证规则对象
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /\d{11}/, message: '请输入有效手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /\d{6}/, message: '请输入有效验证码', trigger: 'blur' }
        ],
        agree: [
          { required: true, message: '请同意用户协议' }, // 只校验是否有值，不关心是 true 还是 false
          { pattern: /true/, message: '请同意用户协议' } // 为了校验数据值必须是 true
        ]
      },
      codeTimer: null, // 倒计时定时器
      codeTimeSeconds: initCodeTimeSeconds // 倒计时时间
    }
  },
  methods: {
    handleLogin (form) {
      this.$refs['form'].validate(valid => {
        if (!valid) {
          return
        }
        // 表单验证通过，提交登录申请
        this.submitLogin()
      })
    },
    submitLogin () {
      axios({
        method: 'POST',
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        data: this.form
      }).then(res => { // >=200 && <400 的状态码进入这里
        const userInfo = res.data.data
        // window.localStorage.setItem('user_info', JSON.stringify(userInfo))
        saveUser(userInfo)
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
      // 验证手机号是否有效
      this.$refs['form'].validateField('mobile', errorMessage => {
        if (errorMessage.trim().length > 0) {
          return
        }
        // 验证通过，初始化显示验证码
        this.showGeetest()
      })
    },
    // 验证通过，初始化显示人机交互验证码
    showGeetest () {
      // 任何函数中的 function 函数内部的this 指向 window
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
        }, captchaObj => {
          captchaObj.onReady(() => {
            // 驗證碼ready之後才能調用verify方法顯示驗證碼
            captchaObj.verify() // 彈出驗證碼內容框
          }).onSuccess(() => {
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
              // 发送短信成功，开始倒计时
              this.codeCountDown()
            })
          }).onError(function () {
            // your code
          })
        })
      })
    },
    // 验证倒计时
    codeCountDown () {
      this.codeTimer = window.setInterval(() => {
        this.codeTimeSeconds--
        if (this.codeTimeSeconds <= 0) {
          // 清除定时器
          window.clearInterval(this.codeTimer)
          // 让倒计时的时间回归初始状态
          this.codeTimeSeconds = initCodeTimeSeconds
          // 将存储定时器引用的变量重新赋值为null
          this.codeTimer = null
        }
      }, 1000)
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
    .agree-checkbox {
      margin-right: 10px;
    }
    .agree-text {
      font-size: 16px;
      color: #999;
    }
    .btn-login{
      width: 100%;
    }
  }
}
</style>
