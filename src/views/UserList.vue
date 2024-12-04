<template>
  <div class="user-list">
    <el-card class="list-card" shadow="never">
      <template #header>
        <div class="card-header">
          <div class="left">
            <h3>用户列表</h3>
            <el-tag type="info" class="count-tag">
              共 {{ filteredUsers.length }} 条
            </el-tag>
          </div>
          <div class="right">
            <el-input
              v-model="searchQuery"
              placeholder="搜索用户名或邮箱"
              class="search-input"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button 
              :icon="Refresh"
              circle
              @click="handleRefresh"
              :loading="userStore.loading"
            />
            <el-button type="primary" @click="$router.push('/user/create')">
              <el-icon><Plus /></el-icon>添加用户
            </el-button>
            <el-dropdown @command="handleExport" class="export-dropdown">
              <el-button>
                <el-icon><Download /></el-icon>
                导出数据
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="all">导出全部</el-dropdown-item>
                  <el-dropdown-item command="selected">导出选中</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>

      <el-table 
        :data="paginatedUsers" 
        v-loading="userStore.loading"
        style="width: 100%"
        border
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column 
          prop="username" 
          label="用户名"
          sortable="custom"
        >
          <template #default="{ row }">
            <div class="user-cell">
              <el-avatar :size="32" icon="UserFilled" />
              <span>{{ row.username }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column 
          prop="email" 
          label="邮箱"
          sortable="custom"
        />
        <el-table-column 
          prop="role" 
          label="角色" 
          width="120"
          :filters="[
            { text: '管理员', value: 'admin' },
            { text: '普通用户', value: 'user' }
          ]"
          :filter-method="filterRole"
        >
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'success'">
              {{ row.role === 'admin' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button 
              type="primary" 
              link
              @click="$router.push(`/user/edit/${row._id}`)"
            >
              编辑
            </el-button>
            <el-popconfirm
              title="确定要删除这个用户吗？"
              @confirm="handleDelete(row._id)"
            >
              <template #reference>
                <el-button type="danger" link>删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :total="userStore.users.length"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :small="false"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>

      <div class="batch-actions" v-show="selectedRows.length">
        <span class="selected-count">已选择 {{ selectedRows.length }} 项</span>
        <div class="actions">
          <el-button 
            type="danger" 
            size="small"
            @click="handleBatchDelete"
          >
            批量删除
          </el-button>
          <el-button 
            type="primary" 
            size="small"
            @click="handleExport('selected')"
          >
            导出选中
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Search, Refresh, Download } from '@element-plus/icons-vue'

const userStore = useUserStore()

const currentPage = ref(1)
const pageSize = ref(10)
const searchQuery = ref('')
const sortBy = ref('')
const sortOrder = ref('')
const roleFilter = ref('')
const selectedRows = ref([])

const filteredUsers = computed(() => {
  let result = userStore.users

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }

  if (roleFilter.value) {
    result = result.filter(user => user.role === roleFilter.value)
  }

  if (sortBy.value && sortOrder.value) {
    result = [...result].sort((a, b) => {
      const aValue = a[sortBy.value]
      const bValue = b[sortBy.value]
      
      if (sortOrder.value === 'ascending') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })
  }

  return result
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}

onMounted(() => {
  userStore.fetchUsers()
})

const handleDelete = async (id) => {
  try {
    const success = await userStore.deleteUser(id)
    if (success) {
      ElMessage.success('删除成功')
    }
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleRefresh = async () => {
  try {
    await userStore.fetchUsers()
    ElMessage.success('刷新成功')
  } catch (error) {
    ElMessage.error('刷新失败')
  }
}

const handleSortChange = ({ prop, order }) => {
  sortBy.value = prop
  sortOrder.value = order
}

const filterRole = (value, row) => {
  return row.role === value
}

const handleSelectionChange = (val) => {
  selectedRows.value = val
}

const handleExport = (command) => {
  const data = command === 'all' ? userStore.users : selectedRows.value
  if (data.length === 0) {
    ElMessage.warning('没有可导出的数据')
    return
  }

  // 转换数据为CSV格式
  const headers = ['用户名', '邮箱', '角色']
  const csvContent = [
    headers.join(','),
    ...data.map(user => [
      user.username,
      user.email,
      user.role === 'admin' ? '管理员' : '普通用户'
    ].join(','))
  ].join('\n')

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `用户数据_${new Date().toLocaleDateString()}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handleBatchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedRows.value.length} 个用户吗？`,
      '批量删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    const promises = selectedRows.value.map(user => userStore.deleteUser(user._id))
    await Promise.all(promises)
    ElMessage.success('批量删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
    }
  }
}
</script>

<style scoped>
.user-list {
  min-height: calc(100vh - 140px);
  animation: fadeIn 0.5s ease;
}

.list-card {
  background-color: #fff;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.list-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.left h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.count-tag {
  font-size: 12px;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.3s ease;
}

.user-cell:hover {
  transform: translateX(5px);
}

.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.el-table) {
  --el-table-border-color: #ebeef5;
  --el-table-header-bg-color: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f5f7fa !important;
  font-weight: 600;
}

:deep(.el-table td) {
  padding: 12px 0;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 12px;
  height: 28px;
  line-height: 26px;
}

:deep(.el-avatar) {
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-input {
  width: 250px;
}

.export-dropdown {
  margin-right: 12px;
}

:deep(.el-table .selected-row) {
  background-color: var(--el-table-row-hover-bg-color);
}

.batch-actions {
  margin: 16px 0;
  padding: 12px 16px;
  background: #fff;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  animation: slideIn 0.3s ease;
}

.selected-count {
  color: var(--text-color);
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 8px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 