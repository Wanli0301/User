import { defineStore } from 'pinia'

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

export const useUserStore = defineStore('user', {
  state: () => ({
    users: [],
    loading: false,
    error: null
  }),
  
  actions: {
    async fetchUsers() {
      this.loading = true
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        this.users = mockUsers
        return true
      } catch (error) {
        this.error = error.message
        return false
      } finally {
        this.loading = false
      }
    },

    async createUser(userData) {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        const newUser = {
          _id: Date.now().toString(),
          ...userData
        }
        mockUsers.push(newUser)
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },

    async updateUser(id, userData) {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockUsers.findIndex(user => user._id === id)
        if (index !== -1) {
          mockUsers[index] = { ...mockUsers[index], ...userData }
        }
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    },

    async deleteUser(id) {
      try {
        // 模拟API调用延迟
        await new Promise(resolve => setTimeout(resolve, 500))
        const index = mockUsers.findIndex(user => user._id === id)
        if (index !== -1) {
          mockUsers.splice(index, 1)
        }
        await this.fetchUsers()
        return true
      } catch (error) {
        this.error = error.message
        return false
      }
    }
  }
}) 