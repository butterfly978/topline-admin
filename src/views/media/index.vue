<template>
  <el-card>
    <div slot="header">
      <span>素材管理</span>
    </div>
    <div class="action">
      <el-radio-group v-model="active">
        <!-- click、dblclick 是原生的 DOM 事件
        el-xxx 是什么？这是组件标签
        老师？el-button 怎么就有呢？因为这个组件将内部的点击事件做了对外发布 $emit
        使用 @click 给 el-button 注册点击事件，只是让你看起来像是在注册原生事件，实质是它在内部将原生DOM的点击事件做了对外发布 $emit('click', 事件参数)
        如果想要给一个组件注册一个原生事件，@原生事件.native -->
        <el-radio-button label="全部" @click.native="loadImages(false)"></el-radio-button>
        <el-radio-button label="收藏" @click.native="loadImages(true)"></el-radio-button>
      </el-radio-group>
      <el-button type="primary">上传图片</el-button>
    </div>
    <!-- 图片列表 -->
    <el-row :gutter="20">
      <el-col :span="4" v-for="item in images" :key="item.id" style="margin-bottom: 10px;">
        <el-card :body-style="{ padding: '0px' }">
          <img :src="item.url" class="image" style="max-width: 100%;">
          <div style="padding: 10px;">
            <div class="bottom clearfix">
              <el-button plain type="primary" :icon="item.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'" circle @click="handleCollect(item)"></el-button>
              <!-- 1. 注册点击事件，绑定处理函数，传递要删除的数据对象
              2. 定义删除函数，发请求执行删除操作
              3. 成功：重新加载数据列表，提示成功
              失败：提示失败 -->
              <el-button plain type="primary" icon="el-icon-delete" circle @click="handleDelete(item)"></el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  name: 'MediaList',
  data () {
    return {
      active: '全部',
      images: []
    }
  },
  created () {
    this.loadImages()
  },
  methods: {
    async loadImages (collect = false) {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/user/images',
          params: {
            collect, // 是否查询收藏图片，默认查所有
            page: 1,
            per_page: 10
          }
        })
        this.images = data.results
      } catch (err) {
        console.log(err)
        this.$message.error('加载图片列表失败')
      }
    },
    async handleCollect (item) {
      const collect = !item.is_collected
      try {
        const data = await this.$http({
          method: 'PUT',
          url: `/user/images/${item.id}`,
          data: {
            collect
          }
        })
        item.is_collected = data.collect
        this.$message({
          type: 'success',
          message: `${collect ? '' : '取消'}收藏成功`
        })
      } catch (err) {
        console.log(err)
        this.$message.error('收藏失败')
      }
    },
    async handleDelete (item) {
      try {
        await this.$http({
          method: 'DELETE',
          url: `/user/images/${item.id}`
        })
        // 重新加载数据列表
        this.loadImages()
        this.$message({
          type: 'success',
          message: '删除成功'
        })
      } catch (err) {
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.action {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.bottom {
  display: flex;
  justify-content: center;
}
</style>
