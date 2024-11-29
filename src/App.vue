<template>
  <router-view></router-view>
</template>

<style>
:root {
  --primary-color: #409EFF;
  --menu-bg: #304156;
  --menu-hover: #263445;
  --text-color: #303133;
  --text-light: #909399;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
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
</style> 