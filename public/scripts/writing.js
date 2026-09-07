// 搜索索引在构建后生成，使用原生模块加载，避免打包器改写延迟导入。
const panel = document.querySelector('#search');
const base = panel?.dataset.baseUrl || '/';
const buttons = [...document.querySelectorAll('.filter-button')];
const rows = [...document.querySelectorAll('.post-row[data-tags]')];
const count = document.querySelector('#visible-count');
const input = document.querySelector('#search-input');
const results = document.querySelector('#search-results');
const hint = document.querySelector('.search-hint');
let searchRevision = 0;
let indexPromise;

buttons.forEach((button) =>
  button.addEventListener('click', () => {
    buttons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    const filter = button.dataset.filter;
    let visible = 0;
    rows.forEach((row) => {
      const show = filter === 'all' || row.dataset.tags?.split('|').includes(filter);
      row.hidden = !show;
      if (show) visible++;
    });
    if (count) count.textContent = String(visible);
  }),
);

function showResults(items) {
  if (!results) return;
  results.replaceChildren(
    ...items.map((item) => {
      const link = document.createElement('a');
      link.className = 'search-result';
      link.href = item.url;
      const title = document.createElement('strong');
      title.textContent = item.title;
      const excerpt = document.createElement('p');
      // Pagefind 的摘要来自本站构建的文章索引，只保留文本与高亮标记。
      const parsed = new DOMParser().parseFromString(item.excerpt, 'text/html');
      function appendText(source, target) {
        source.childNodes.forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) target.append(document.createTextNode(node.textContent));
          else if (node.nodeName === 'MARK') {
            const mark = document.createElement('mark');
            mark.textContent = node.textContent;
            target.append(mark);
          } else appendText(node, target);
        });
      }
      appendText(parsed.body, excerpt);
      link.append(title, excerpt);
      return link;
    }),
  );
  if (!items.length) {
    const message = document.createElement('p');
    message.className = 'search-hint';
    message.textContent = '没有找到相关内容，试试其他关键词。';
    results.append(message);
  }
}

async function runSearch() {
  const revision = ++searchRevision;
  const query = input?.value.trim();
  if (!results) return;
  if (!query) {
    results.replaceChildren();
    results.setAttribute('aria-busy', 'false');
    return;
  }
  results.setAttribute('aria-busy', 'true');
  try {
    if (!indexPromise)
      indexPromise = import(`${base}pagefind/pagefind.js`).then(async (index) => {
        await index.options({ baseUrl: base });
        await index.init();
        return index;
      });
    const index = await indexPromise;
    const search = await index.search(query);
    const data = await Promise.all(search.results.slice(0, 6).map((item) => item.data()));
    if (revision !== searchRevision) return;
    showResults(data.map((item) => ({ url: item.url, title: item.meta.title, excerpt: item.excerpt })));
    if (hint) hint.textContent = 'FULL-TEXT SEARCH · PRESS / TO FOCUS';
  } catch {
    indexPromise = undefined;
    if (revision !== searchRevision) return;
    const matches = rows
      .filter((row) => row.textContent?.toLocaleLowerCase().includes(query.toLocaleLowerCase()))
      .slice(0, 6);
    showResults(
      matches.map((row) => ({
        url: row.getAttribute('href') || `${base}writing/`,
        title: row.querySelector('h3')?.textContent || '',
        excerpt: row.querySelector('p')?.textContent || '',
      })),
    );
    if (hint) hint.textContent = '全文索引暂不可用，当前按文章标题与简介搜索。';
  } finally {
    if (revision === searchRevision) results.setAttribute('aria-busy', 'false');
  }
}
input?.addEventListener('input', runSearch);
document.addEventListener('keydown', (event) => {
  const editing =
    event.target instanceof HTMLElement &&
    (event.target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName));
  if (event.key === '/' && !editing && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault();
    input?.focus();
  }
});
