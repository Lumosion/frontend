/**
 * 极简语法高亮器（无外部依赖）
 * 支持 html / css / js / jsx 简单 token 上色
 */
(function () {
  'use strict';

  /** 通用关键字 */
  const JS_KEYWORDS =
    /\b(?:const|let|var|function|return|if|else|for|while|do|switch|case|break|continue|new|class|extends|import|export|from|default|async|await|try|catch|finally|throw|typeof|instanceof|of|in|this|super|null|undefined|true|false|static|yield)\b/g;

  const CSS_AT = /@[a-z-]+/g;

  /** 编码 HTML，避免 XSS（演示用） */
  function escape(html) {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /** 用占位符保护已经匹配过的 token，防止二次替换 */
  function highlightJS(code) {
    const placeholders = [];
    const save = (text, type) => {
      placeholders.push(`<span class="token ${type}">${text}</span>`);
      return `\u0000${placeholders.length - 1}\u0000`;
    };

    let s = escape(code);

    // 注释
    s = s.replace(/\/\*[\s\S]*?\*\//g, (m) => save(m, 'comment'));
    s = s.replace(/\/\/.*$/gm, (m) => save(m, 'comment'));
    // 字符串
    s = s.replace(/(['"`])(?:\\.|(?!\1)[^\\])*\1/g, (m) => save(m, 'string'));
    // 数字
    s = s.replace(/\b\d+(?:\.\d+)?\b/g, (m) => save(m, 'number'));
    // 关键字
    s = s.replace(JS_KEYWORDS, (m) => save(m, 'keyword'));
    // 函数名
    s = s.replace(/\b([a-zA-Z_$][\w$]*)\s*(?=\()/g, (m, name) =>
      save(name, 'function')
    );

    // 还原占位
    s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => placeholders[+i]);
    return s;
  }

  function highlightHTML(code) {
    let s = escape(code);
    // 注释
    s = s.replace(
      /&lt;!--[\s\S]*?--&gt;/g,
      (m) => `<span class="token comment">${m}</span>`
    );
    // 标签
    s = s.replace(
      /(&lt;\/?)([a-zA-Z][\w-]*)/g,
      (_, lt, name) => `${lt}<span class="token tag">${name}</span>`
    );
    // 属性
    s = s.replace(
      /\s([a-zA-Z-:]+)(=)/g,
      ` <span class="token attr-name">$1</span><span class="token punctuation">$2</span>`
    );
    // 属性值
    s = s.replace(
      /(=)("[^"]*"|'[^']*')/g,
      `<span class="token punctuation">$1</span><span class="token attr-value">$2</span>`
    );
    return s;
  }

  function highlightCSS(code) {
    let s = escape(code);
    // 注释
    s = s.replace(
      /\/\*[\s\S]*?\*\//g,
      (m) => `<span class="token comment">${m}</span>`
    );
    // 选择器（在 { 前的内容）
    s = s.replace(
      /([^{};\n]+)(\{)/g,
      (_, sel, brace) =>
        `<span class="token selector">${sel}</span><span class="token punctuation">${brace}</span>`
    );
    // 属性: 值;
    s = s.replace(
      /([\w-]+)\s*(:)\s*([^;}\n]+)(;?)/g,
      (_, prop, colon, val, semi) =>
        `<span class="token property">${prop}</span>${colon}<span class="token string">${val}</span>${semi}`
    );
    // @规则
    s = s.replace(CSS_AT, (m) => `<span class="token atrule">${m}</span>`);
    return s;
  }

  function highlight(el) {
    const lang = (el.className.match(/language-(\w+)/) || [])[1] || 'js';
    const raw = el.textContent;
    let html = '';
    if (lang === 'html' || lang === 'xml') html = highlightHTML(raw);
    else if (lang === 'css') html = highlightCSS(raw);
    else html = highlightJS(raw);
    el.innerHTML = html;
  }

  function run() {
    document
      .querySelectorAll('pre code, code[class*="language-"]')
      .forEach(highlight);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }

  window.__highlight = run;
})();
