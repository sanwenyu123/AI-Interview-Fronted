#!/bin/bash

echo "正在修复npm安装问题..."
echo

# 清理npm缓存
echo "1. 清理npm缓存..."
npm cache clean --force

# 删除node_modules和package-lock.json
echo "2. 删除旧的依赖文件..."
rm -rf node_modules
rm -f package-lock.json

# 设置npm配置
echo "3. 设置npm配置..."
npm config set legacy-peer-deps true
npm config set strict-ssl false
npm config set registry https://registry.npmjs.org/

# 使用淘宝镜像源
echo "4. 尝试使用淘宝镜像源..."
npm config set registry https://registry.npmmirror.com/

echo "5. 重新安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo
    echo "npm安装失败，尝试使用yarn..."
    echo "请先安装yarn: npm install -g yarn"
    echo "然后运行: yarn install"
    exit 1
fi

echo
echo "安装完成！现在可以运行: npm start"
