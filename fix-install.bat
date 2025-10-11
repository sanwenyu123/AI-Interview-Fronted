@echo off
echo 正在修复npm安装问题...
echo.

REM 清理npm缓存
echo 1. 清理npm缓存...
npm cache clean --force

REM 删除node_modules和package-lock.json
echo 2. 删除旧的依赖文件...
if exist "node_modules" rmdir /s /q "node_modules"
if exist "package-lock.json" del "package-lock.json"

REM 设置npm配置
echo 3. 设置npm配置...
npm config set legacy-peer-deps true
npm config set strict-ssl false
npm config set registry https://registry.npmjs.org/

REM 使用cnpm镜像源（如果npm仍然有问题）
echo 4. 尝试使用淘宝镜像源...
npm config set registry https://registry.npmmirror.com/

echo 5. 重新安装依赖...
npm install

if %errorlevel% neq 0 (
    echo.
    echo npm安装失败，尝试使用yarn...
    echo 请先安装yarn: npm install -g yarn
    echo 然后运行: yarn install
    pause
    exit /b 1
)

echo.
echo 安装完成！现在可以运行: npm start
pause
