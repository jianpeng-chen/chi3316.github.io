// 统一处理 GitHub Pages 项目站点的子路径，兼容本地预览与线上访问。
export const withBase = (path = '/') =>
  `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
export const githubUrl = 'https://github.com/jianpeng-chen';
