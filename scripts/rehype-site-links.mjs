import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';

// 为文章中的站内链接添加部署前缀，并恢复能按文件名找到的旧插图。
export default function rehypeSiteLinks({ base = '' } = {}) {
  return (tree) => {
    const visit = (node) => {
      if (node.type === 'element' && node.properties) {
        for (const key of ['href', 'src']) {
          const value = node.properties[key];
          if (
            typeof value !== 'string' ||
            !value.startsWith('/') ||
            value.startsWith('//') ||
            value.startsWith(`${base}/`)
          )
            continue;
          let path = value;
          if (
            node.tagName === 'img' &&
            key === 'src' &&
            !existsSync(join(process.cwd(), 'public', decodeURI(path)))
          ) {
            const recovered = `/assets/${basename(decodeURI(path))}`;
            if (existsSync(join(process.cwd(), 'public', recovered))) path = recovered;
            else {
              // 原稿仍保留原始地址；页面明确标记遗失的历史插图，避免无意义的失败请求。
              node.tagName = 'span';
              node.properties = { className: ['missing-media'] };
              node.children = [{ type: 'text', value: `[历史插图暂缺：${basename(decodeURI(path))}]` }];
              break;
            }
          }
          node.properties[key] = `${base}${path}`;
        }
      }
      node.children?.forEach(visit);
    };
    visit(tree);
  };
}
