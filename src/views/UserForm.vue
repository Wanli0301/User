<template>
  <el-card class="form-card" shadow="never">
    <template #header>
      <div class="card-header">
        <h3>{{ isEdit ? '编辑用户' : '创建用户' }}</h3>
      </div>
    </template>

    <el-form 
      ref="formRef"
      :model="formData"
      :rules="rules"
      label-width="100px"
      class="user-form"
    >
      <el-form-item label="用户名" prop="username">
        <el-input 
          v-model="formData.username" 
          placeholder="请输入用户名"
        />
      </el-form-item>

      <el-form-item label="邮箱" prop="email">
        <el-input 
          v-model="formData.email" 
          placeholder="请输入邮箱"
        />
      </el-form-item>

      <el-form-item label="密码" prop="password" v-if="!isEdit">
        <el-input 
          v-model="formData.password" 
          type="password"
          placeholder="请输入密码"
          show-password
        />
      </el-form-item>

      <el-form-item label="角色" prop="role">
        <el-select 
          v-model="formData.role"
          placeholder="请选择角色"
          class="role-select"
        >
          <el-option label="普通用户" value="user" />
          <el-option label="管理员" value="admin" />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button 
          type="primary" 
          @click="handleSubmit"
          :loading="loading"
        >
          {{ isEdit ? '更新' : '创建' }}
        </el-button>
        <el-button @click="$router.push('/')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)

const isEdit = computed(() => route.params.id)
const formRef = ref(null)

const formData = ref({
  username: '',
  email: '',
  password: '',
  role: 'user'
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: !isEdit.value, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少6个字符', trigger: 'blur' }
  ],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }]
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        let success
        if (isEdit.value) {
          success = await userStore.updateUser(route.params.id, formData.value)
        } else {
          success = await userStore.createUser(formData.value)
        }
        
        if (success) {
          ElMessage.success(isEdit.value ? '更新成功' : '创建成功')
          router.push('/')
        }
      } catch (error) {
        ElMessage.error(isEdit.value ? '更新失败' : '创建失败')
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.form-card {
  max-width: 600px;
  margin: 0 auto;
  animation: slideIn 0.5s ease;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color);
}

.user-form {
  padding: 30px 0;
}

:deep(.el-input),
.role-select {
  width: 100%;
  max-width: 360px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color);
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: var(--text-color);
}

:deep(.el-button) {
  padding: 12px 24px;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 表单项悬停效果 */
:deep(.el-form-item:hover) {
  transform: translateX(5px);
}

/* 下拉选择框样式优化 */
:deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6;
}

:deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color);
}

/* 错误状态优化 */
:deep(.el-form-item.is-error .el-input__wrapper) {
  box-shadow: 0 0 0 1px #f56c6c;
}

/* 按钮组样式 */
:deep(.el-form-item:last-child) {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}
</style> 