# 沥青计算器 (Asphalt Calculator)

一个专业的在线工具，用于计算沥青铺设项目所需的材料量和成本。

## 功能特点

- 支持多种形状区域计算（矩形、圆形、三角形等）
- 公制和英制单位转换
- 基于面积和厚度的体积计算
- 考虑材料密度的重量计算
- 成本估算（材料、人工、运输）
- 项目参数调整
- 结果保存和分享功能

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod

## 开发环境要求

1. Node.js 18.17 或更高版本
2. npm 9.0 或更高版本

## 安装步骤

1. 安装 Node.js
   - 访问 [Node.js 官网](https://nodejs.org/)
   - 下载并安装 LTS 版本

2. 克隆项目
   ```bash
   git clone [项目地址]
   cd 沥青计算器
   ```

3. 安装依赖
   ```bash
   npm install
   ```

4. 启动开发服务器
   ```bash
   npm run dev
   ```

5. 在浏览器中访问 [http://localhost:3000](http://localhost:3000)

## 项目结构

```
src/
├── app/                 # Next.js 应用路由
├── components/          # React 组件
│   ├── layout/         # 布局组件
│   ├── calculator/     # 计算器相关组件
│   ├── ui/             # UI 基础组件
│   └── shared/         # 共享组件
├── lib/                # 工具函数和常量
├── types/              # TypeScript 类型定义
└── styles/             # 全局样式
```

## 开发规范

- 使用 ESLint 和 Prettier 进行代码格式化
- 遵循 TypeScript 最佳实践
- 组件使用函数式组件和 React Hooks
- 使用有意义的变量命名和适当注释

## 测试

```bash
# 运行单元测试
npm run test

# 运行 E2E 测试
npm run cypress
```

## 部署

项目使用 Vercel 进行部署，支持自动部署和预览环境。

## 许可证

MIT 