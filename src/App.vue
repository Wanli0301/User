<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '220px'" class="aside">
      <div class="logo" :class="{ 'collapsed': isCollapse }">
        <el-icon><Monitor /></el-icon>
        <span v-show="!isCollapse">用户管理系统</span>
      </div>
      <el-menu
        class="menu"
        router 
        default-active="/"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="/">
          <el-icon><UserFilled /></el-icon>
          <template #title>用户列表</template>
        </el-menu-item>
        <el-menu-item index="/user/create">
          <el-icon><Plus /></el-icon>
          <template #title>添加用户</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <el-button
          link
          class="collapse-btn"
          @click="toggleCollapse"
        >
          <el-icon><Fold v-if="!isCollapse" /><Expand v-else /></el-icon>
        </el-button>
        <div class="header-right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="32" icon="UserFilled" />
              <span>管理员</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人信息</el-dropdown-item>
                <el-dropdown-item>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref } from 'vue'
import { 
  UserFilled, 
  Plus, 
  Monitor,
  Fold,
  Expand
} from '@element-plus/icons-vue'

const isCollapse = ref(false)

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style>
:root {
  --primary-color: #409EFF;
  --menu-bg: #304156;
  --menu-hover: #263445;
  --text-color: #303133;
  --text-light: #909399;
}

* {
  transition: all 0.3s ease-in-out;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.el-table tbody tr:hover td {
  background-color: #f5f7fa !important;
}
</style>

<style scoped>
.layout-container {
  height: 100vh;
}

.aside {
  background-color: #304156;
  transition: width 0.3s;
  overflow: hidden;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.12);
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  background: linear-gradient(to right, #304156, #2b3a4a);
  white-space: nowrap;
  overflow: hidden;
}

.logo.collapsed {
  padding: 0;
  justify-content: center;
}

.logo .el-icon {
  font-size: 20px;
  margin-right: 12px;
}

.logo.collapsed .el-icon {
  margin-right: 0;
  font-size: 24px;
}

.menu {
  border-right: none;
  background-color: transparent;
}

:deep(.el-menu) {
  border-right: none;
}

:deep(.el-menu-item) {
  color: #bfcbd9;
}

:deep(.el-menu-item.is-active) {
  color: #409EFF;
  background-color: #263445;
}

:deep(.el-menu-item:hover) {
  background-color: #263445;
}

:deep(.el-menu--collapse) {
  border-right: none;
}

:deep(.el-menu-item) {
  display: flex;
  align-items: center;
}

:deep(.el-menu-item .el-icon) {
  margin-right: 16px;
  font-size: 18px;
}

:deep(.el-menu--collapse .el-menu-item .el-icon) {
  margin: 0;
}

.header {
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}

.collapse-btn {
  font-size: 20px;
  color: #303133;
}

.collapse-btn:hover {
  transform: scale(1.1);
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.user-info:hover {
  opacity: 0.8;
}

.user-info span {
  margin-left: 8px;
  font-size: 14px;
  color: #303133;
}

.main {
  background-color: #f0f2f5;
  padding: 20px;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
</style> 