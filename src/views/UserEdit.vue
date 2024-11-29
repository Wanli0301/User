<template>
  <div class="user-edit">
    <el-card class="form-card" shadow="never" v-loading="initialLoading">
      <template #header>
        <div class="card-header">
          <h3>编辑用户</h3>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="userForm"
        :rules="rules"
        label-width="100px"
        class="user-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input 
            v-model="userForm.username"
            placeholder="请输入用户名"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input 
            v-model="userForm.email"
            placeholder="请输入邮箱"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input 
            v-model="userForm.password"
            type="password"
            placeholder="不修改请留空"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="userForm.confirmPassword"
            type="password"
            placeholder="不修改请留空"
            show-password
          />
        </el-form-item>

        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="loading">
            保存修改
          </el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const formRef = ref(null)
const loading = ref(false)
const initialLoading = ref(true)

const userForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user'
})

// 修改密码验证规则，允许为空
const validatePass = (rule, value, callback) => {
  if (value && value.length < 6) {
    callback(new Error('密码长度不能小于6个字符'))
  } else {
    if (userForm.confirmPassword !== '') {
      formRef.value?.validateField('confirmPassword')
    }
    callback()
  }
}

const validatePass2 = (rule, value, callback) => {
  if (userForm.password && !value) {
    callback(new Error('请确认密码'))
  } else if (value !== userForm.password) {
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
  password: [
    { validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { validator: validatePass2, trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择用户角色', trigger: 'change' }
  ]
}

// 加载用户数据
const loadUserData = async () => {
  const userId = route.params.id
  const user = userStore.users.find(u => u._id === userId)
  
  if (user) {
    userForm.username = user.username
    userForm.email = user.email
    userForm.role = user.role
  } else {
    ElMessage.error('用户不存在')
    router.push('/')
  }
  initialLoading.value = false
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    const userData = {
      username: userForm.username,
      email: userForm.email,
      role: userForm.role
    }

    // 只有当密码字段有值时才更新密码
    if (userForm.password) {
      userData.password = userForm.password
    }
    
    const success = await userStore.updateUser(route.params.id, userData)
    if (success) {
      ElMessage.success('更新用户成功')
      router.push('/')
    }
  } catch (error) {
    console.error('Update user error:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.user-edit {
  min-height: calc(100vh - 140px);
  animation: fadeIn 0.5s ease;
}

.form-card {
  max-width: 800px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 4px;
  transition: transform 0.3s ease;
}

.form-card:hover {
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

.user-form {
  max-width: 600px;
  margin: 20px auto;
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
  .form-card {
    margin: 0 20px;
  }
  
  .user-form {
    padding: 0 20px;
  }
  
  :deep(.el-form-item__label) {
    float: none;
    display: block;
    text-align: left;
    padding: 0 0 10px;
  }
}
</style> 