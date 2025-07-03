
# -----------------------------------------------------------------------------
# 阶段 1: 构建应用
# 此阶段负责安装所有依赖并构建 Next.js 应用程序。
# -----------------------------------------------------------------------------
FROM node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 文件
# 这一步可以利用 Docker 缓存，如果依赖没有改变，则不会重新安装
COPY package.json package-lock.json ./

# 安装所有依赖 (包括开发依赖)
# npm ci 命令会根据 package-lock.json 精确安装，保证构建可重复性
RUN npm ci

# 复制所有应用程序文件
# .dockerignore 文件将确保跳过不需要的文件
COPY . .

# 构建 Next.js 应用
# 这将生成 .next/ 目录，其中包含生产优化后的代码
RUN npm run build


# -----------------------------------------------------------------------------
# 阶段 2: 运行应用
# 此阶段使用一个更小、更精简的基础镜像，只包含运行 Next.js 应用所需的生产文件。
# -----------------------------------------------------------------------------
FROM node:18-alpine AS runner

# 设置生产环境变量
# Next.js 会根据此变量以生产模式运行
ENV NODE_ENV=production

# 设置工作目录
WORKDIR /app

# 从构建阶段复制必要的文件
# 仅复制 .next 目录、public 目录 (静态文件) 和 package.json
# 注意：不需要复制整个 node_modules，我们只安装生产依赖
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# ⚠️ 注意: Next.js 12+ 版本在生产模式下不需要 node_modules 就可以运行
# 这是因为所有必要的依赖都被打包到了 .next 目录中。
# 如果你的应用依赖于运行时需要访问的非打包模块 (例如外部的 require)，
# 你可能需要复制生产依赖。对于大多数 Next.js 应用，这一步可以省略。
# 如果你确定需要生产依赖，可以取消注释下面这行：
# COPY --from=builder /app/node_modules ./node_modules

# 暴露 Next.js 应用程序监听的端口
EXPOSE 3000

# 启动 Next.js 应用程序
# npm start 命令会运行 package.json 中定义的 "start" 脚本
CMD ["npm", "start"]
