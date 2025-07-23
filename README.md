# GitHub URL转换器 Chrome扩展

## 功能
- 在GitHub代码页面一键切换到DeepWiki
- 在GitHub代码页面一键切换到GitHub1s
- 在DeepWiki/GitHub1s页面一键返回GitHub

## 转换规则

**重要说明：** 根据代码实现，本扩展的转换规则是**简化版本**，只保留最基本的仓库信息。

### 转换逻辑

代码中的转换函数使用以下逻辑：
```javascript
const pathParts = urlObj.pathname.split('/').slice(1, 3); // 获取owner/repo部分
return `https://目标域名.com/${pathParts.join('/')}`;
```

这意味着：
1. **只提取路径的前两个部分**（owner和repo名称）
2. **丢弃所有其他信息**：分支、文件路径、查询参数等
3. **只支持基本的仓库页面转换**

### 实际转换示例

#### 1. GitHub → DeepWiki
**转换规则：** 只保留 `owner/repo`，丢弃其他所有信息

**实际转换：**
- `https://github.com/facebook/react` → `https://codewiki.google/github.com/facebook/react`
- `https://github.com/facebook/react/tree/main` → `https://codewiki.google/github.com/facebook/react` ❌ (分支信息丢失)
- `https://github.com/facebook/react/blob/main/README.md` → `https://codewiki.google/github.com/facebook/react` ❌ (文件信息丢失)
- `https://github.com/facebook/react/issues/123` → `https://codewiki.google/github.com/facebook/react` ❌ (页面类型丢失)

#### 2. GitHub → GitHub1s
**转换规则：** 只保留 `owner/repo`，丢弃其他所有信息

**实际转换：**
- `https://github.com/facebook/react` → `https://github1s.com/facebook/react`
- `https://github.com/facebook/react/tree/main` → `https://github1s.com/facebook/react` ❌ (分支信息丢失)
- `https://github.com/facebook/react/blob/main/README.md` → `https://github1s.com/facebook/react` ❌ (文件信息丢失)

#### 3. DeepWiki → GitHub
**转换规则：** 只保留 `owner/repo`，丢弃其他所有信息

**实际转换：**
- `https://codewiki.google/github.com/facebook/react` → `https://github.com/facebook/react`
- `https://codewiki.google/github.com/facebook/react/tree/main` → `https://github.com/facebook/react` ❌ (分支信息丢失)

#### 4. DeepWiki → GitHub1s
**转换规则：** 只保留 `owner/repo`，丢弃其他所有信息

**实际转换：**
- `https://codewiki.google/github.com/facebook/react` → `https://github1s.com/facebook/react`
- `https://codewiki.google/github.com/facebook/react/tree/main` → `https://github1s.com/facebook/react` ❌ (分支信息丢失)

#### 5. GitHub1s → GitHub
**转换规则：** 只保留 `owner/repo`，丢弃其他所有信息

**实际转换：**
- `https://github1s.com/facebook/react` → `https://github.com/facebook/react`
- `https://github1s.com/facebook/react/tree/main` → `https://github.com/facebook/react` ❌ (分支信息丢失)

#### 6. GitHub1s → DeepWiki
**转换规则：** 只保留 `owner/repo`，丢弃其他所有信息

**实际转换：**
- `https://github1s.com/facebook/react` → `https://codewiki.google/github.com/facebook/react`
- `https://github1s.com/facebook/react/tree/main` → `https://codewiki.google/github.com/facebook/react` ❌ (分支信息丢失)

### 限制说明

1. **不支持分支保留**：所有包含分支信息的URL都会被简化为基本仓库页面
2. **不支持文件路径**：文件、目录等详细路径信息会被丢弃
3. **不支持特殊页面**：Issues、Pull Requests、Actions等页面都会被转换为基本仓库页面
4. **只适用于仓库主页转换**：最适合从GitHub仓库主页快速切换到其他平台

### 适用场景

- 从GitHub仓库主页快速切换到DeepWiki或GitHub1s
- 从DeepWiki或GitHub1s快速返回GitHub仓库主页
- 不需要保留具体分支、文件或页面类型信息的场景

### 技术实现

```javascript
function convertToCodeWiki(url) {
  const urlObj = new URL(url);
  if (urlObj.hostname.includes('github.com') || urlObj.hostname.includes('github1s.com')) {
    const pathParts = urlObj.pathname.split('/').slice(1, 3); // 只取前两个路径段
    return `https://codewiki.google/github.com/${pathParts.join('/')}`;
  }
  return url;
}
```

**关键点：**
- `split('/').slice(1, 3)` - 只取路径的第2和第3个部分（索引1和2）
- 丢弃路径的其余部分和所有查询参数
- 这是一个**简化版**的转换，专注于基本的仓库页面跳转

## 技术实现

### URL转换逻辑
扩展通过以下步骤进行URL转换：

1. **解析原始URL**：使用 `new URL(url)` 解析当前页面URL
2. **提取关键信息**：
   - 从 `pathname` 中提取 `owner/repo` 部分
   - 保留分支信息（如果有）
   - 保留文件路径信息（如果有）
3. **构建新URL**：根据目标平台拼接新的URL
4. **执行跳转**：使用 `chrome.tabs.update()` 更新当前标签页

### 按钮状态管理
扩展会根据当前页面的域名自动禁用相应的按钮：
- 在 `github.com` 页面禁用"返回GitHub"按钮
- 在 `github1s.com` 页面禁用"切换到GitHub1s"按钮
- 在 `codewiki.google` 页面禁用"切换到CodeWiki"按钮
- 在其他页面禁用所有按钮

## 安装
1. 克隆本仓库
2. 在Chrome中打开`chrome://extensions`
3. 启用"开发者模式"
4. 点击"加载已解压的扩展程序"选择项目目录

## 使用说明
1. 在GitHub代码页面点击扩展图标
2. 选择要切换的目标平台
3. 在DeepWiki/GitHub1s页面可点击"返回GitHub"按钮

## 项目结构
```
github-url-converter/
├── icons/            # 扩展图标
├── src/              # 源代码
│   ├── background.js # 背景脚本
│   ├── content.js    # 内容脚本
│   └── popup/        # 弹出页面
├── manifest.json     # 扩展配置文件
└── README.md         # 说明文档