# 安装指南

## 问题解决方案

如果遇到npm install错误，请按以下步骤操作：

### 方法1：使用修复脚本（推荐）

#### Windows用户
```bash
# 运行修复脚本
fix-install.bat
```

#### Linux/Mac用户
```bash
# 给脚本执行权限
chmod +x fix-install.sh
# 运行修复脚本
./fix-install.sh
```

### 方法2：手动修复

1. **清理缓存和旧文件**
```bash
npm cache clean --force
rm -rf node_modules
rm -f package-lock.json
```

2. **设置npm配置**
```bash
npm config set legacy-peer-deps true
npm config set strict-ssl false
npm config set registry https://registry.npmmirror.com/
```

3. **重新安装**
```bash
npm install
```

### 方法3：使用yarn（如果npm仍有问题）

1. **安装yarn**
```bash
npm install -g yarn
```

2. **使用yarn安装依赖**
```bash
yarn install
```

3. **启动项目**
```bash
yarn start
```

### 方法4：使用cnpm

1. **安装cnpm**
```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
```

2. **使用cnpm安装**
```bash
cnpm install
```

## 常见问题

### Q: 网络连接问题
A: 尝试使用国内镜像源
```bash
npm config set registry https://registry.npmmirror.com/
```

### Q: 权限问题
A: 以管理员身份运行命令提示符

### Q: Node.js版本问题
A: 确保使用Node.js 16.0或更高版本

### Q: 依赖冲突
A: 使用 `--legacy-peer-deps` 参数
```bash
npm install --legacy-peer-deps
```

## 验证安装

安装完成后，运行以下命令验证：

```bash
npm start
```

如果成功启动，您将看到：
- 浏览器自动打开 http://localhost:3000
- 控制台显示 "Compiled successfully!"

## 联系支持

如果以上方法都无法解决问题，请提供：
1. 操作系统版本
2. Node.js版本 (`node --version`)
3. npm版本 (`npm --version`)
4. 完整的错误信息
