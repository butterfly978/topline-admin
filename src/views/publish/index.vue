<template>
  <el-card class="publish-card">
    <div slot="header" class="header">
      <span>发布文章</span>
      <div>
        <el-button type="success" @click="handlePublish(false)">发布</el-button>
        <el-button type="primary" @click="handlePublish(true)">存入草稿</el-button>
      </div>
    </div>
    <el-row>
      <el-col :span="16">
        <!-- 表单 -->
        <el-form ref="form" :model="articleForm" label-width="80px">
          <el-form-item label="标题">
            <el-input v-model="articleForm.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <!-- bidirectional data binding（双向数据绑定） -->
            <quill-editor v-model="articleForm.content" ref="myQuillEditor" :options="editorOption"></quill-editor>
          </el-form-item>
          <el-form-item label="封面">
          </el-form-item>
          <el-form-item label="频道">
            <!-- v-model="articleForm.channel_id" 相当于
              v-bind:value="articleForm.channel_id"
                绑定一个名字叫 value 的数据给子组件
              v-on:input="articleForm.channel_id = $event"
                默认监听子组件的 input 自定义事件，事件发生以后，将事件参数赋值给你绑定的数据 -->
            <article-channel v-model="articleForm.channel_id"></article-channel>
            <!-- 在组件上 v-model
                数据会影响视图
                视图也会影响数据 -->
            <!-- <el-select v-model="articleForm.channel_id" placeholder="请选择活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select> -->
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import ArticleChannel from '@/components/article-channel'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import './quill.user.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  name: 'AppPublish',
  components: {
    ArticleChannel,
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: '', // 标题
        content: '', // 内容
        channel_id: '', // 频道
        cover: { // 封面
          type: 0, // 封面类型 -1:自动，0-无图，1-1张，3-3张
          images: []
        }
      },
      editorOption: {} // 富文本编辑器配置选项
    }
  },
  created () {
    if (this.$route.name === 'publish-edit') {
      this.loadArticle()
    }
  },
  methods: {
    async loadArticle () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: `/articles/${this.$route.params.id}`
        })
        this.articleForm = data
      } catch (err) {
        console.log(err)
        this.$message.error('获取文章失败')
      }
    },
    async handlePublish (draft) {
      try {
        await this.$http({
          method: 'POST',
          url: '/articles',
          params: {
            draft
          },
          data: this.articleForm
        })
        this.$message({
          type: 'success',
          message: '发布成功'
        })
      } catch (err) {
        this.$message.error('发布失败', err)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.publish-card {
  min-height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
