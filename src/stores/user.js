import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import request from '../utils/request'

// 模拟数据
const mockUsers = [
  {
    _id: '1',
    username: '张三',
    email: 'zhangsan@example.com',
    role: 'admin'
  },
  {
    _id: '2',
    username: '李四',
    email: 'lisi@example.com',
    role: 'user'
  }
]

export const useUserStore = defineStore('user', () => {
  const currentUser = ref(null)
  const token = ref(localStorage.getItem('token'))
  const loading = ref(false)
  const users = ref([])

  const isLoggedIn = computed(() => !!token.value)

  const login = async (credentials) => {
    try {
      loading.value = true
      // 在实际项目中，这里应该使用 request
      // const response = await request.post('/auth/login', credentials)
      
      // 模拟登录成功
      const mockResponse = {
        token: 'mock-token',
        user: {
          username: credentials.username,
          role: 'admin'
        }
      }
      
      token.value = mockResponse.token
      currentUser.value = mockResponse.user
      localStorage.setItem('token', token.value)
      return true
    } catch (error) {
      ElMessage.error(error.response?.data?.message || '登录失败')
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      // 在实际项目中，这里应该使用 request
      // await request.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      token.value = null
      currentUser.value = null
      localStorage.removeItem('token')
    }
  }

  const fetchUsers = async () => {
    loading.value = true
    try {
      // 在实际项目中，这里应该使用 request
      // const response = await request.get('/users')
      // users.value = response.data
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      users.value = mockUsers
      return true
    } catch (error) {
      ElMessage.error(error.message)
      return false
    } finally {
      loading.value = false
    }
  }

  const createUser = async (userData) => {
    try {
      // 在实际项目中，这里应该使用 request
      // const response = await request.post('/users', userData)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      const newUser = {
        _id: Date.now().toString(),
        ...userData
      }
      mockUsers.push(newUser)
      return true
    } catch (error) {
      ElMessage.error(error.message)
      return false
    }
  }

  const updateUser = async (id, userData) => {
    try {
      // 在实际项目中，这里应该使用 request
      // const response = await request.put(`/users/${id}`, userData)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = mockUsers.findIndex(user => user._id === id)
      if (index !== -1) {
        mockUsers[index] = { ...mockUsers[index], ...userData }
      }
      return true
    } catch (error) {
      ElMessage.error(error.message)
      return false
    }
  }

  const deleteUser = async (id) => {
    try {
      // 在实际项目中，这里应该使用 request
      // await request.delete(`/users/${id}`)
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 500))
      const index = mockUsers.findIndex(user => user._id === id)
      if (index !== -1) {
        mockUsers.splice(index, 1)
      }
      await fetchUsers()
      return true
    } catch (error) {
      ElMessage.error(error.message)
      return false
    }
  }

  return {
    currentUser,
    token,
    loading,
    users,
    isLoggedIn,
    login,
    logout,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}) 