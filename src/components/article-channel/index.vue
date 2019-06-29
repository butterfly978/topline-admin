<template>
  <!-- 这个组件还是使用人家 Element 的下拉列表组件 -->
  <!-- <el-select clearable :value="value" @change="handleChange"> -->
  <el-select clearable :value="value" @change="$emit('input', $event)">
    <el-option
      v-for="item in channels"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  name: 'ArticleChannel',
  props: {
    value: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      channels: []
    }
  },
  methods: {
    async loadChannels () {
      try {
        const data = await this.$http({
          method: 'GET',
          url: '/channels'
        })
        this.channels = data.channels
      } catch (err) {
        this.$message.error('获取频道数据失败', err)
      }
    },
    handleChange (e) {
      this.$emit('input', e)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
