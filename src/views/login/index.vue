<template>
  <div class="login-wrap">
    <div class="form-wrap">
      <div class="form-head">
        <img src="./logo_index.png" alt="黑馬頭條號">
      </div>
      <el-form class="form-content" ref="form" :model="form">
        <el-form-item >
          <el-input placeholder="手機號" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-col :span="14">
            <el-input placeholder="驗證碼" v-model="form.code"></el-input>
          </el-col>
          <el-col :offset="1" :span="7">
            <el-button @click="handleSendCode">獲取驗證碼</el-button>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button class="btn-login" type="primary" @click="handleSubmit">登錄</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
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
    handleSubmit () {
      console.log('submit!')
    },
    handleSendCode () {
      console.log('code')
    }
  }
}
</script>

<style lang='less' scoped>
.login-wrap {
  height: 100%;
  background: url('./login_bg.jpg') center;
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