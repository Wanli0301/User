<template>
  <div class="profile">
    <el-card class="profile-card" shadow="never">
      <template #header>
        <div class="card-header">
          <h3>个人信息</h3>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="profileForm"
        :rules="rules"
        label-width="100px"
        class="profile-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="profileForm.username"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="profileForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>

        <el-form-item label="当前密码" prop="currentPassword">
          <el-input 
            v-model="profileForm.currentPassword"
            type="password"
            placeholder="修改信息需要验证当前密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="profileForm.newPassword"
            type="password"
            placeholder="不修改请留空"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input 
            v-model="profileForm.confirmPassword"
            type="password"
            placeholder="不修改请留空"
            show-password
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

      <el-divider>
        <el-icon><Lock /></el-icon>
      </el-divider>

      <div class="security-info">
        <h4>安全信息</h4>
        <div class="info-item">
          <span class="label">账户角色：</span>
          <el-tag :type="userStore.currentUser?.role === 'admin' ? 'danger' : 'success'">
            {{ userStore.currentUser?.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </div>
        <div class="info-item">
          <span class="label">上次登录：</span>
          <span>{{ new Date().toLocaleString() }}</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'
import { Lock } from '@element-plus/icons-vue'

const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)

const profileForm = reactive({
  username: '',
  email: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 验证规则
const validatePass = (rule, value, callback) => {
  if (value && value.length < 6) {
    callback(new Error('密码长度不能小于6个字符'))
  } else {
    if (profileForm.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (profileForm.newPassword && !value) {
    callback(new Error('请确认新密码'))
  } else if (value !== profileForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePass2, trigger: 'blur' }
  ]
}

// 加载用户数据
const loadUserData = () => {
  const currentUser = userStore.currentUser
  if (currentUser) {
    profileForm.username = currentUser.username
    profileForm.email = currentUser.email
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 这里应该调用实际的API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('个人信息更新成功')
    resetForm()
  } catch (error) {
    console.error('Update profile error:', error)
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
    loadUserData()
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.profile {
  min-height: calc(100vh - 140px);
  animation: fadeIn 0.5s ease;
}

.profile-card {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.profile-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.profile-form {
  max-width: 600px;
  margin: 20px auto;
}

.security-info {
  padding: 20px;
}

.security-info h4 {
  margin: 0 0 16px 0;
  color: var(--text-color);
  font-size: 14px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 14px;
}

.info-item .label {
  color: var(--text-light);
  width: 100px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--primary-color) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--primary-color) inset !important;
}

.el-button {
  padding: 12px 20px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.el-divider__text) {
  background-color: transparent;
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .profile-card {
    margin: 0 20px;
  }
  
  .profile-form {
    padding: 0 20px;
  }
  
  :deep(.el-form-item__label) {
    float: none;
    display: block;
    text-align: left;
    padding: 0 0 10px;
  }
  
  .info-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .info-item .label {
    margin-bottom: 4px;
  }
}
</style> 