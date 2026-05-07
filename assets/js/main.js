/**
 * 前端全景指南 · 主交互脚本
 * 包含主题切换、滚动联动、各模块 Demo 实现
 */

/* =====================================================
 * 1. 主题切换（深色 / 浅色）
 * ===================================================== */
(function initTheme() {
  /** @type {HTMLButtonElement | null} */
  const btn = document.getElementById('themeToggle');
  if (!btn) return;

  /**
   * 应用主题
   * @param {'dark' | 'light'} theme
   */
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    btn.textContent = theme === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('fe-theme', theme);
  };

  const saved = /** @type {'dark' | 'light' | null} */ (
    localStorage.getItem('fe-theme')
  );
  apply(saved || 'dark');

  btn.addEventListener('click', () => {
    const next =
      document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(next);
  });
})();

/* =====================================================
 * 1.5 移动端汉堡菜单
 * ===================================================== */
(function initMobileNav() {
  /** @type {HTMLButtonElement | null} */
  const toggle = document.getElementById('navToggle');
  /** @type {HTMLElement | null} */
  const nav = document.getElementById('mainNav');
  /** @type {HTMLElement | null} */
  const mask = document.getElementById('navMask');
  if (!toggle || !nav || !mask) return;

  /**
   * 设置菜单展开状态
   * @param {boolean} open
   */
  const setOpen = (open) => {
    nav.classList.toggle('open', open);
    mask.classList.toggle('show', open);
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('open'));
  });
  mask.addEventListener('click', () => setOpen(false));

  // 点击导航项后自动收起
  nav.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => setOpen(false));
  });

  // 视口变大时强制关闭，防止状态遗留
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && nav.classList.contains('open')) {
      setOpen(false);
    }
  });

  // ESC 关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('open')) setOpen(false);
  });
})();

/* =====================================================
 * 2. 顶部导航高亮 + 返回顶部按钮
 * ===================================================== */
(function initScrollSpy() {
  const links = document.querySelectorAll('.main-nav a');
  const sections = Array.from(links).map((a) =>
    document.querySelector(a.getAttribute('href') || '')
  );
  const toTop = document.getElementById('toTop');

  const onScroll = () => {
    const y = window.scrollY + 90;
    let active = -1;
    sections.forEach((sec, i) => {
      if (sec && sec.offsetTop <= y) active = i;
    });
    links.forEach((a, i) => a.classList.toggle('active', i === active));

    if (toTop) {
      toTop.classList.toggle('show', window.scrollY > 600);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =====================================================
 * 3. HTML 模块：表单提交演示
 * ===================================================== */
(function initFormDemo() {
  /** @type {HTMLFormElement | null} */
  const form = document.getElementById('demoForm');
  const out = document.getElementById('formOutput');
  if (!form || !out) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {};
    new FormData(form).forEach((v, k) => (data[k || 'value'] = v));
    // 实际无 name 属性，这里用索引展示
    const inputs = form.querySelectorAll('input');
    const result = {
      email: inputs[0].value,
      age: inputs[1].value,
      url: inputs[2].value || '(空)',
    };
    out.textContent =
      '✅ 浏览器原生校验通过：\n' + JSON.stringify(result, null, 2);
  });
})();

/* =====================================================
 * 4. CSS 模块：Flex 控制台
 * ===================================================== */
(function initFlexDemo() {
  const stage = document.getElementById('flexStage');
  const justify = document.getElementById('flexJustify');
  const align = document.getElementById('flexAlign');
  if (!stage || !justify || !align) return;

  const update = () => {
    stage.style.justifyContent = justify.value;
    stage.style.alignItems = align.value;
  };
  justify.addEventListener('change', update);
  align.addEventListener('change', update);
})();

/* =====================================================
 * 5. CSS 模块：动画演示
 * ===================================================== */
(function initAnimDemo() {
  const ball = document.getElementById('animBall');
  const btn = document.getElementById('animBtn');
  if (!ball || !btn) return;

  btn.addEventListener('click', () => {
    ball.classList.toggle('run');
  });
})();

/* =====================================================
 * 6. JS 模块：闭包计数器
 * ===================================================== */
(function initClosure() {
  const btn = document.getElementById('closureBtn');
  const out = document.getElementById('closureOut');
  if (!btn || !out) return;

  /** 经典闭包：counter() 返回的函数仍持有 n */
  const counter = () => {
    let n = 0;
    return () => ++n;
  };
  const inc = counter();

  btn.addEventListener('click', () => {
    out.textContent = String(inc());
  });
})();

/* =====================================================
 * 7. JS 模块：事件循环演示
 * ===================================================== */
(function initEventLoop() {
  const btn = document.getElementById('loopBtn');
  const out = document.getElementById('loopOut');
  if (!btn || !out) return;

  btn.addEventListener('click', () => {
    out.textContent = '';
    const log = (msg) => (out.textContent += msg + '\n');

    log('1. 同步：脚本开始');
    setTimeout(() => log('5. 宏任务：setTimeout 回调'), 0);
    Promise.resolve().then(() => log('3. 微任务：Promise.then'));
    queueMicrotask(() => log('4. 微任务：queueMicrotask'));
    log('2. 同步：脚本结束');
  });
})();

/* =====================================================
 * 8. JS 模块：异步请求演示（模拟）
 * ===================================================== */
(function initAsync() {
  const btn = document.getElementById('asyncBtn');
  const out = document.getElementById('asyncOut');
  if (!btn || !out) return;

  /** 模拟一个 fetch 请求 */
  const mockFetch = (id) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve({ id, name: 'User_' + id, role: id % 2 ? 'admin' : 'guest' });
      }, 600);
    });

  /** 加载用户 */
  const loadUser = async (id) => {
    out.textContent = '⏳ loading...';
    try {
      const user = await mockFetch(id);
      out.textContent = '✅ 成功：\n' + JSON.stringify(user, null, 2);
    } catch (err) {
      out.textContent = '❌ 失败：' + err.message;
    }
  };

  btn.addEventListener('click', () => {
    const id = Math.floor(Math.random() * 100);
    loadUser(id);
  });
})();

/* =====================================================
 * 9. JS 模块：防抖 & 节流对比
 * ===================================================== */
(function initDebounceThrottle() {
  const stage = document.getElementById('dtStage');
  const rawEl = document.getElementById('rawCount');
  const debEl = document.getElementById('debCount');
  const thrEl = document.getElementById('thrCount');
  if (!stage || !rawEl || !debEl || !thrEl) return;

  let raw = 0;
  let deb = 0;
  let thr = 0;

  /**
   * 防抖：N ms 内连续触发，只执行最后一次
   * @template {(...args: any[]) => void} F
   * @param {F} fn
   * @param {number} delay
   */
  const debounce = (fn, delay) => {
    /** @type {ReturnType<typeof setTimeout> | null} */
    let timer = null;
    return (...args) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  };

  /**
   * 节流：N ms 内最多执行一次
   * @template {(...args: any[]) => void} F
   * @param {F} fn
   * @param {number} delay
   */
  const throttle = (fn, delay) => {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= delay) {
        last = now;
        fn(...args);
      }
    };
  };

  const onDeb = debounce(() => {
    deb += 1;
    debEl.textContent = String(deb);
  }, 300);
  const onThr = throttle(() => {
    thr += 1;
    thrEl.textContent = String(thr);
  }, 300);

  stage.addEventListener('mousemove', () => {
    raw += 1;
    rawEl.textContent = String(raw);
    onDeb();
    onThr();
  });
})();

/* =====================================================
 * 10. 框架模块：Proxy 实现迷你响应式
 * ===================================================== */
(function initReactive() {
  const input = /** @type {HTMLInputElement | null} */ (
    document.getElementById('reactiveInput')
  );
  const out = document.getElementById('reactiveOut');
  if (!input || !out) return;

  /**
   * 通用响应式工厂
   * @template {object} T
   * @param {T} target
   * @param {(key: string | symbol, value: unknown) => void} onChange
   * @returns {T}
   */
  const reactive = (target, onChange) =>
    new Proxy(target, {
      set(t, k, v) {
        t[k] = v;
        onChange(k, v);
        return true;
      },
    });

  const state = reactive({ msg: '' }, (_, v) => {
    out.textContent = String(v) || '(空)';
  });

  input.addEventListener('input', (e) => {
    state.msg = /** @type {HTMLInputElement} */ (e.target).value;
  });
})();

/* =====================================================
 * 11. 性能模块：FPS 检测
 * ===================================================== */
(function initFps() {
  const btn = document.getElementById('fpsBtn');
  const out = document.getElementById('fpsOut');
  if (!btn || !out) return;

  /** @type {number | null} */
  let rafId = null;
  let frames = 0;
  let last = performance.now();

  const tick = () => {
    frames += 1;
    const now = performance.now();
    if (now - last >= 1000) {
      const fps = Math.round((frames * 1000) / (now - last));
      out.textContent = String(fps);
      frames = 0;
      last = now;
    }
    rafId = requestAnimationFrame(tick);
  };

  btn.addEventListener('click', () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
      out.textContent = '已停止';
    } else {
      frames = 0;
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    }
  });
})();

/* =====================================================
 * 12. 进阶：模拟 WebSocket 演示
 * 真实环境直接 new WebSocket(url) 即可，这里用 MockWS 离线演示
 * ===================================================== */
(function initWebSocket() {
  const log = document.getElementById('wsLog');
  const input = /** @type {HTMLInputElement | null} */ (
    document.getElementById('wsInput')
  );
  const sendBtn = document.getElementById('wsSend');
  const closeBtn = document.getElementById('wsClose');
  if (!log || !input || !sendBtn || !closeBtn) return;

  /** 在日志区追加一行 */
  const append = (text, type = 'sys') => {
    const row = document.createElement('div');
    row.className = 'row ' + type;
    const time = new Date().toLocaleTimeString();
    row.textContent = `[${time}] ${text}`;
    log.appendChild(row);
    log.scrollTop = log.scrollHeight;
  };

  /**
   * 模拟 WebSocket：与真实 API 同形（onopen/onmessage/send/close）
   */
  class MockWS {
    constructor() {
      this.readyState = 0;
      setTimeout(() => {
        this.readyState = 1;
        this.onopen && this.onopen();
      }, 300);
    }
    send(data) {
      if (this.readyState !== 1) return;
      // 模拟服务器 echo + 随机推送
      setTimeout(() => {
        this.onmessage && this.onmessage({ data: `echo: ${data}` });
      }, 250 + Math.random() * 300);
    }
    close() {
      this.readyState = 3;
      this.onclose && this.onclose();
    }
  }

  /** @type {MockWS | null} */
  let ws = null;
  /** @type {number | null} */
  let pushTimer = null;

  const connect = () => {
    append('正在连接 wss://demo.local ...', 'sys');
    ws = new MockWS();
    ws.onopen = () => {
      append('✅ 连接已建立', 'sys');
      // 服务器主动推送
      pushTimer = window.setInterval(() => {
        if (ws && ws.readyState === 1) {
          ws.onmessage({ data: `🔔 服务器推送 #${Math.floor(Math.random() * 1000)}` });
        }
      }, 4000);
    };
    ws.onmessage = (e) => append('← ' + e.data, 'recv');
    ws.onclose = () => {
      append('🔌 连接已关闭', 'sys');
      if (pushTimer) clearInterval(pushTimer);
    };
  };
  connect();

  const send = () => {
    const v = input.value.trim();
    if (!v) return;
    if (!ws || ws.readyState !== 1) {
      append('❌ 连接未建立，请刷新页面', 'err');
      return;
    }
    append('→ ' + v, 'send');
    ws.send(v);
    input.value = '';
  };

  sendBtn.addEventListener('click', send);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') send();
  });
  closeBtn.addEventListener('click', () => {
    if (ws) ws.close();
  });
})();

/* =====================================================
 * 13. 进阶：SSE / 流式输出 模拟
 * ===================================================== */
(function initSSE() {
  const btn = document.getElementById('sseBtn');
  const out = document.getElementById('sseOut');
  if (!btn || !out) return;

  const reply =
    'WebSocket 是基于 TCP 的全双工协议，握手通过 HTTP Upgrade 完成，' +
    '之后客户端与服务端可以随时互相推送消息。SSE 则是单向（服务端→客户端），' +
    '基于 HTTP，实现简单、自动重连，适合 AI 流式输出与实时日志推送。';

  btn.addEventListener('click', async () => {
    out.textContent = '';
    for (const ch of reply) {
      out.textContent += ch;
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 25));
    }
    out.textContent += '\n\n[done]';
  });
})();

/* =====================================================
 * 14. 进阶：Web Worker 演示（主线程 vs Worker）
 * 用 Blob URL 内联创建 Worker，无需额外文件
 * ===================================================== */
(function initWorker() {
  const mainBtn = document.getElementById('heavyMain');
  const workerBtn = document.getElementById('heavyWorker');
  const out = document.getElementById('workerOut');
  if (!mainBtn || !workerBtn || !out) return;

  /** 故意低效的递归斐波那契，N=38 在主线程会卡几百 ms */
  const fibSrc = `
    function fib(n){ return n < 2 ? n : fib(n-1) + fib(n-2); }
    self.onmessage = function(e){
      var t = performance.now();
      var r = fib(e.data);
      self.postMessage({ result: r, cost: performance.now() - t });
    };
  `;

  const blob = new Blob([fibSrc], { type: 'application/javascript' });
  const workerURL = URL.createObjectURL(blob);

  const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));

  mainBtn.addEventListener('click', () => {
    out.textContent = '⏳ 主线程计算中（页面将卡住）...';
    // 让上一行先渲染
    requestAnimationFrame(() => {
      const t = performance.now();
      const r = fib(38);
      out.textContent = `主线程结果：${r}，耗时 ${(performance.now() - t).toFixed(1)} ms（期间页面无响应）`;
    });
  });

  workerBtn.addEventListener('click', () => {
    out.textContent = '⏳ Worker 计算中（页面依然流畅）...';
    const w = new Worker(workerURL);
    w.onmessage = (e) => {
      out.textContent = `Worker 结果：${e.data.result}，耗时 ${e.data.cost.toFixed(1)} ms（主线程未阻塞）`;
      w.terminate();
    };
    w.postMessage(38);
  });
})();

/* =====================================================
 * 15. 进阶：Canvas 粒子动画
 * ===================================================== */
(function initCanvas() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('particleCanvas')
  );
  const btn = document.getElementById('canvasBtn');
  if (!canvas || !btn) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  /** 适配高分屏 */
  const resize = () => {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  /** @type {{x:number,y:number,vx:number,vy:number,r:number,c:string}[]} */
  let particles = [];
  let mode = 0; // 0=连线网, 1=烟花

  const colors = ['#6c8cff', '#8a5cff', '#25d4a8', '#ffb84d', '#ff6b81'];

  const reset = () => {
    const rect = canvas.getBoundingClientRect();
    const count = mode === 0 ? 50 : 120;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * rect.width,
      y: Math.random() * rect.height,
      vx: (Math.random() - 0.5) * (mode === 0 ? 1 : 2.5),
      vy: (Math.random() - 0.5) * (mode === 0 ? 1 : 2.5),
      r: mode === 0 ? 2 : 1.5 + Math.random() * 2,
      c: colors[Math.floor(Math.random() * colors.length)],
    }));
  };
  reset();

  const tick = () => {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > rect.width) p.vx *= -1;
      if (p.y < 0 || p.y > rect.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();
    }

    if (mode === 0) {
      // 邻近粒子连线
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 110) {
            ctx.strokeStyle = `rgba(108,140,255,${1 - d / 110})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    }
    requestAnimationFrame(tick);
  };
  tick();

  btn.addEventListener('click', () => {
    mode = (mode + 1) % 2;
    reset();
  });
})();

/* =====================================================
 * 16. 进阶：Web Components 自定义元素
 * ===================================================== */
(function initWebComponent() {
  if (customElements.get('fancy-btn')) return;

  class FancyBtn extends HTMLElement {
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML = `
        <style>
          button {
            padding: 10px 20px;
            border-radius: 10px;
            border: none;
            cursor: pointer;
            font-weight: 600;
            color: #fff;
            background: linear-gradient(135deg, #6c8cff, #8a5cff);
            box-shadow: 0 6px 18px rgba(108,140,255,.35);
            transition: transform .15s;
          }
          button:active { transform: translateY(1px); }
          button::before { content: '✨ '; }
        </style>
        <button><slot></slot></button>
      `;
      root.querySelector('button').addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('fancy-click'));
        // 简单反馈
        const old = root.querySelector('slot').assignedNodes()[0];
        if (old) {
          const original = old.textContent;
          old.textContent = '已点击 ✓';
          setTimeout(() => (old.textContent = original), 1000);
        }
      });
    }
  }
  customElements.define('fancy-btn', FancyBtn);
})();

/* =====================================================
 * 17. 进阶：localStorage 持久化笔记
 * ===================================================== */
(function initNote() {
  const area = /** @type {HTMLTextAreaElement | null} */ (
    document.getElementById('noteArea')
  );
  const saved = document.getElementById('noteSaved');
  if (!area || !saved) return;

  const KEY = 'fe-demo-note';
  area.value = localStorage.getItem(KEY) || '';
  saved.textContent = area.value ? '已恢复上次内容' : '空';

  /** 防抖保存 */
  let timer = null;
  area.addEventListener('input', () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      localStorage.setItem(KEY, area.value);
      saved.textContent = `已保存于 ${new Date().toLocaleTimeString()}`;
    }, 300);
  });
})();

/* =====================================================
 * 18. 进阶：File API + 拖拽上传
 * ===================================================== */
(function initDrop() {
  const zone = document.getElementById('dropZone');
  const input = /** @type {HTMLInputElement | null} */ (
    document.getElementById('fileInput')
  );
  const preview = document.getElementById('filePreview');
  if (!zone || !input || !preview) return;

  /**
   * 处理一组文件，过滤图片并预览
   * @param {FileList | File[]} files
   */
  const handle = (files) => {
    Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .forEach((f) => {
        const url = URL.createObjectURL(f);
        const img = document.createElement('img');
        img.src = url;
        img.title = `${f.name} · ${(f.size / 1024).toFixed(1)} KB`;
        img.onload = () => URL.revokeObjectURL(url);
        preview.appendChild(img);
      });
  };

  zone.addEventListener('click', () => input.click());
  input.addEventListener('change', () => {
    if (input.files) handle(input.files);
  });

  ['dragenter', 'dragover'].forEach((ev) =>
    zone.addEventListener(ev, (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    })
  );
  ['dragleave', 'drop'].forEach((ev) =>
    zone.addEventListener(ev, (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
    })
  );
  zone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files) handle(e.dataTransfer.files);
  });
})();

/* =====================================================
 * 19. 进阶：视频通话演示
 *    getUserMedia + RTCPeerConnection（本地回环）
 *    真实场景下 SDP/ICE 通过 WebSocket 信令交换；
 *    这里在同一页面建立 pcA <-> pcB 直接互连模拟两端。
 * ===================================================== */
(function initVideoCall() {
  const startBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('rtcStart')
  );
  const muteBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('rtcMute')
  );
  const camBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('rtcCam')
  );
  const screenBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('rtcScreen')
  );
  const shotBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('rtcShot')
  );
  const hangBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('rtcHangup')
  );
  const localVideo = /** @type {HTMLVideoElement | null} */ (
    document.getElementById('localVideo')
  );
  const remoteVideo = /** @type {HTMLVideoElement | null} */ (
    document.getElementById('remoteVideo')
  );
  const localMeta = document.getElementById('localMeta');
  const remoteMeta = document.getElementById('remoteMeta');
  const log = document.getElementById('rtcLog');
  const shotsBox = document.getElementById('rtcShots');

  if (
    !startBtn ||
    !muteBtn ||
    !camBtn ||
    !screenBtn ||
    !shotBtn ||
    !hangBtn ||
    !localVideo ||
    !remoteVideo ||
    !localMeta ||
    !remoteMeta ||
    !log ||
    !shotsBox
  ) {
    return;
  }

  /** @type {MediaStream | null} */
  let localStream = null;
  /** @type {RTCPeerConnection | null} */
  let pcA = null;
  /** @type {RTCPeerConnection | null} */
  let pcB = null;
  /** 当前是否处于屏幕共享 */
  let sharing = false;

  // 暴露给 7.13 监控/录制使用
  /** @type {any} */
  const w = window;
  w.__rtc = {
    getPcB: () => pcB,
    getLocalStream: () => localStream,
  };
  /** 用于切换屏幕共享后回到摄像头 */
  /** @type {MediaStreamTrack | null} */
  let cameraTrack = null;

  /** 写日志 */
  const append = (msg) => {
    log.textContent += msg + '\n';
    log.scrollTop = log.scrollHeight;
  };

  /** 启用/禁用一组按钮 */
  const setRunning = (running) => {
    startBtn.disabled = running;
    muteBtn.disabled = !running;
    camBtn.disabled = !running;
    screenBtn.disabled = !running;
    shotBtn.disabled = !running;
    hangBtn.disabled = !running;
  };

  /**
   * 建立本地回环的 WebRTC 连接：pcA -> pcB
   * 真实环境中 offer/answer/ice 应通过 WebSocket 在两台设备之间交换
   */
  const createLoopback = async () => {
    log.textContent = '';
    append('[step] 创建 RTCPeerConnection (A/B)');

    pcA = new RTCPeerConnection();
    pcB = new RTCPeerConnection();

    // 模拟信令：A 的 ICE -> B；B 的 ICE -> A
    pcA.onicecandidate = (e) => {
      if (e.candidate && pcB) pcB.addIceCandidate(e.candidate);
    };
    pcB.onicecandidate = (e) => {
      if (e.candidate && pcA) pcA.addIceCandidate(e.candidate);
    };

    pcA.onconnectionstatechange = () => {
      append('[A] connectionState = ' + pcA.connectionState);
    };
    pcB.onconnectionstatechange = () => {
      append('[B] connectionState = ' + pcB.connectionState);
      if (pcB.connectionState === 'connected') {
        remoteMeta.textContent = '已连通 · 实时传输中';
        remoteMeta.classList.add('live');
      }
    };

    // B 收到 A 的轨道，挂到远端 video
    pcB.ontrack = (e) => {
      append('[B] 收到对端轨道：' + e.track.kind);
      remoteVideo.srcObject = e.streams[0];
    };

    // 把本地轨道全部加入 A
    localStream.getTracks().forEach((t) => {
      pcA.addTrack(t, localStream);
    });

    // 建立连接：A 发 offer，B 回 answer
    const offer = await pcA.createOffer();
    await pcA.setLocalDescription(offer);
    append('[A] createOffer / setLocalDescription');

    await pcB.setRemoteDescription(offer);
    const answer = await pcB.createAnswer();
    await pcB.setLocalDescription(answer);
    append('[B] createAnswer / setLocalDescription');

    await pcA.setRemoteDescription(answer);
    append('[A] setRemoteDescription(answer) — 协商完成');
  };

  /** 开启摄像头并建立通话 */
  startBtn.addEventListener('click', async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      append('❌ 当前浏览器不支持 getUserMedia');
      return;
    }
    startBtn.textContent = '⏳ 请求权限中...';
    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720, facingMode: 'user' },
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      cameraTrack = localStream.getVideoTracks()[0] || null;

      localVideo.srcObject = localStream;
      const v = localStream.getVideoTracks()[0];
      const s = v ? v.getSettings() : {};
      localMeta.textContent = `live · ${s.width || '?'}×${s.height || '?'} @ ${s.frameRate || '?'}fps`;
      localMeta.classList.add('live');

      await createLoopback();
      setRunning(true);
      startBtn.textContent = '📞 开启摄像头并通话';
    } catch (err) {
      append('❌ 失败：' + err.message);
      startBtn.textContent = '📞 开启摄像头并通话';
    }
  });

  /** 静音切换 */
  muteBtn.addEventListener('click', () => {
    if (!localStream) return;
    const audio = localStream.getAudioTracks()[0];
    if (!audio) return;
    audio.enabled = !audio.enabled;
    muteBtn.textContent = audio.enabled ? '🔇 静音' : '🔊 取消静音';
    append('[op] 麦克风 ' + (audio.enabled ? 'on' : 'off'));
  });

  /** 摄像头开关 */
  camBtn.addEventListener('click', () => {
    if (!localStream) return;
    const video = localStream.getVideoTracks()[0];
    if (!video) return;
    video.enabled = !video.enabled;
    camBtn.textContent = video.enabled ? '📷 关闭摄像头' : '📸 开启摄像头';
    append('[op] 摄像头 ' + (video.enabled ? 'on' : 'off'));
  });

  /** 屏幕共享 / 摄像头 切换 —— 演示 RTCRtpSender.replaceTrack */
  screenBtn.addEventListener('click', async () => {
    if (!pcA || !localStream) return;
    const sender = pcA.getSenders().find((s) => s.track && s.track.kind === 'video');
    if (!sender) return;

    if (!sharing) {
      try {
        const display = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = display.getVideoTracks()[0];
        await sender.replaceTrack(screenTrack);
        localVideo.srcObject = new MediaStream([
          screenTrack,
          ...localStream.getAudioTracks(),
        ]);
        sharing = true;
        screenBtn.textContent = '🖥 切回摄像头';
        append('[op] 已切换为屏幕共享');

        // 用户从浏览器原生 UI 停止共享
        screenTrack.onended = async () => {
          if (sharing && cameraTrack) {
            await sender.replaceTrack(cameraTrack);
            localVideo.srcObject = localStream;
            sharing = false;
            screenBtn.textContent = '🖥 切换屏幕共享';
            append('[op] 屏幕共享已结束，恢复摄像头');
          }
        };
      } catch (err) {
        append('❌ 屏幕共享失败：' + err.message);
      }
    } else {
      if (cameraTrack) {
        await sender.replaceTrack(cameraTrack);
        localVideo.srcObject = localStream;
        sharing = false;
        screenBtn.textContent = '🖥 切换屏幕共享';
        append('[op] 已切回摄像头');
      }
    }
  });

  /** 截图 —— 演示从 video 抓取 Canvas */
  shotBtn.addEventListener('click', () => {
    if (!remoteVideo.videoWidth) {
      append('⚠️ 远端尚无画面');
      return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = remoteVideo.videoWidth;
    canvas.height = remoteVideo.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(remoteVideo, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = url;
    img.title = '点击下载';
    img.addEventListener('click', () => {
      const a = document.createElement('a');
      a.href = url;
      a.download = `snapshot-${Date.now()}.png`;
      a.click();
    });
    shotsBox.appendChild(img);
    append('[op] 已截取一帧');
  });

  /** 挂断 —— 释放资源 */
  hangBtn.addEventListener('click', () => {
    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStream = null;
    }
    if (pcA) {
      pcA.close();
      pcA = null;
    }
    if (pcB) {
      pcB.close();
      pcB = null;
    }
    localVideo.srcObject = null;
    remoteVideo.srcObject = null;
    localMeta.textContent = '已挂断';
    remoteMeta.textContent = '已挂断';
    localMeta.classList.remove('live');
    remoteMeta.classList.remove('live');
    setRunning(false);
    sharing = false;
    cameraTrack = null;
    append('[op] 通话已结束，资源已释放');
  });
})();

/* =====================================================
 * 20. 进阶：多人会议 SFU 架构模拟
 *    - SfuHub：纯 JS 类模拟中转服务器（真实部署用 mediasoup / Janus / LiveKit）
 *    - Participant：参会者（我 / 机器人），各自拥有独立 <video> 或 <canvas>
 *    - 上行带宽恒定为 1 份（上传到 SFU），下行 = 订阅人数，体现 SFU 优势
 * ===================================================== */
(function initSfuMeeting() {
  const grid = document.getElementById('sfuGrid');
  const log = document.getElementById('sfuLog');
  const stat = document.getElementById('sfuStat');
  const bwUp = document.getElementById('bwUp');
  const bwDown = document.getElementById('bwDown');
  const bwFanout = document.getElementById('bwFanout');
  const joinBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('sfuJoinSelf')
  );
  const addBotBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('sfuAddBot')
  );
  const kickBotBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('sfuKickBot')
  );
  const muteAllBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('sfuMuteAll')
  );
  const shareBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('sfuShareScreen')
  );
  const leaveBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('sfuLeave')
  );

  if (
    !grid ||
    !log ||
    !stat ||
    !bwUp ||
    !bwDown ||
    !bwFanout ||
    !joinBtn ||
    !addBotBtn ||
    !kickBotBtn ||
    !muteAllBtn ||
    !shareBtn ||
    !leaveBtn
  ) {
    return;
  }

  /** 单路视频假设码率 1.2 Mbps */
  const BITRATE = 1.2;

  /**
   * @typedef {{
   *   id: string,
   *   name: string,
   *   stream: MediaStream | null,
   *   kind: 'me' | 'bot',
   *   micOn: boolean,
   *   camOn: boolean,
   * }} Peer
   */

  /** 简易事件总线 */
  class EventBus {
    constructor() {
      /** @type {Record<string, Function[]>} */
      this.map = {};
    }
    on(ev, fn) {
      (this.map[ev] ||= []).push(fn);
    }
    emit(ev, ...args) {
      (this.map[ev] || []).forEach((fn) => fn(...args));
    }
  }

  /**
   * 模拟 SFU 服务器：
   *  - publish(peer)：参会者上传一份流
   *  - unpublish(id)：离开
   *  - subscribe 由订阅者直接从 peers 读取（真实 SFU 会走 ontrack 单独下发）
   */
  class SfuHub extends EventBus {
    constructor() {
      super();
      /** @type {Map<string, Peer>} */
      this.peers = new Map();
    }
    publish(peer) {
      this.peers.set(peer.id, peer);
      this.emit('peer-join', peer);
      this.emit('roster', [...this.peers.values()]);
    }
    unpublish(id) {
      const p = this.peers.get(id);
      if (!p) return;
      this.peers.delete(id);
      this.emit('peer-leave', p);
      this.emit('roster', [...this.peers.values()]);
    }
    list() {
      return [...this.peers.values()];
    }
  }

  const hub = new SfuHub();

  const writeLog = (msg) => {
    const t = new Date().toLocaleTimeString();
    log.textContent += `[${t}] ${msg}\n`;
    log.scrollTop = log.scrollHeight;
  };

  /**
   * 为"机器人"参会者生成一条伪摄像头流：
   * 用 Canvas 画动画，然后 captureStream 成 MediaStream
   */
  const makeBotStream = (seed) => {
    const canvas = document.createElement('canvas');
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new MediaStream();

    const hue = (seed * 57) % 360;
    let t = 0;
    const draw = () => {
      t += 0.02;
      // 背景渐变
      const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      g.addColorStop(0, `hsl(${hue}, 70%, 28%)`);
      g.addColorStop(1, `hsl(${(hue + 60) % 360}, 70%, 18%)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 头像圆
      const cx = canvas.width / 2 + Math.sin(t) * 12;
      const cy = canvas.height / 2 + Math.cos(t * 0.7) * 8;
      ctx.beginPath();
      ctx.arc(cx, cy, 48, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${hue}, 80%, 60%)`;
      ctx.fill();

      // 文字
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`Bot #${seed}`, canvas.width / 2, canvas.height - 24);
      ctx.font = '12px Menlo';
      ctx.fillText('SFU downlink', canvas.width / 2, canvas.height - 8);

      requestAnimationFrame(draw);
    };
    draw();
    return canvas.captureStream(24);
  };

  /** @type {Peer | null} */
  let me = null;
  /** 当前我的流（可能来自摄像头或屏幕） */
  /** @type {MediaStream | null} */
  let myStream = null;
  /** @type {MediaStreamTrack | null} */
  let myCamTrack = null;
  let botSeed = 0;
  let screenSharing = false;
  let allMuted = false;

  /**
   * 重新渲染网格：每次成员变化都清空并重建 tile
   * 真实 SFU 场景：只为新加入者创建 tile，移除离开者 tile，这里为演示简便全量重绘
   */
  const renderGrid = () => {
    const peers = hub.list();
    grid.innerHTML = '';
    peers.forEach((p) => {
      const tile = document.createElement('div');
      tile.className = 'sfu-tile';
      if (p.kind === 'me') tile.classList.add('me');

      // 下发视频元素
      const video = document.createElement('video');
      video.autoplay = true;
      video.playsInline = true;
      video.muted = true; // 演示页避免回声
      if (p.stream) video.srcObject = p.stream;
      tile.appendChild(video);

      const name = document.createElement('div');
      name.className = 'sfu-name';
      name.textContent = p.name + (p.kind === 'me' ? ' (我)' : '');
      tile.appendChild(name);

      if (!p.micOn) {
        const badge = document.createElement('div');
        badge.className = 'sfu-badge mic-off';
        badge.textContent = '🔇';
        tile.appendChild(badge);
      }
      grid.appendChild(tile);
    });
    updateStat();
  };

  const updateStat = () => {
    const n = hub.list().length;
    stat.textContent = me ? `会议中 · ${n} 人在线` : '未在会议中';
    const down = me ? Math.max(0, n - 1) * BITRATE : 0;
    const up = me ? BITRATE : 0;
    const fanout = n * Math.max(0, n - 1) * BITRATE; // SFU 总下发 = 每人发给其他所有人
    bwUp.textContent = `${up.toFixed(1)} Mbps`;
    bwDown.textContent = `${down.toFixed(1)} Mbps`;
    bwFanout.textContent = `${fanout.toFixed(1)} Mbps`;
  };

  hub.on('peer-join', (p) => writeLog(`🟢 ${p.name} 加入房间（publish）`));
  hub.on('peer-leave', (p) => writeLog(`🔴 ${p.name} 离开（unpublish）`));
  hub.on('roster', () => renderGrid());

  /** 我加入会议：真实采集摄像头并推送到 Hub */
  joinBtn.addEventListener('click', async () => {
    if (me) return;
    joinBtn.textContent = '⏳ 请求权限中...';
    try {
      myStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: true,
      });
      myCamTrack = myStream.getVideoTracks()[0] || null;
      me = {
        id: 'me-' + Date.now(),
        name: 'Me',
        stream: myStream,
        kind: 'me',
        micOn: true,
        camOn: true,
      };
      hub.publish(me);
      writeLog('✅ 已加入会议，已上传 1 路本地流');
      joinBtn.disabled = true;
      addBotBtn.disabled = false;
      kickBotBtn.disabled = false;
      muteAllBtn.disabled = false;
      shareBtn.disabled = false;
      leaveBtn.disabled = false;
      joinBtn.textContent = '🎤 我加入会议';
    } catch (err) {
      writeLog('❌ 加入失败：' + err.message);
      joinBtn.textContent = '🎤 我加入会议';
    }
  });

  /** 增加机器人参会者 */
  addBotBtn.addEventListener('click', () => {
    botSeed += 1;
    /** @type {Peer} */
    const bot = {
      id: 'bot-' + botSeed,
      name: `Bot #${botSeed}`,
      stream: makeBotStream(botSeed),
      kind: 'bot',
      micOn: Math.random() > 0.3,
      camOn: true,
    };
    hub.publish(bot);
  });

  /** 踢掉最后一个机器人 */
  kickBotBtn.addEventListener('click', () => {
    const bots = hub.list().filter((p) => p.kind === 'bot');
    const last = bots[bots.length - 1];
    if (last) hub.unpublish(last.id);
  });

  /** 全员静音切换（仅影响展示） */
  muteAllBtn.addEventListener('click', () => {
    allMuted = !allMuted;
    hub.list().forEach((p) => {
      p.micOn = !allMuted;
    });
    muteAllBtn.textContent = allMuted ? '🔊 解除全员静音' : '🔇 全员静音';
    writeLog(allMuted ? '主持人已全员静音' : '已解除全员静音');
    renderGrid();
  });

  /** 屏幕共享广播 —— 把我的 video 轨道换成屏幕轨道 */
  shareBtn.addEventListener('click', async () => {
    if (!me || !myStream) return;
    if (!screenSharing) {
      try {
        const display = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = display.getVideoTracks()[0];

        // 用屏幕轨道替换当前 video 轨道
        const oldTracks = myStream.getVideoTracks();
        oldTracks.forEach((t) => myStream.removeTrack(t));
        myStream.addTrack(screenTrack);

        screenSharing = true;
        shareBtn.textContent = '🖥 停止共享';
        writeLog('📢 开始广播屏幕，所有订阅者会自动收到新轨道');

        screenTrack.onended = () => {
          if (screenSharing) stopShare();
        };
        renderGrid();
      } catch (err) {
        writeLog('❌ 屏幕共享失败：' + err.message);
      }
    } else {
      stopShare();
    }
  });

  const stopShare = () => {
    if (!myStream || !myCamTrack) return;
    myStream.getVideoTracks().forEach((t) => {
      t.stop();
      myStream.removeTrack(t);
    });
    myStream.addTrack(myCamTrack);
    screenSharing = false;
    shareBtn.textContent = '🖥 广播屏幕';
    writeLog('📢 已停止屏幕广播，恢复摄像头');
    renderGrid();
  };

  /** 离开会议 —— 清理自己 + 所有 bot */
  leaveBtn.addEventListener('click', () => {
    if (!me) return;
    if (myStream) {
      myStream.getTracks().forEach((t) => t.stop());
      myStream = null;
    }
    hub.list().forEach((p) => hub.unpublish(p.id));
    me = null;
    myCamTrack = null;
    screenSharing = false;
    botSeed = 0;
    writeLog('🚪 已离开会议，所有资源释放');
    joinBtn.disabled = false;
    addBotBtn.disabled = true;
    kickBotBtn.disabled = true;
    muteAllBtn.disabled = true;
    shareBtn.disabled = true;
    leaveBtn.disabled = true;
    updateStat();
  });

  // 初始化
  updateStat();
})();

/* =====================================================
 * 21. 小程序模拟器
 *    - 模拟原生小程序「双线程」：data 在 AppService，视图通过 setData 驱动
 *    - 提供 wx.* 常用 API：setData/showToast/showModal/request/setStorageSync/...
 *    - 3 个 Tab 页面：home / list / me
 * ===================================================== */
(function initMiniProgram() {
  const viewport = document.getElementById('mpViewport');
  const pagesBox = document.getElementById('mpPages');
  const tabbar = document.getElementById('mpTabbar');
  const navTitle = document.getElementById('mpNavTitle');
  const timeEl = document.getElementById('mpTime');
  const refresh = document.getElementById('mpRefresh');
  const logBox = document.getElementById('mpLog');
  const clearBtn = document.getElementById('mpClear');

  if (
    !viewport ||
    !pagesBox ||
    !tabbar ||
    !navTitle ||
    !timeEl ||
    !refresh ||
    !logBox ||
    !clearBtn
  ) {
    return;
  }

  /* -------- 控制台 -------- */
  /**
   * @param {string} msg
   * @param {'life' | 'data' | 'api' | 'err'} type
   */
  const log = (msg, type = 'api') => {
    const t = new Date().toLocaleTimeString();
    const line = document.createElement('span');
    line.className = 'mp-log-' + type;
    line.textContent = `[${t}] ${msg}\n`;
    logBox.appendChild(line);
    logBox.scrollTop = logBox.scrollHeight;
  };
  clearBtn.addEventListener('click', () => (logBox.textContent = ''));

  /* -------- 状态栏时间 -------- */
  const setTime = () => {
    const d = new Date();
    timeEl.textContent =
      String(d.getHours()).padStart(2, '0') +
      ':' +
      String(d.getMinutes()).padStart(2, '0');
  };
  setTime();
  setInterval(setTime, 30 * 1000);

  /* =====================================================
   * 模拟 wx.* API —— 体现小程序 API 风格
   * ===================================================== */

  /** toast 层（复用 DOM） */
  const toast = document.createElement('div');
  toast.className = 'mp-toast';
  viewport.appendChild(toast);

  /** modal 层（复用 DOM） */
  const modal = document.createElement('div');
  modal.className = 'mp-modal';
  modal.innerHTML = `
    <div class="mp-modal-box">
      <div class="mp-modal-body">
        <h4></h4><p></p>
      </div>
      <div class="mp-modal-actions">
        <button data-act="cancel">取消</button>
        <button data-act="ok">确定</button>
      </div>
    </div>`;
  viewport.appendChild(modal);

  const wx = {
    /** 轻提示 */
    showToast({ title = '', icon = 'success', duration = 1500 }) {
      log(`wx.showToast(${title})`, 'api');
      const iconMap = { success: '✅', error: '❌', loading: '⏳', none: '' };
      toast.innerHTML = `
        ${icon !== 'none' ? `<span class="mp-toast-icon">${iconMap[icon] || '✅'}</span>` : ''}
        <span>${title}</span>`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), duration);
    },

    /** 模态对话框 */
    showModal({ title = '提示', content = '', showCancel = true }) {
      log(`wx.showModal(${title})`, 'api');
      modal.querySelector('h4').textContent = title;
      modal.querySelector('p').textContent = content;
      modal.querySelector('[data-act="cancel"]').style.display = showCancel
        ? ''
        : 'none';
      modal.classList.add('show');
      return new Promise((resolve) => {
        modal.querySelectorAll('button').forEach((btn) => {
          btn.onclick = () => {
            const confirm = btn.dataset.act === 'ok';
            modal.classList.remove('show');
            log(`  ↳ 用户${confirm ? '确认' : '取消'}`, 'data');
            resolve({ confirm, cancel: !confirm });
          };
        });
      });
    },

    /** 本地存储 */
    setStorageSync(key, val) {
      log(`wx.setStorageSync(${key})`, 'api');
      try {
        localStorage.setItem('mp_' + key, JSON.stringify(val));
      } catch (e) {
        log('存储失败：' + e.message, 'err');
      }
    },
    getStorageSync(key) {
      const v = localStorage.getItem('mp_' + key);
      try {
        return v ? JSON.parse(v) : '';
      } catch {
        return v || '';
      }
    },

    /** 模拟请求 */
    request({ url, success }) {
      log(`wx.request(${url})`, 'api');
      setTimeout(() => {
        const data = {
          code: 0,
          list: Array.from({ length: 6 }).map((_, i) => ({
            id: i + 1,
            name: ['🍎 红富士苹果', '🍊 赣南脐橙', '🥭 海南芒果', '🍇 阳光玫瑰', '🍓 丹东草莓', '🍑 平谷水蜜桃'][i],
            price: (Math.random() * 20 + 10).toFixed(2),
          })),
        };
        log(`  ↳ 200 OK · ${data.list.length} 条`, 'data');
        success && success({ data, statusCode: 200 });
      }, 600);
    },

    /** 路由：TabBar 切换 */
    switchTab({ url }) {
      log(`wx.switchTab(${url})`, 'api');
      const name = url.replace('/pages/', '').replace(/\/.*/, '');
      switchTo(name);
    },

    /** 下拉刷新结束 */
    stopPullDownRefresh() {
      log('wx.stopPullDownRefresh()', 'api');
      refresh.classList.remove('show');
      refresh.textContent = '↓ 下拉刷新';
    },
  };

  /* =====================================================
   * 页面基类：模拟 Page({ data, onLoad, onShow, onPullDownRefresh, methods... })
   * ===================================================== */

  /**
   * @typedef {{
   *   name: string,
   *   title: string,
   *   data: Record<string, any>,
   *   el: HTMLElement,
   *   render: (data: any, ctx: PageCtx) => void,
   *   onLoad?: (ctx: PageCtx) => void,
   *   onShow?: (ctx: PageCtx) => void,
   *   onPullDownRefresh?: (ctx: PageCtx) => void,
   *   loaded?: boolean,
   * }} PageCtx
   */

  /** @type {Record<string, PageCtx>} */
  const pages = {};

  /**
   * setData：合并数据后重新渲染（模拟跨线程通信）
   * 真实小程序这里是把 diff 后的数据序列化 → 跨线程 postMessage → 渲染层 patch DOM
   * @param {PageCtx} ctx
   * @param {Record<string, any>} patch
   */
  const setData = (ctx, patch) => {
    const keys = Object.keys(patch);
    Object.assign(ctx.data, patch);
    log(`setData(${ctx.name}) → ${keys.join(', ')}`, 'data');
    ctx.render(ctx.data, ctx);
  };

  /**
   * 注册页面
   * @param {Omit<PageCtx, 'el' | 'loaded'>} def
   */
  const definePage = (def) => {
    const el = document.createElement('div');
    el.className = 'mp-page';
    el.id = 'mp-page-' + def.name;
    pagesBox.appendChild(el);
    const ctx = /** @type {PageCtx} */ ({ ...def, el, loaded: false });
    ctx.setData = (patch) => setData(ctx, patch);
    pages[def.name] = ctx;
  };

  /** 当前页面 */
  let current = 'home';

  const switchTo = (name) => {
    if (!pages[name]) return;
    current = name;
    Object.values(pages).forEach((p) => p.el.classList.toggle('active', p.name === name));
    navTitle.textContent = pages[name].title;
    // tabBar 状态
    tabbar.querySelectorAll('.mp-tab').forEach((t) => {
      t.classList.toggle('active', t.getAttribute('data-page') === name);
    });
    const ctx = pages[name];
    if (!ctx.loaded) {
      log(`页面 ${name} onLoad`, 'life');
      ctx.loaded = true;
      ctx.onLoad && ctx.onLoad(ctx);
    }
    log(`页面 ${name} onShow`, 'life');
    ctx.onShow && ctx.onShow(ctx);
    viewport.scrollTop = 0;
  };

  /* -------- TabBar 点击 -------- */
  tabbar.querySelectorAll('.mp-tab').forEach((t) => {
    t.addEventListener('click', () => {
      const name = t.getAttribute('data-page');
      if (name && name !== current) switchTo(name);
    });
  });

  /* =====================================================
   * 页面 1：home —— 计数器 + Toast + Modal + Storage
   * ===================================================== */
  definePage({
    name: 'home',
    title: '首页',
    data: { count: Number(wx.getStorageSync('count') || 0), title: '你好，小程序！' },
    render(data, ctx) {
      ctx.el.innerHTML = `
        <div class="mp-card">
          <h4>${data.title} <span class="mp-badge">WXML</span></h4>
          <p>这是由 <code>setData</code> 驱动渲染的页面。点击按钮观察右侧日志：每次点击都会触发一次"逻辑层 → 渲染层"的通信。</p>
          <p style="margin-top:10px;font-size:22px;color:#6c8cff;font-weight:700">
            点击次数：${data.count}
          </p>
          <button class="mp-btn" data-act="add">+1</button>
          <button class="mp-btn ghost" data-act="toast">showToast</button>
          <button class="mp-btn ghost" data-act="modal">showModal</button>
          <button class="mp-btn ghost" data-act="reset">清零</button>
        </div>
        <div class="mp-card">
          <h4>💡 生命周期日志</h4>
          <p>切换页面 / 下拉刷新 / 点击按钮，可在右侧控制台查看 onLoad / onShow / setData 实时输出。</p>
        </div>`;
      ctx.el.querySelectorAll('button').forEach((b) => {
        b.addEventListener('click', () => {
          const act = b.getAttribute('data-act');
          if (act === 'add') {
            const next = data.count + 1;
            ctx.setData({ count: next });
            wx.setStorageSync('count', next);
          } else if (act === 'toast') {
            wx.showToast({ title: '操作成功', icon: 'success' });
          } else if (act === 'modal') {
            wx.showModal({
              title: '确认操作',
              content: '是否清空本地存储的计数器？',
            }).then((res) => {
              if (res.confirm) {
                wx.setStorageSync('count', 0);
                ctx.setData({ count: 0 });
                wx.showToast({ title: '已清空', icon: 'success' });
              }
            });
          } else if (act === 'reset') {
            ctx.setData({ count: 0 });
            wx.setStorageSync('count', 0);
          }
        });
      });
    },
  });

  /* =====================================================
   * 页面 2：list —— 列表 + 下拉刷新 + 模拟 request
   * ===================================================== */
  definePage({
    name: 'list',
    title: '商品列表',
    data: { list: [], loading: true },
    render(data, ctx) {
      if (data.loading) {
        ctx.el.innerHTML = `<div class="mp-card"><p>⏳ 加载中...</p></div>`;
        return;
      }
      ctx.el.innerHTML = `
        <div class="mp-card">
          <h4>🛒 今日推荐 <span class="mp-badge">wx.request</span></h4>
          <p>下拉页面可重新请求数据</p>
        </div>
        ${data.list
          .map(
            (item) => `
          <div class="mp-list-item" data-id="${item.id}">
            <span>${item.name}</span>
            <span class="mp-price">¥ ${item.price}</span>
          </div>`
          )
          .join('')}`;
      ctx.el.querySelectorAll('.mp-list-item').forEach((it) => {
        it.addEventListener('click', () => {
          wx.showToast({
            title: '已加入购物车',
            icon: 'success',
          });
        });
      });
    },
    onLoad(ctx) {
      wx.request({
        url: '/api/goods',
        success: (res) => ctx.setData({ list: res.data.list, loading: false }),
      });
    },
    onPullDownRefresh(ctx) {
      log('页面 list onPullDownRefresh', 'life');
      ctx.setData({ loading: true });
      wx.request({
        url: '/api/goods?refresh=1',
        success: (res) => {
          ctx.setData({ list: res.data.list, loading: false });
          wx.stopPullDownRefresh();
          wx.showToast({ title: '刷新成功', icon: 'success' });
        },
      });
    },
  });

  /* =====================================================
   * 页面 3：me —— 用户中心 + 跳转 + 清缓存
   * ===================================================== */
  definePage({
    name: 'me',
    title: '我的',
    data: { nickname: '前端学习者', level: 'Lv.8' },
    render(data, ctx) {
      ctx.el.innerHTML = `
        <div class="mp-card" style="text-align:center">
          <div class="mp-avatar">🐱</div>
          <h4 style="margin:4px 0">${data.nickname}</h4>
          <p>${data.level} · 坚持学习 42 天</p>
        </div>
        <div class="mp-card">
          <h4>⚙️ 设置</h4>
          <button class="mp-btn" data-act="goList">跳转商品列表</button>
          <button class="mp-btn ghost" data-act="clear">清除本地缓存</button>
          <button class="mp-btn ghost" data-act="about">关于</button>
        </div>`;
      ctx.el.querySelectorAll('button').forEach((b) => {
        b.addEventListener('click', () => {
          const act = b.getAttribute('data-act');
          if (act === 'goList') {
            wx.switchTab({ url: '/pages/list/list' });
          } else if (act === 'clear') {
            wx.showModal({
              title: '确认',
              content: '清空所有 Storage？',
            }).then((r) => {
              if (r.confirm) {
                Object.keys(localStorage)
                  .filter((k) => k.startsWith('mp_'))
                  .forEach((k) => localStorage.removeItem(k));
                wx.showToast({ title: '已清空', icon: 'success' });
              }
            });
          } else if (act === 'about') {
            wx.showModal({
              title: '关于本模拟器',
              content:
                '这是一个纯浏览器实现的小程序模拟器，展示双线程通信、setData 渲染、wx.* API 等核心概念。',
              showCancel: false,
            });
          }
        });
      });
    },
  });

  /* =====================================================
   * 下拉刷新：viewport 滚动到顶部再往上拖
   * ===================================================== */
  let startY = 0;
  let pulling = false;
  viewport.addEventListener(
    'touchstart',
    (e) => {
      if (viewport.scrollTop === 0) {
        startY = e.touches[0].clientY;
        pulling = true;
      }
    },
    { passive: true }
  );
  viewport.addEventListener(
    'touchmove',
    (e) => {
      if (!pulling) return;
      const dy = e.touches[0].clientY - startY;
      if (dy > 40) {
        refresh.classList.add('show');
        refresh.textContent = dy > 80 ? '松开刷新' : '↓ 下拉刷新';
      }
    },
    { passive: true }
  );
  viewport.addEventListener('touchend', (e) => {
    if (!pulling) return;
    pulling = false;
    const dy = (e.changedTouches[0].clientY || 0) - startY;
    if (dy > 80) {
      refresh.textContent = '⏳ 刷新中...';
      const ctx = pages[current];
      if (ctx.onPullDownRefresh) {
        ctx.onPullDownRefresh(ctx);
      } else {
        setTimeout(() => wx.stopPullDownRefresh(), 600);
      }
    } else {
      refresh.classList.remove('show');
    }
  });

  /** 桌面鼠标也能触发下拉：按住 viewport 顶部往下拖 */
  let mDown = false;
  let mStart = 0;
  viewport.addEventListener('mousedown', (e) => {
    if (viewport.scrollTop === 0) {
      mDown = true;
      mStart = e.clientY;
    }
  });
  window.addEventListener('mousemove', (e) => {
    if (!mDown) return;
    const dy = e.clientY - mStart;
    if (dy > 40) {
      refresh.classList.add('show');
      refresh.textContent = dy > 80 ? '松开刷新' : '↓ 下拉刷新';
    }
  });
  window.addEventListener('mouseup', (e) => {
    if (!mDown) return;
    const dy = e.clientY - mStart;
    mDown = false;
    if (dy > 80) {
      refresh.textContent = '⏳ 刷新中...';
      const ctx = pages[current];
      if (ctx.onPullDownRefresh) ctx.onPullDownRefresh(ctx);
      else setTimeout(() => wx.stopPullDownRefresh(), 600);
    } else {
      refresh.classList.remove('show');
    }
  });

  /* -------- 启动：App onLaunch + 首页 onLoad/onShow -------- */
  log('App onLaunch', 'life');
  log('App onShow', 'life');
  switchTo('home');
})();

/* =====================================================
 * 22. WebRTC 深度：DataChannel 聊天 + 文件传输
 * ===================================================== */
(function initDataChannel() {
  const logA = document.getElementById('dcLogA');
  const logB = document.getElementById('dcLogB');
  const inputA = /** @type {HTMLInputElement | null} */ (
    document.getElementById('dcInputA')
  );
  const inputB = /** @type {HTMLInputElement | null} */ (
    document.getElementById('dcInputB')
  );
  const sendA = document.getElementById('dcSendA');
  const sendB = document.getElementById('dcSendB');
  const fileA = /** @type {HTMLInputElement | null} */ (
    document.getElementById('dcFileA')
  );
  const fileB = /** @type {HTMLInputElement | null} */ (
    document.getElementById('dcFileB')
  );
  const progress = document.getElementById('dcProgress');

  if (
    !logA ||
    !logB ||
    !inputA ||
    !inputB ||
    !sendA ||
    !sendB ||
    !fileA ||
    !fileB ||
    !progress
  ) {
    return;
  }

  /** 打印消息 */
  const append = (el, text, cls, onClick) => {
    const div = document.createElement('div');
    div.className = 'msg ' + cls;
    div.textContent = text;
    if (onClick) {
      div.classList.add('file');
      div.addEventListener('click', onClick);
    }
    el.appendChild(div);
    el.scrollTop = el.scrollHeight;
  };

  // 同页面本地回环 PeerConnection
  const pcA = new RTCPeerConnection();
  const pcB = new RTCPeerConnection();

  pcA.onicecandidate = (e) => e.candidate && pcB.addIceCandidate(e.candidate);
  pcB.onicecandidate = (e) => e.candidate && pcA.addIceCandidate(e.candidate);

  // A 主动建 DataChannel
  const dcA = pcA.createDataChannel('app', { ordered: true });
  /** @type {RTCDataChannel | null} */
  let dcB = null;
  pcB.ondatachannel = (e) => {
    dcB = e.channel;
    dcB.binaryType = 'arraybuffer';
    bindChannel(dcB, logB, 'Bob');
  };
  dcA.binaryType = 'arraybuffer';
  bindChannel(dcA, logA, 'Alice');

  // 建立连接
  (async () => {
    const offer = await pcA.createOffer();
    await pcA.setLocalDescription(offer);
    await pcB.setRemoteDescription(offer);
    const ans = await pcB.createAnswer();
    await pcB.setLocalDescription(ans);
    await pcA.setRemoteDescription(ans);
  })();

  /**
   * 文件传输协议：
   *  第一条：JSON 头 { __file: true, name, size, mime }
   *  之后：二进制分片（16KB）
   *  结束：{ __file: 'end' }
   */
  const CHUNK = 16 * 1024;

  /** 缓存正在接收的文件 */
  const recvBuf = new WeakMap();

  function bindChannel(dc, logEl, owner) {
    dc.onopen = () => append(logEl, `[${owner}] 通道已建立 ✅`, 'sys');
    dc.onclose = () => append(logEl, `[${owner}] 通道已关闭`, 'sys');
    dc.onmessage = (e) => {
      const data = e.data;
      if (typeof data === 'string') {
        let msg;
        try {
          msg = JSON.parse(data);
        } catch {
          append(logEl, '← ' + data, 'peer');
          return;
        }
        if (msg.__file === true) {
          recvBuf.set(dc, { meta: msg, chunks: [], received: 0 });
          append(logEl, `📥 开始接收文件：${msg.name} (${(msg.size / 1024).toFixed(1)} KB)`, 'sys');
        } else if (msg.__file === 'end') {
          const buf = recvBuf.get(dc);
          if (!buf) return;
          const blob = new Blob(buf.chunks, { type: buf.meta.mime });
          const url = URL.createObjectURL(blob);
          append(logEl, `📎 [下载] ${buf.meta.name}`, 'peer', () => {
            const a = document.createElement('a');
            a.href = url;
            a.download = buf.meta.name;
            a.click();
          });
          recvBuf.delete(dc);
          progress.textContent = '';
        } else {
          append(logEl, '← ' + data, 'peer');
        }
      } else {
        // 二进制分片
        const buf = recvBuf.get(dc);
        if (!buf) return;
        buf.chunks.push(data);
        buf.received += data.byteLength;
        progress.textContent = `接收中：${buf.meta.name} · ${(
          (buf.received / buf.meta.size) *
          100
        ).toFixed(1)}%`;
      }
    };
  }

  /**
   * 发送文件，自动分片
   * @param {RTCDataChannel} dc
   * @param {File} file
   * @param {HTMLElement} logEl
   */
  const sendFile = async (dc, file, logEl) => {
    if (dc.readyState !== 'open') return;
    dc.send(
      JSON.stringify({
        __file: true,
        name: file.name,
        size: file.size,
        mime: file.type || 'application/octet-stream',
      })
    );
    append(logEl, `📤 发送文件：${file.name}`, 'me');

    let offset = 0;
    while (offset < file.size) {
      // 背压：DataChannel 缓冲区过大时暂停
      if (dc.bufferedAmount > 4 * CHUNK) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((r) => setTimeout(r, 10));
        continue;
      }
      const slice = file.slice(offset, offset + CHUNK);
      // eslint-disable-next-line no-await-in-loop
      const ab = await slice.arrayBuffer();
      dc.send(ab);
      offset += ab.byteLength;
      progress.textContent = `发送中：${file.name} · ${(
        (offset / file.size) *
        100
      ).toFixed(1)}%`;
    }
    dc.send(JSON.stringify({ __file: 'end' }));
    progress.textContent = `✅ 已发送 ${file.name}`;
    setTimeout(() => (progress.textContent = ''), 2000);
  };

  const sendText = (dc, input, logEl) => {
    const v = input.value.trim();
    if (!v || dc.readyState !== 'open') return;
    dc.send(v);
    append(logEl, '→ ' + v, 'me');
    input.value = '';
  };

  sendA.addEventListener('click', () => sendText(dcA, inputA, logA));
  sendB.addEventListener('click', () => dcB && sendText(dcB, inputB, logB));
  inputA.addEventListener('keydown', (e) => e.key === 'Enter' && sendText(dcA, inputA, logA));
  inputB.addEventListener('keydown', (e) => e.key === 'Enter' && dcB && sendText(dcB, inputB, logB));

  fileA.addEventListener('change', () => {
    if (fileA.files && fileA.files[0]) sendFile(dcA, fileA.files[0], logA);
    fileA.value = '';
  });
  fileB.addEventListener('change', () => {
    if (dcB && fileB.files && fileB.files[0]) sendFile(dcB, fileB.files[0], logB);
    fileB.value = '';
  });
})();

/* =====================================================
 * 23. WebRTC 深度：getStats 实时质量监控 + Canvas 折线图
 * ===================================================== */
(function initRtcStats() {
  const startBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('statsStart')
  );
  const stopBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('statsStop')
  );
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('statsChart')
  );
  const sRtt = document.getElementById('sRtt');
  const sLoss = document.getElementById('sLoss');
  const sJitter = document.getElementById('sJitter');
  const sBitrate = document.getElementById('sBitrate');
  const sFps = document.getElementById('sFps');
  const sSize = document.getElementById('sSize');

  if (
    !startBtn ||
    !stopBtn ||
    !canvas ||
    !sRtt ||
    !sLoss ||
    !sJitter ||
    !sBitrate ||
    !sFps ||
    !sSize
  ) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  /** @type {number[]} */
  const bitrateHistory = [];
  /** @type {number[]} */
  const rttHistory = [];
  const MAX = 60;

  const drawChart = () => {
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // 网格
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = (rect.height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(rect.width, y);
      ctx.stroke();
    }

    /** @param {number[]} arr, color, max */
    const drawLine = (arr, color, max) => {
      if (arr.length < 2) return;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      arr.forEach((v, i) => {
        const x = (i / (MAX - 1)) * rect.width;
        const y = rect.height - (v / max) * rect.height * 0.9 - 4;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    };

    const maxBR = Math.max(1000, ...bitrateHistory);
    const maxRT = Math.max(200, ...rttHistory);
    drawLine(bitrateHistory, '#6c8cff', maxBR);
    drawLine(rttHistory, '#25d4a8', maxRT);

    // 图例
    ctx.fillStyle = '#6c8cff';
    ctx.fillRect(10, 10, 10, 3);
    ctx.fillStyle = '#9aa3c7';
    ctx.font = '11px Menlo';
    ctx.fillText('Bitrate (kbps)', 26, 14);
    ctx.fillStyle = '#25d4a8';
    ctx.fillRect(140, 10, 10, 3);
    ctx.fillStyle = '#9aa3c7';
    ctx.fillText('RTT (ms)', 156, 14);
  };

  /** @type {number | null} */
  let timer = null;
  /** 上次采样时的字节数，用来算瞬时带宽 */
  let lastBytes = 0;
  let lastTs = 0;
  let lastPacketsLost = 0;
  let lastPacketsReceived = 0;

  /** 执行一次采样 */
  const sample = async () => {
    const pc = window.__rtc && window.__rtc.getPcB && window.__rtc.getPcB();
    if (!pc) {
      sRtt.textContent = '未连接';
      return;
    }
    const report = await pc.getStats();
    let rtt = 0;
    let jitter = 0;
    let bitrate = 0;
    let fps = 0;
    let size = '--';
    let lossRate = 0;

    report.forEach((r) => {
      if (r.type === 'candidate-pair' && r.state === 'succeeded' && r.nominated) {
        if (typeof r.currentRoundTripTime === 'number') {
          rtt = r.currentRoundTripTime * 1000;
        }
      }
      if (r.type === 'inbound-rtp' && r.kind === 'video') {
        jitter = (r.jitter || 0) * 1000;
        if (typeof r.framesPerSecond === 'number') fps = r.framesPerSecond;
        if (r.frameWidth && r.frameHeight) size = `${r.frameWidth}×${r.frameHeight}`;
        // bitrate
        const bytes = r.bytesReceived || 0;
        const ts = r.timestamp || Date.now();
        if (lastTs && ts > lastTs) {
          bitrate = ((bytes - lastBytes) * 8) / ((ts - lastTs) / 1000) / 1000;
        }
        lastBytes = bytes;
        lastTs = ts;
        // 丢包
        const lost = r.packetsLost || 0;
        const recv = r.packetsReceived || 0;
        const dLost = lost - lastPacketsLost;
        const dRecv = recv - lastPacketsReceived;
        if (dRecv + dLost > 0) lossRate = (dLost / (dRecv + dLost)) * 100;
        lastPacketsLost = lost;
        lastPacketsReceived = recv;
      }
    });

    sRtt.textContent = rtt ? rtt.toFixed(1) + ' ms' : '-- ms';
    sLoss.textContent = lossRate.toFixed(2) + ' %';
    sJitter.textContent = jitter.toFixed(1) + ' ms';
    sBitrate.textContent = bitrate.toFixed(0) + ' kbps';
    sFps.textContent = fps ? fps.toFixed(0) : '--';
    sSize.textContent = size;

    bitrateHistory.push(Math.max(0, bitrate));
    rttHistory.push(rtt);
    if (bitrateHistory.length > MAX) bitrateHistory.shift();
    if (rttHistory.length > MAX) rttHistory.shift();
    drawChart();
  };

  startBtn.addEventListener('click', () => {
    if (timer !== null) return;
    lastBytes = 0;
    lastTs = 0;
    lastPacketsLost = 0;
    lastPacketsReceived = 0;
    timer = window.setInterval(sample, 1000);
    startBtn.disabled = true;
    stopBtn.disabled = false;
    sample();
  });

  stopBtn.addEventListener('click', () => {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });
})();

/* =====================================================
 * 25. 现代 Web API 能力检测与实战
 * ===================================================== */
(function initModernApis() {
  /** 写入徽章：api-ok / api-no */
  /**
   * @param {string} name
   * @param {boolean} supported
   * @param {string} [label]
   */
  const setSupport = (name, supported, label) => {
    document
      .querySelectorAll(`.api-support[data-api="${name}"]`)
      .forEach((el) => {
        el.textContent = label || (supported ? '✅ 支持' : '❌ 未支持');
        el.classList.add(supported ? 'api-ok' : 'api-no');
      });
  };

  /** 简便的 out 写入 */
  const out = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  /* ========== 能力矩阵检测 ========== */
  const w = /** @type {any} */ (window);
  const n = /** @type {any} */ (navigator);
  setSupport('webtransport', typeof w.WebTransport === 'function');
  setSupport('webcodecs', typeof w.VideoEncoder === 'function');
  setSupport('locks', !!(n.locks && n.locks.request));
  setSupport('payment', typeof w.PaymentRequest === 'function');
  setSupport('webauthn', !!(n.credentials && n.credentials.create));
  setSupport('filehandling', 'launchQueue' in w);
  setSupport('idle', typeof w.IdleDetector === 'function');
  setSupport('hid', !!n.hid);
  setSupport('serial', !!n.serial);
  setSupport('midi', typeof n.requestMIDIAccess === 'function');
  setSupport('xr', !!n.xr);

  /* ========== WebTransport 检测 ========== */
  const wtBtn = document.getElementById('wtCheck');
  if (wtBtn) {
    wtBtn.addEventListener('click', () => {
      if (typeof w.WebTransport === 'function') {
        out(
          'wtOut',
          '✅ 可用 · 需要 HTTP/3 服务端。示例：new WebTransport("https://your-h3-server/wt")'
        );
      } else {
        out('wtOut', '❌ 当前浏览器未支持（Chrome 97+ / Edge 97+）');
      }
    });
  }

  /* ========== WebCodecs 列出支持的编码器 ========== */
  const wcBtn = document.getElementById('wcCheck');
  if (wcBtn) {
    wcBtn.addEventListener('click', async () => {
      if (typeof w.VideoEncoder !== 'function') {
        out('wcOut', '❌ 当前浏览器未支持 WebCodecs');
        return;
      }
      const codecs = [
        'avc1.42E01E', // H.264 Baseline
        'avc1.64001F', // H.264 High
        'vp8',
        'vp09.00.10.08', // VP9
        'av01.0.01M.08', // AV1
        'hev1.1.6.L93.B0', // HEVC
      ];
      const results = [];
      for (const codec of codecs) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const r = await w.VideoEncoder.isConfigSupported({
            codec,
            width: 1280,
            height: 720,
          });
          results.push(`${r.supported ? '✅' : '❌'}  ${codec}`);
        } catch {
          results.push(`❌  ${codec}`);
        }
      }
      out('wcOut', results.join('\n'));
    });
  }

  /* ========== WASM 跑分 ========== */
  const wasmBtn = document.getElementById('wasmRun');
  if (wasmBtn) {
    wasmBtn.addEventListener('click', async () => {
      out('wasmOut', '⏳ 编译 WASM 中...');

      // 手写 WAT -> wasm bytes：导出 fib(n) 函数
      // (module (func (export "fib") (param $n i32) (result i32)
      //   local.get $n
      //   i32.const 2
      //   i32.lt_s
      //   if (result i32)
      //     local.get $n
      //   else
      //     local.get $n i32.const 1 i32.sub call 0
      //     local.get $n i32.const 2 i32.sub call 0
      //     i32.add
      //   end))
      // prettier-ignore
      const wasmBytes = new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0,
        1, 6, 1, 96, 1, 127, 1, 127,
        3, 2, 1, 0,
        7, 7, 1, 3, 102, 105, 98, 0, 0,
        10, 31, 1, 29, 0,
        32, 0, 65, 2, 72,
        4, 127, 32, 0,
        5,
        32, 0, 65, 1, 107, 16, 0,
        32, 0, 65, 2, 107, 16, 0,
        106,
        11, 11,
      ]);

      let wasmFib;
      try {
        const { instance } = await WebAssembly.instantiate(wasmBytes);
        wasmFib = /** @type {(n:number)=>number} */ (instance.exports.fib);
      } catch (e) {
        out('wasmOut', '❌ WASM 加载失败：' + e.message);
        return;
      }

      const N = 35;
      const jsFib = (x) => (x < 2 ? x : jsFib(x - 1) + jsFib(x - 2));

      // 预热
      jsFib(10);
      wasmFib(10);

      const t1 = performance.now();
      const r1 = jsFib(N);
      const jsCost = performance.now() - t1;

      const t2 = performance.now();
      const r2 = wasmFib(N);
      const wasmCost = performance.now() - t2;

      const ratio = (jsCost / wasmCost).toFixed(2);
      out(
        'wasmOut',
        `fib(${N}) = ${r1}\n` +
          `JS:   ${jsCost.toFixed(1)} ms\n` +
          `WASM: ${wasmCost.toFixed(1)} ms\n` +
          `WASM 快 ${ratio} 倍 ${r1 === r2 ? '（结果一致 ✅）' : '（结果不一致 ❌）'}`
      );
    });
  }

  /* ========== Web Locks：5 次并发抢同一把锁 ========== */
  const lockBtn = document.getElementById('lockRun');
  if (lockBtn) {
    lockBtn.addEventListener('click', async () => {
      if (!(n.locks && n.locks.request)) {
        out('lockOut', '❌ 当前浏览器未支持 Web Locks');
        return;
      }
      const lines = [];
      const run = (i) =>
        n.locks.request('demo-lock', async () => {
          const start = performance.now();
          lines.push(`[#${i}] 🔓 拿到锁`);
          out('lockOut', lines.join('\n'));
          await new Promise((r) => setTimeout(r, 300));
          lines.push(`[#${i}] 🔒 释放（持有 ${(performance.now() - start).toFixed(0)}ms）`);
          out('lockOut', lines.join('\n'));
        });
      lines.push('🚀 并发发起 5 个请求，观察顺序获得锁：');
      out('lockOut', lines.join('\n'));
      await Promise.all([run(1), run(2), run(3), run(4), run(5)]);
      lines.push('✅ 全部完成');
      out('lockOut', lines.join('\n'));
    });
  }

  /* ========== Payment Request ========== */
  const payBtn = document.getElementById('payRun');
  if (payBtn) {
    payBtn.addEventListener('click', async () => {
      if (typeof w.PaymentRequest !== 'function') {
        out('payOut', '❌ 未支持');
        return;
      }
      try {
        const req = new w.PaymentRequest(
          [{ supportedMethods: 'basic-card', data: { supportedNetworks: ['visa', 'mastercard'] } }],
          {
            total: {
              label: '前端全景指南 · VIP',
              amount: { currency: 'CNY', value: '99.00' },
            },
            displayItems: [
              { label: '课程', amount: { currency: 'CNY', value: '99.00' } },
            ],
          }
        );
        const canMake = await req.canMakePayment();
        if (!canMake) {
          out('payOut', '⚠️ 浏览器无可用支付方式');
          return;
        }
        const resp = await req.show();
        await resp.complete('success');
        out('payOut', '✅ 已调起原生支付面板');
      } catch (e) {
        out('payOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== WebAuthn 注册演示 ========== */
  const waBtn = document.getElementById('waRun');
  if (waBtn) {
    waBtn.addEventListener('click', async () => {
      if (!(n.credentials && n.credentials.create)) {
        out('waOut', '❌ 未支持');
        return;
      }
      try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const userId = crypto.getRandomValues(new Uint8Array(16));
        const cred = /** @type {any} */ (
          await n.credentials.create({
            publicKey: {
              challenge,
              rp: { name: '前端全景指南' },
              user: { id: userId, name: 'demo@fe.com', displayName: 'Demo User' },
              pubKeyCredParams: [
                { type: 'public-key', alg: -7 }, // ES256
                { type: 'public-key', alg: -257 }, // RS256
              ],
              authenticatorSelection: {
                userVerification: 'preferred',
              },
              timeout: 60000,
              attestation: 'none',
            },
          })
        );
        out(
          'waOut',
          '✅ 已创建凭证\nID: ' +
            cred.id.slice(0, 32) +
            '...\nType: ' +
            cred.type +
            '\n服务器应保存此凭证公钥，后续登录时验证签名即可无密码登录。'
        );
      } catch (e) {
        out('waOut', '❌ ' + e.name + ': ' + e.message);
      }
    });
  }

  /* ========== File Handling：检查是否被从文件系统拉起 ========== */
  if ('launchQueue' in w) {
    w.launchQueue.setConsumer(async (launchParams) => {
      if (!launchParams.files || launchParams.files.length === 0) return;
      const names = [];
      for (const handle of launchParams.files) {
        const file = await handle.getFile();
        names.push(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      }
      out('fhOut', '📂 从文件系统启动：\n' + names.join('\n'));
    });
    out('fhOut', '✅ 已注册 launchQueue。发布为 PWA 并在 manifest.json 配置 file_handlers 后可双击打开。');
  } else {
    out('fhOut', '❌ 当前浏览器未支持（Chrome 102+ 且需安装为 PWA）');
  }

  /* ========== Idle Detection ========== */
  const idleBtn = document.getElementById('idleRun');
  if (idleBtn) {
    idleBtn.addEventListener('click', async () => {
      if (typeof w.IdleDetector !== 'function') {
        out('idleOut', '❌ 未支持');
        return;
      }
      try {
        const state = await w.IdleDetector.requestPermission();
        if (state !== 'granted') {
          out('idleOut', '❌ 用户拒绝权限');
          return;
        }
        const detector = new w.IdleDetector();
        detector.addEventListener('change', () => {
          out(
            'idleOut',
            `用户状态: ${detector.userState} · 屏幕: ${detector.screenState}`
          );
        });
        await detector.start({ threshold: 60_000 });
        out('idleOut', '✅ 已开始监听（60s 无操作会切 idle）');
      } catch (e) {
        out('idleOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== Clipboard 高级 ========== */
  const cbWrite = document.getElementById('cbWrite');
  const cbRead = document.getElementById('cbRead');
  if (cbWrite) {
    cbWrite.addEventListener('click', async () => {
      try {
        const html = '<b style="color:#6c8cff">来自网页的富文本</b> 🎉';
        const text = '来自网页的富文本 🎉';
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([text], { type: 'text/plain' }),
          }),
        ]);
        out('cbOut', '✅ 已写入（可粘贴到富文本编辑器看效果）');
      } catch (e) {
        out('cbOut', '❌ ' + e.message);
      }
    });
  }
  if (cbRead) {
    cbRead.addEventListener('click', async () => {
      try {
        const items = await navigator.clipboard.read();
        const lines = [];
        for (const item of items) {
          lines.push(`MIME: ${item.types.join(', ')}`);
          if (item.types.includes('text/plain')) {
            const blob = await item.getType('text/plain');
            lines.push('  text: ' + (await blob.text()).slice(0, 80));
          }
          if (item.types.includes('text/html')) {
            const blob = await item.getType('text/html');
            lines.push('  html: ' + (await blob.text()).slice(0, 80));
          }
        }
        out('cbOut', lines.join('\n'));
      } catch (e) {
        out('cbOut', '❌ ' + e.message + '（需要用户手势且页面聚焦）');
      }
    });
  }

  /* ========== WebHID ========== */
  const hidBtn = document.getElementById('hidRun');
  if (hidBtn) {
    hidBtn.addEventListener('click', async () => {
      if (!n.hid) {
        out('hidOut', '❌ 未支持');
        return;
      }
      try {
        const devices = await n.hid.requestDevice({ filters: [] });
        if (!devices.length) {
          out('hidOut', '⚠️ 未选择设备');
          return;
        }
        const dev = devices[0];
        await dev.open();
        let msg = `✅ ${dev.productName || 'HID 设备'}\nVID: 0x${dev.vendorId.toString(16)} · PID: 0x${dev.productId.toString(16)}\n等待输入报告...`;
        out('hidOut', msg);
        dev.addEventListener('inputreport', (e) => {
          const data = Array.from(new Uint8Array(e.data.buffer))
            .slice(0, 8)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(' ');
          out('hidOut', msg + '\n← ' + data);
        });
      } catch (e) {
        out('hidOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== Web Serial ========== */
  const serialBtn = document.getElementById('serialRun');
  if (serialBtn) {
    serialBtn.addEventListener('click', async () => {
      if (!n.serial) {
        out('serialOut', '❌ 未支持');
        return;
      }
      try {
        const port = await n.serial.requestPort();
        await port.open({ baudRate: 115200 });
        out('serialOut', '✅ 串口已打开\n' + JSON.stringify(port.getInfo(), null, 2));

        const reader = port.readable.getReader();
        let total = 0;
        const readLoop = async () => {
          try {
            while (true) {
              // eslint-disable-next-line no-await-in-loop
              const { value, done } = await reader.read();
              if (done) break;
              total += value.byteLength;
              out('serialOut', `✅ 已打开 · 累计接收 ${total} B`);
            }
          } catch {
            /* ignore */
          }
        };
        readLoop();
      } catch (e) {
        out('serialOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== Web MIDI ========== */
  const midiBtn = document.getElementById('midiRun');
  if (midiBtn) {
    midiBtn.addEventListener('click', async () => {
      if (typeof n.requestMIDIAccess !== 'function') {
        out('midiOut', '❌ 未支持');
        return;
      }
      try {
        const midi = await n.requestMIDIAccess();
        const ins = [];
        midi.inputs.forEach((input) => ins.push(`${input.name} (${input.manufacturer || '-'})`));
        const outs = [];
        midi.outputs.forEach((o) => outs.push(o.name));
        let msg = `✅ 已授权\n输入设备 (${midi.inputs.size}): ${ins.join(', ') || '无'}\n输出设备 (${midi.outputs.size}): ${outs.join(', ') || '无'}`;
        out('midiOut', msg);

        midi.inputs.forEach((input) => {
          input.onmidimessage = (e) => {
            const [cmd, note, vel] = e.data;
            out(
              'midiOut',
              msg + `\n🎵 cmd=${cmd.toString(16)} note=${note} vel=${vel}`
            );
          };
        });
      } catch (e) {
        out('midiOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== WebXR ========== */
  const xrBtn = document.getElementById('xrRun');
  if (xrBtn) {
    xrBtn.addEventListener('click', async () => {
      if (!n.xr) {
        out('xrOut', '❌ 当前浏览器/设备未支持 WebXR');
        return;
      }
      try {
        const vr = await n.xr.isSessionSupported('immersive-vr').catch(() => false);
        const ar = await n.xr.isSessionSupported('immersive-ar').catch(() => false);
        const inline = await n.xr.isSessionSupported('inline').catch(() => false);
        out(
          'xrOut',
          `immersive-vr: ${vr ? '✅' : '❌'}\nimmersive-ar: ${ar ? '✅' : '❌'}\ninline:        ${inline ? '✅' : '❌'}\n\n在 VR 头显 (Quest / Vision Pro) 中访问本页可直接进入沉浸模式。`
        );
      } catch (e) {
        out('xrOut', '❌ ' + e.message);
      }
    });
  }
})();

/* =====================================================
 * 26. SVG 流程编辑器（Demo A）
 *    节点拖拽 + 锚点连线 + 选中删除 + Undo/Redo + JSON 导入导出 + 自动布局
 * ===================================================== */
(function initFlowEditor() {
  const stage = document.getElementById('flowStage');
  const svg = /** @type {SVGSVGElement | null} */ (document.getElementById('flowSvg'));
  const edgesG = document.getElementById('flowEdges');
  const nodesG = document.getElementById('flowNodes');
  const ghost = document.getElementById('flowGhost');
  const tip = document.getElementById('flowTip');
  const jsonArea = /** @type {HTMLTextAreaElement | null} */ (
    document.getElementById('flowJson')
  );

  if (!stage || !svg || !edgesG || !nodesG || !ghost || !tip || !jsonArea) return;

  const NS = 'http://www.w3.org/2000/svg';

  /**
   * @typedef {{id:string,type:string,x:number,y:number,label:string}} FNode
   * @typedef {{id:string,from:string,to:string}} FEdge
   * @typedef {{nodes:FNode[],edges:FEdge[]}} FGraph
   */

  /** @type {FGraph} */
  let state = { nodes: [], edges: [] };
  /** 选中的对象 id（节点或边） */
  let selectedId = '';
  /** 撤销栈 */
  /** @type {FGraph[]} */
  const history = [];
  let historyIdx = -1;

  const NODE_W = 120;
  const NODE_H = 48;
  const COLORS = {
    start: '#25d4a8',
    task: '#6c8cff',
    cond: '#ffb84d',
    end: '#ff6b81',
  };
  const LABELS = { start: '开始', task: '任务', cond: '判断', end: '结束' };

  const uid = () => Math.random().toString(36).slice(2, 9);

  /** 拷贝当前 state 入栈 */
  const pushHistory = () => {
    history.length = historyIdx + 1;
    history.push(JSON.parse(JSON.stringify(state)));
    historyIdx = history.length - 1;
    if (history.length > 100) {
      history.shift();
      historyIdx--;
    }
  };

  const render = () => {
    // 清空
    edgesG.innerHTML = '';
    nodesG.innerHTML = '';

    // 节点
    state.nodes.forEach((n) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'flow-node' + (selectedId === n.id ? ' selected' : ''));
      g.setAttribute('transform', `translate(${n.x}, ${n.y})`);
      g.dataset.id = n.id;

      // 判断节点画成菱形，其余圆角矩形
      if (n.type === 'cond') {
        const poly = document.createElementNS(NS, 'polygon');
        const w = NODE_W;
        const h = NODE_H;
        poly.setAttribute('points', `${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}`);
        poly.setAttribute('fill', COLORS[n.type]);
        poly.setAttribute('class', 'node-body');
        g.appendChild(poly);
      } else {
        const rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('width', String(NODE_W));
        rect.setAttribute('height', String(NODE_H));
        rect.setAttribute('rx', '10');
        rect.setAttribute('fill', COLORS[n.type] || '#888');
        rect.setAttribute('class', 'node-body');
        g.appendChild(rect);
      }

      // 文本
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x', String(NODE_W / 2));
      text.setAttribute('y', String(NODE_H / 2 + 4));
      text.setAttribute('text-anchor', 'middle');
      text.textContent = n.label;
      g.appendChild(text);

      // 右侧锚点（输出）—— 结束节点没有
      if (n.type !== 'end') {
        const anchorR = document.createElementNS(NS, 'circle');
        anchorR.setAttribute('cx', String(NODE_W));
        anchorR.setAttribute('cy', String(NODE_H / 2));
        anchorR.setAttribute('r', '5');
        anchorR.setAttribute('class', 'flow-anchor');
        anchorR.dataset.role = 'source';
        anchorR.dataset.nid = n.id;
        g.appendChild(anchorR);
      }
      // 左侧锚点（输入）—— 开始节点没有
      if (n.type !== 'start') {
        const anchorL = document.createElementNS(NS, 'circle');
        anchorL.setAttribute('cx', '0');
        anchorL.setAttribute('cy', String(NODE_H / 2));
        anchorL.setAttribute('r', '5');
        anchorL.setAttribute('class', 'flow-anchor');
        anchorL.dataset.role = 'target';
        anchorL.dataset.nid = n.id;
        g.appendChild(anchorL);
      }

      nodesG.appendChild(g);
    });

    // 边
    state.edges.forEach((e) => {
      const s = state.nodes.find((n) => n.id === e.from);
      const t = state.nodes.find((n) => n.id === e.to);
      if (!s || !t) return;
      const sx = s.x + NODE_W;
      const sy = s.y + NODE_H / 2;
      const tx = t.x;
      const ty = t.y + NODE_H / 2;
      const d = bezierPath(sx, sy, tx, ty);

      // 隐形的更宽命中区，方便点击
      const hit = document.createElementNS(NS, 'path');
      hit.setAttribute('d', d);
      hit.setAttribute('class', 'flow-edge-hit');
      hit.dataset.eid = e.id;
      edgesG.appendChild(hit);

      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-edge' + (selectedId === e.id ? ' selected' : ''));
      path.setAttribute('marker-end', 'url(#arrow)');
      path.dataset.eid = e.id;
      edgesG.appendChild(path);
    });

    // 隐藏提示
    if (state.nodes.length > 0) tip.classList.add('hide');
    else tip.classList.remove('hide');
  };

  /** 贝塞尔路径 */
  const bezierPath = (sx, sy, tx, ty) => {
    const dx = Math.max(Math.abs(tx - sx) * 0.5, 50);
    return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
  };

  /** 屏幕坐标 → SVG 内坐标 */
  const screenToSvg = (x, y) => {
    const rect = svg.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  };

  /* ========== 拖入节点：HTML5 DnD ========== */
  document.querySelectorAll('.flow-pal-item').forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      const type = /** @type {HTMLElement} */ (item).dataset.type || 'task';
      e.dataTransfer.setData('text/fe-node', type);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });
  stage.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  stage.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/fe-node');
    if (!type) return;
    const { x, y } = screenToSvg(e.clientX, e.clientY);
    state.nodes.push({
      id: uid(),
      type,
      x: x - NODE_W / 2,
      y: y - NODE_H / 2,
      label: LABELS[type] || type,
    });
    pushHistory();
    render();
  });

  /* ========== 节点拖拽 & 连线 ========== */
  let dragging = null; // { type: 'node'|'connect', ... }

  svg.addEventListener('mousedown', (e) => {
    const target = /** @type {Element} */ (e.target);

    // 锚点 → 开始连线
    if (target.classList.contains('flow-anchor')) {
      const role = /** @type {HTMLElement} */ (target).dataset.role;
      const nid = /** @type {HTMLElement} */ (target).dataset.nid;
      if (role === 'source' && nid) {
        const node = state.nodes.find((n) => n.id === nid);
        if (!node) return;
        const sx = node.x + NODE_W;
        const sy = node.y + NODE_H / 2;
        dragging = { type: 'connect', from: nid, sx, sy };
      }
      return;
    }

    // 节点拖动
    const nodeEl = target.closest('.flow-node');
    if (nodeEl) {
      const id = /** @type {HTMLElement} */ (nodeEl).dataset.id;
      const node = state.nodes.find((n) => n.id === id);
      if (!node) return;
      const { x, y } = screenToSvg(e.clientX, e.clientY);
      dragging = {
        type: 'node',
        id,
        dx: x - node.x,
        dy: y - node.y,
        moved: false,
      };
      selectedId = id;
      render();
      return;
    }

    // 边
    if (target.classList.contains('flow-edge') || target.classList.contains('flow-edge-hit')) {
      selectedId = /** @type {HTMLElement} */ (target).dataset.eid || '';
      render();
      return;
    }

    // 空白点击：取消选中
    selectedId = '';
    render();
  });

  svg.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const { x, y } = screenToSvg(e.clientX, e.clientY);

    if (dragging.type === 'node') {
      const node = state.nodes.find((n) => n.id === dragging.id);
      if (!node) return;
      node.x = x - dragging.dx;
      node.y = y - dragging.dy;
      dragging.moved = true;
      render();
    } else if (dragging.type === 'connect') {
      ghost.setAttribute('d', bezierPath(dragging.sx, dragging.sy, x, y));
    }
  });

  svg.addEventListener('mouseup', (e) => {
    if (!dragging) return;

    if (dragging.type === 'node' && dragging.moved) {
      pushHistory();
    }

    if (dragging.type === 'connect') {
      ghost.setAttribute('d', '');
      const target = /** @type {Element} */ (e.target);
      if (target.classList.contains('flow-anchor')) {
        const role = /** @type {HTMLElement} */ (target).dataset.role;
        const nid = /** @type {HTMLElement} */ (target).dataset.nid;
        if (role === 'target' && nid && nid !== dragging.from) {
          // 避免重复边
          const exists = state.edges.find(
            (ed) => ed.from === dragging.from && ed.to === nid
          );
          if (!exists) {
            state.edges.push({ id: uid(), from: dragging.from, to: nid });
            pushHistory();
            render();
          }
        }
      }
    }
    dragging = null;
  });

  svg.addEventListener('mouseleave', () => {
    if (dragging && dragging.type === 'connect') ghost.setAttribute('d', '');
    dragging = null;
  });

  /* ========== 键盘：Delete 删除 ========== */
  window.addEventListener('keydown', (e) => {
    if (
      (e.key === 'Delete' || e.key === 'Backspace') &&
      selectedId &&
      document.activeElement &&
      document.activeElement.tagName !== 'TEXTAREA' &&
      document.activeElement.tagName !== 'INPUT'
    ) {
      // 仅在流程图 SVG 聚焦或鼠标在上方时才响应
      const isNode = state.nodes.some((n) => n.id === selectedId);
      if (isNode) {
        state.nodes = state.nodes.filter((n) => n.id !== selectedId);
        state.edges = state.edges.filter(
          (ed) => ed.from !== selectedId && ed.to !== selectedId
        );
      } else {
        state.edges = state.edges.filter((ed) => ed.id !== selectedId);
      }
      selectedId = '';
      pushHistory();
      render();
    }
  });

  /* ========== 工具按钮 ========== */
  const $ = (id) => document.getElementById(id);

  $('flowUndo').addEventListener('click', () => {
    if (historyIdx > 0) {
      historyIdx--;
      state = JSON.parse(JSON.stringify(history[historyIdx]));
      render();
    }
  });
  $('flowRedo').addEventListener('click', () => {
    if (historyIdx < history.length - 1) {
      historyIdx++;
      state = JSON.parse(JSON.stringify(history[historyIdx]));
      render();
    }
  });
  $('flowClear').addEventListener('click', () => {
    state = { nodes: [], edges: [] };
    selectedId = '';
    pushHistory();
    render();
  });
  $('flowExport').addEventListener('click', () => {
    jsonArea.value = JSON.stringify(state, null, 2);
    jsonArea.parentElement && (jsonArea.parentElement.open = true);
  });
  $('flowImport').addEventListener('click', () => {
    try {
      const data = JSON.parse(jsonArea.value);
      if (!data.nodes || !data.edges) throw new Error('格式错误');
      state = data;
      selectedId = '';
      pushHistory();
      render();
    } catch (e) {
      alert('导入失败：' + e.message);
    }
  });

  /** 简易自动布局：按依赖分层（Kahn 算法） */
  $('flowAuto').addEventListener('click', () => {
    if (state.nodes.length === 0) return;
    const levels = {};
    const indeg = {};
    state.nodes.forEach((n) => {
      indeg[n.id] = 0;
      levels[n.id] = 0;
    });
    state.edges.forEach((e) => (indeg[e.to] = (indeg[e.to] || 0) + 1));
    const queue = state.nodes.filter((n) => indeg[n.id] === 0).map((n) => n.id);
    const visited = new Set();
    while (queue.length) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      state.edges
        .filter((e) => e.from === id)
        .forEach((e) => {
          levels[e.to] = Math.max(levels[e.to], levels[id] + 1);
          indeg[e.to]--;
          if (indeg[e.to] <= 0) queue.push(e.to);
        });
    }
    // 按层排列
    const levelMap = {};
    state.nodes.forEach((n) => {
      const l = levels[n.id];
      (levelMap[l] ||= []).push(n);
    });
    const startX = 40;
    const startY = 40;
    const gapX = NODE_W + 60;
    const gapY = NODE_H + 30;
    Object.keys(levelMap)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((l, col) => {
        levelMap[l].forEach((n, row) => {
          n.x = startX + col * gapX;
          n.y = startY + row * gapY;
        });
      });
    pushHistory();
    render();
  });

  // 初始化：放一个开始节点示范
  state.nodes.push({
    id: uid(),
    type: 'start',
    x: 40,
    y: 180,
    label: '开始',
  });
  state.nodes.push({
    id: uid(),
    type: 'task',
    x: 240,
    y: 180,
    label: '审批',
  });
  state.nodes.push({
    id: uid(),
    type: 'end',
    x: 440,
    y: 180,
    label: '结束',
  });
  state.edges.push({ id: uid(), from: state.nodes[0].id, to: state.nodes[1].id });
  state.edges.push({ id: uid(), from: state.nodes[1].id, to: state.nodes[2].id });
  pushHistory();
  render();
})();

/* =====================================================
 * 27. Canvas 无限画布（Demo B）
 *    Pan / Zoom（以光标为中心）+ 双击新建 + 框选 + 适配视图
 * ===================================================== */
(function initInfiniteCanvas() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('infCanvas')
  );
  const info = document.getElementById('canvasInfo');
  const resetBtn = document.getElementById('canvasReset');
  const addBtn = document.getElementById('canvasAdd');
  const fitBtn = document.getElementById('canvasFit');
  if (!canvas || !info || !resetBtn || !addBtn || !fitBtn) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };
  window.addEventListener('resize', resize);

  /** 世界坐标系下的节点 */
  /** @type {{x:number,y:number,w:number,h:number,color:string,label:string,id:number}[]} */
  let nodes = [];
  let nextId = 1;

  /** 视图矩阵：offsetX/Y + scale */
  let offsetX = 0;
  let offsetY = 0;
  let scale = 1;

  /** 交互状态 */
  let panning = false;
  let startPan = { x: 0, y: 0 };
  let startOffset = { x: 0, y: 0 };
  /** 被拖拽的节点 */
  let hoverNode = null;
  let draggingNode = null;
  let dragDelta = { x: 0, y: 0 };

  const COLORS = ['#6c8cff', '#8a5cff', '#25d4a8', '#ffb84d', '#ff6b81'];

  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    ctx.clearRect(0, 0, W, H);

    /* ---- 1. 绘制网格（跟随缩放） ---- */
    const gridSize = 40 * scale;
    const gridOffsetX = offsetX % gridSize;
    const gridOffsetY = offsetY % gridSize;
    ctx.strokeStyle = 'rgba(154,163,199,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = gridOffsetX; x < W; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = gridOffsetY; y < H; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();

    /* ---- 2. 原点标记 ---- */
    ctx.fillStyle = 'rgba(108,140,255,0.5)';
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 4, 0, Math.PI * 2);
    ctx.fill();

    /* ---- 3. 绘制节点（应用视图矩阵） ---- */
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    nodes.forEach((n) => {
      // 视口裁剪（可选：只画可见节点）
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(n.x, n.y, n.w, n.h, 8)
        : ctx.rect(n.x, n.y, n.w, n.h);
      ctx.fill();

      if (hoverNode === n || draggingNode === n) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = '#fff';
      ctx.font = '600 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x + n.w / 2, n.y + n.h / 2);
    });
    ctx.restore();

    info.textContent = `偏移 (${offsetX.toFixed(0)}, ${offsetY.toFixed(0)}) · 缩放 ${(scale * 100).toFixed(0)}%`;
  };

  /** 屏幕 → 世界 */
  const screenToWorld = (sx, sy) => ({
    x: (sx - offsetX) / scale,
    y: (sy - offsetY) / scale,
  });

  /** 命中测试（世界坐标） */
  const hitNode = (wx, wy) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (wx >= n.x && wx <= n.x + n.w && wy >= n.y && wy <= n.y + n.h) return n;
    }
    return null;
  };

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { x, y } = screenToWorld(sx, sy);
    const hit = hitNode(x, y);
    if (hit) {
      draggingNode = hit;
      dragDelta = { x: x - hit.x, y: y - hit.y };
      // 把选中节点移到最上层
      nodes = nodes.filter((n) => n !== hit).concat(hit);
    } else {
      panning = true;
      startPan = { x: sx, y: sy };
      startOffset = { x: offsetX, y: offsetY };
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (draggingNode) {
      const { x, y } = screenToWorld(sx, sy);
      draggingNode.x = x - dragDelta.x;
      draggingNode.y = y - dragDelta.y;
      draw();
      return;
    }
    if (panning) {
      offsetX = startOffset.x + (sx - startPan.x);
      offsetY = startOffset.y + (sy - startPan.y);
      draw();
      return;
    }
    const { x, y } = screenToWorld(sx, sy);
    const before = hoverNode;
    hoverNode = hitNode(x, y);
    if (before !== hoverNode) {
      canvas.style.cursor = hoverNode ? 'move' : '';
      draw();
    }
  });

  window.addEventListener('mouseup', () => {
    panning = false;
    draggingNode = null;
  });

  /** 滚轮缩放：以光标为中心 */
  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const wx = (cx - offsetX) / scale;
      const wy = (cy - offsetY) / scale;
      scale = Math.min(4, Math.max(0.1, scale * factor));
      offsetX = cx - wx * scale;
      offsetY = cy - wy * scale;
      draw();
    },
    { passive: false }
  );

  /** 双击新建节点 */
  canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { x, y } = screenToWorld(sx, sy);
    if (hitNode(x, y)) return;
    nodes.push({
      id: nextId++,
      x: x - 60,
      y: y - 30,
      w: 120,
      h: 60,
      color: COLORS[nodes.length % COLORS.length],
      label: 'Node ' + nextId,
    });
    draw();
  });

  /** 按钮 */
  resetBtn.addEventListener('click', () => {
    offsetX = 0;
    offsetY = 0;
    scale = 1;
    draw();
  });
  addBtn.addEventListener('click', () => {
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 1500;
      const y = (Math.random() - 0.5) * 800;
      nodes.push({
        id: nextId++,
        x,
        y,
        w: 120,
        h: 60,
        color: COLORS[nextId % COLORS.length],
        label: 'Node ' + nextId,
      });
    }
    draw();
  });
  fitBtn.addEventListener('click', () => {
    if (nodes.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const xs = nodes.map((n) => n.x);
    const xe = nodes.map((n) => n.x + n.w);
    const ys = nodes.map((n) => n.y);
    const ye = nodes.map((n) => n.y + n.h);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xe);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ye);
    const padding = 60;
    const boxW = maxX - minX + padding * 2;
    const boxH = maxY - minY + padding * 2;
    scale = Math.min((rect.width / boxW) * 1, (rect.height / boxH) * 1, 2);
    scale = Math.max(0.1, scale);
    offsetX = rect.width / 2 - ((minX + maxX) / 2) * scale;
    offsetY = rect.height / 2 - ((minY + maxY) / 2) * scale;
    draw();
  });

  // 初始化：放置几个示例节点
  for (let i = 0; i < 6; i++) {
    nodes.push({
      id: nextId++,
      x: 80 + (i % 3) * 180,
      y: 80 + Math.floor(i / 3) * 120,
      w: 120,
      h: 60,
      color: COLORS[i % COLORS.length],
      label: 'Node ' + nextId,
    });
  }

  resize();
})();

/* =====================================================
 * 28. 游戏 Demo A：Canvas 2D 打砖块
 * ===================================================== */
(function initBreakout() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('breakoutCanvas')
  );
  const overlay = document.getElementById('breakoutOverlay');
  const startBtn = document.getElementById('bkStart');
  const scoreEl = document.getElementById('bkScore');
  const lifeEl = document.getElementById('bkLife');
  const levelEl = document.getElementById('bkLevel');
  if (!canvas || !overlay || !startBtn || !scoreEl || !lifeEl || !levelEl) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  /** @type {{x:number,y:number,vx:number,vy:number,r:number}} */
  let ball;
  /** @type {{x:number,y:number,w:number,h:number}} */
  let paddle;
  /** @type {{x:number,y:number,w:number,h:number,color:string,alive:boolean}[]} */
  let bricks = [];
  let score = 0;
  let life = 3;
  let level = 1;
  let running = false;
  let raf = 0;

  const keys = { left: false, right: false };

  const buildLevel = (lv) => {
    bricks = [];
    const cols = 12;
    const rows = 4 + Math.min(lv, 4);
    const bw = (W - 40) / cols - 4;
    const bh = 18;
    const colors = ['#ff6b81', '#ffb84d', '#25d4a8', '#6c8cff', '#8a5cff'];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: 20 + c * (bw + 4),
          y: 50 + r * (bh + 4),
          w: bw,
          h: bh,
          color: colors[r % colors.length],
          alive: true,
        });
      }
    }
  };

  const reset = () => {
    paddle = { x: W / 2 - 50, y: H - 30, w: 100, h: 10 };
    ball = {
      x: W / 2,
      y: H - 50,
      vx: 4 * (Math.random() > 0.5 ? 1 : -1),
      vy: -4,
      r: 7,
    };
  };

  const start = () => {
    score = 0;
    life = 3;
    level = 1;
    buildLevel(level);
    reset();
    running = true;
    overlay.classList.add('hide');
    updateHud();
    loop();
  };

  const updateHud = () => {
    scoreEl.textContent = String(score);
    lifeEl.textContent = String(life);
    levelEl.textContent = String(level);
  };

  const showOverlay = (html) => {
    overlay.innerHTML = `<div>${html}<button class="btn btn-primary" style="margin-top:14px" id="bkRestart">再来一局</button></div>`;
    overlay.classList.remove('hide');
    const btn = document.getElementById('bkRestart');
    if (btn) btn.addEventListener('click', start);
    running = false;
  };

  const loop = () => {
    if (!running) return;

    // 更新
    if (keys.left) paddle.x = Math.max(0, paddle.x - 7);
    if (keys.right) paddle.x = Math.min(W - paddle.w, paddle.x + 7);

    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
    if (ball.y < ball.r) ball.vy *= -1;

    // 挡板
    if (
      ball.y + ball.r >= paddle.y &&
      ball.y + ball.r <= paddle.y + paddle.h + 10 &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.w &&
      ball.vy > 0
    ) {
      ball.vy *= -1;
      // 依据击中位置调整水平速度
      const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      ball.vx = hit * 6;
    }

    // 掉落
    if (ball.y > H + 20) {
      life -= 1;
      updateHud();
      if (life <= 0) {
        draw();
        showOverlay(
          `<h3 style="margin:0 0 8px;color:#ff6b81">💀 Game Over</h3>
           <p style="color:var(--muted);margin:0">最终得分：${score}</p>`
        );
        return;
      }
      reset();
    }

    // 砖块碰撞
    for (const b of bricks) {
      if (!b.alive) continue;
      if (
        ball.x + ball.r > b.x &&
        ball.x - ball.r < b.x + b.w &&
        ball.y + ball.r > b.y &&
        ball.y - ball.r < b.y + b.h
      ) {
        b.alive = false;
        score += 10;
        updateHud();
        // 简单判断：从侧面或上下撞
        const prevX = ball.x - ball.vx;
        const prevY = ball.y - ball.vy;
        if (prevX < b.x || prevX > b.x + b.w) ball.vx *= -1;
        else ball.vy *= -1;
        break;
      }
    }

    // 全部消灭 → 下一关
    if (bricks.every((b) => !b.alive)) {
      level += 1;
      buildLevel(level);
      reset();
      ball.vx *= 1.1;
      ball.vy *= 1.1;
      updateHud();
    }

    draw();
    raf = requestAnimationFrame(loop);
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    // 背景渐变
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#11152f');
    g.addColorStop(1, '#0a0d1f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // 砖块
    bricks.forEach((b) => {
      if (!b.alive) return;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(b.x, b.y, b.w, 3);
    });

    // 挡板
    ctx.fillStyle = '#6c8cff';
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(paddle.x, paddle.y, paddle.w, 2);

    // 球
    ctx.fillStyle = '#25d4a8';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = '#25d4a8';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // 输入
  window.addEventListener('keydown', (e) => {
    if (!running) return;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  });
  // 鼠标/触摸
  const movePaddle = (clientX) => {
    if (!running) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    paddle.x = Math.max(0, Math.min(W - paddle.w, x - paddle.w / 2));
  };
  canvas.addEventListener('mousemove', (e) => movePaddle(e.clientX));
  canvas.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches[0]) movePaddle(e.touches[0].clientX);
      e.preventDefault();
    },
    { passive: false }
  );

  startBtn.addEventListener('click', start);
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !running && overlay.offsetParent !== null) {
      e.preventDefault();
      start();
    }
  });
})();

/* =====================================================
 * 29. 游戏 Demo B：Three.js 3D 场景（CDN 按需加载）
 * ===================================================== */
(function initThreeDemo() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('threeCanvas')
  );
  const loadBtn = document.getElementById('threeLoad');
  const wireBtn = document.getElementById('threeWire');
  const addBtn = document.getElementById('threeAdd');
  const fpsEl = document.getElementById('threeFps');
  const triEl = document.getElementById('threeTri');
  const dcEl = document.getElementById('threeDc');
  if (!canvas || !loadBtn || !wireBtn || !addBtn || !fpsEl || !triEl || !dcEl) return;

  let loaded = false;
  let wireframe = false;

  /** 动态 ESM import + 懒加载 */
  const boot = async () => {
    loadBtn.disabled = true;
    loadBtn.textContent = '⏳ 加载中...';
    try {
      /** @type {any} */
      const THREE = await import(
        /* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
      );

      const rect = canvas.getBoundingClientRect();
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(rect.width, rect.height, false);
      renderer.shadowMap.enabled = true;
      renderer.setClearColor(0x0a0d1f);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x0a0d1f, 10, 40);

      const camera = new THREE.PerspectiveCamera(
        60,
        rect.width / rect.height,
        0.1,
        1000
      );
      camera.position.set(6, 5, 8);
      camera.lookAt(0, 0, 0);

      // 地面
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({ color: 0x1e2340, roughness: 0.8 })
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -1.5;
      plane.receiveShadow = true;
      scene.add(plane);

      // 光
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const dir = new THREE.DirectionalLight(0xffffff, 1.2);
      dir.position.set(5, 10, 4);
      dir.castShadow = true;
      dir.shadow.mapSize.set(1024, 1024);
      scene.add(dir);

      // 主立方体
      const cubes = [];
      const colors = [0x6c8cff, 0x8a5cff, 0x25d4a8, 0xffb84d, 0xff6b81];
      const makeCube = (x, y, z) => {
        const mat = new THREE.MeshStandardMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          metalness: 0.3,
          roughness: 0.4,
        });
        const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
        m.position.set(x, y, z);
        m.castShadow = true;
        scene.add(m);
        cubes.push(m);
        return m;
      };
      makeCube(0, 0, 0);
      // 外围一圈
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        makeCube(Math.cos(a) * 3, 0, Math.sin(a) * 3);
      }

      // 鼠标交互：拖拽旋转相机 + 滚轮缩放
      let theta = Math.atan2(camera.position.x, camera.position.z);
      let phi = Math.asin(camera.position.y / camera.position.length());
      let radius = camera.position.length();
      let down = false;
      let lx = 0;
      let ly = 0;
      canvas.addEventListener('mousedown', (e) => {
        down = true;
        lx = e.clientX;
        ly = e.clientY;
      });
      window.addEventListener('mouseup', () => (down = false));
      window.addEventListener('mousemove', (e) => {
        if (!down) return;
        theta -= (e.clientX - lx) * 0.005;
        phi += (e.clientY - ly) * 0.005;
        phi = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, phi));
        lx = e.clientX;
        ly = e.clientY;
      });
      canvas.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          radius += e.deltaY * 0.01;
          radius = Math.max(3, Math.min(30, radius));
        },
        { passive: false }
      );

      const resize = () => {
        const r = canvas.getBoundingClientRect();
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', resize);

      // FPS 测量
      let frames = 0;
      let lastFpsT = performance.now();

      renderer.setAnimationLoop(() => {
        // 更新相机位置
        camera.position.set(
          radius * Math.cos(phi) * Math.sin(theta),
          radius * Math.sin(phi),
          radius * Math.cos(phi) * Math.cos(theta)
        );
        camera.lookAt(0, 0, 0);

        // 自转
        cubes.forEach((c, i) => {
          c.rotation.x += 0.005 + i * 0.0003;
          c.rotation.y += 0.008 + i * 0.0004;
        });

        renderer.render(scene, camera);

        frames++;
        const t = performance.now();
        if (t - lastFpsT >= 500) {
          fpsEl.textContent = Math.round((frames * 1000) / (t - lastFpsT)).toString();
          triEl.textContent = String(renderer.info.render.triangles);
          dcEl.textContent = String(renderer.info.render.calls);
          frames = 0;
          lastFpsT = t;
        }
      });

      wireBtn.addEventListener('click', () => {
        wireframe = !wireframe;
        cubes.forEach((c) => (c.material.wireframe = wireframe));
      });
      addBtn.addEventListener('click', () => {
        for (let i = 0; i < 50; i++) {
          makeCube(
            (Math.random() - 0.5) * 14,
            Math.random() * 5,
            (Math.random() - 0.5) * 14
          );
        }
      });

      loaded = true;
      loadBtn.textContent = '✅ 已启动';
    } catch (err) {
      loadBtn.disabled = false;
      loadBtn.textContent = '▶ 加载 Three.js 并启动';
      alert('加载 Three.js 失败：' + err.message + '\n可能是网络问题或 CDN 被屏蔽');
    }
  };

  loadBtn.addEventListener('click', () => {
    if (!loaded) boot();
  });
})();

/* =====================================================
 * 30. 游戏 Demo C：Web Audio 3D 空间音效
 * ===================================================== */
(function initSpatialAudio() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('audioCanvas')
  );
  const startBtn = document.getElementById('audioStart');
  const stopBtn = document.getElementById('audioStop');
  const typeSel = /** @type {HTMLSelectElement | null} */ (
    document.getElementById('audioType')
  );
  const lVol = document.getElementById('audioL');
  const rVol = document.getElementById('audioR');
  if (!canvas || !startBtn || !stopBtn || !typeSel || !lVol || !rVol) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  /** 音源位置（世界坐标，单位米） */
  let sx = 3;
  let sy = 0;

  /** @type {AudioContext | null} */
  let audio = null;
  /** @type {OscillatorNode | null} */
  let osc = null;
  /** @type {PannerNode | null} */
  let panner = null;
  /** @type {AnalyserNode | null} */
  let analyser = null;
  let rafId = 0;

  const start = async () => {
    if (audio) return;
    audio = new AudioContext();
    osc = audio.createOscillator();
    osc.type = /** @type {OscillatorType} */ (typeSel.value);
    osc.frequency.value = 440;

    // 音量自动衰减的 gain（听感舒适）
    const gain = audio.createGain();
    gain.gain.value = 0.2;

    panner = audio.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 20;
    panner.rolloffFactor = 1;
    panner.positionX.value = sx;
    panner.positionZ.value = sy;

    // 听众位置固定原点，朝 -Z
    const listener = audio.listener;
    if (listener.forwardX) {
      listener.forwardX.value = 0;
      listener.forwardY.value = 0;
      listener.forwardZ.value = -1;
      listener.upX.value = 0;
      listener.upY.value = 1;
      listener.upZ.value = 0;
    }

    analyser = audio.createAnalyser();
    analyser.fftSize = 256;

    osc.connect(gain).connect(panner).connect(analyser).connect(audio.destination);
    osc.start();

    typeSel.addEventListener('change', () => {
      if (osc) osc.type = /** @type {OscillatorType} */ (typeSel.value);
    });

    loop();
  };

  const stop = () => {
    if (!audio) return;
    osc && osc.stop();
    audio.close();
    audio = null;
    osc = null;
    panner = null;
    analyser = null;
    cancelAnimationFrame(rafId);
    drawStage();
    lVol.textContent = '0';
    rVol.textContent = '0';
  };

  const drawStage = () => {
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);

    // 背景圈圈（距离刻度）
    const cx = W / 2;
    const cy = H / 2;
    ctx.strokeStyle = 'rgba(154,163,199,0.15)';
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, i * 40, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 十字
    ctx.strokeStyle = 'rgba(154,163,199,0.2)';
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, H);
    ctx.stroke();

    // 听众
    ctx.fillStyle = '#25d4a8';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '11px Menlo';
    ctx.textAlign = 'center';
    ctx.fillText('YOU', cx, cy + 4);

    // 音源（像素 = 世界 * 40）
    const sxPx = cx + sx * 40;
    const syPx = cy + sy * 40;
    ctx.fillStyle = '#ff6b81';
    ctx.shadowColor = '#ff6b81';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(sxPx, syPx, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.fillText('🔊', sxPx, syPx + 4);
  };

  const loop = () => {
    drawStage();
    if (analyser && audio) {
      // 模拟左右声道音量：距离 + 角度
      const dist = Math.hypot(sx, sy) + 0.1;
      const atten = Math.max(0, 1 - dist / 10);
      const pan = Math.max(-1, Math.min(1, sx / 5));
      const L = Math.round((atten * (1 - Math.max(0, pan))) * 100);
      const R = Math.round((atten * (1 + Math.min(0, pan))) * 100);
      lVol.textContent = String(L);
      rVol.textContent = String(R);

      if (panner) {
        panner.positionX.value = sx;
        panner.positionZ.value = sy;
      }
    }
    rafId = requestAnimationFrame(loop);
  };

  // 拖动音源
  let dragging = false;
  canvas.addEventListener('mousedown', () => (dragging = true));
  window.addEventListener('mouseup', () => (dragging = false));
  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    sx = (e.clientX - rect.left - rect.width / 2) / 40;
    sy = (e.clientY - rect.top - rect.height / 2) / 40;
    drawStage();
  });
  // 触摸
  canvas.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      sx = (t.clientX - rect.left - rect.width / 2) / 40;
      sy = (t.clientY - rect.top - rect.height / 2) / 40;
      drawStage();
      e.preventDefault();
    },
    { passive: false }
  );

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
  drawStage();
})();

/* =====================================================
 * 31. 游戏 Demo D：Gamepad / Fullscreen / Vibration / Wake Lock
 * ===================================================== */
(function initGameApis() {
  /* ---- Gamepad 实时面板 ---- */
  const gpEmpty = document.getElementById('gpEmpty');
  const gpBody = document.getElementById('gpBody');
  const gpName = document.getElementById('gpName');
  const gpL = document.getElementById('gpL');
  const gpR = document.getElementById('gpR');
  const gpBtns = document.getElementById('gpBtns');
  const gpVibrate = document.getElementById('gpVibrate');

  let currentGp = -1;
  if (gpEmpty && gpBody && gpName && gpL && gpR && gpBtns) {
    window.addEventListener('gamepadconnected', (e) => {
      currentGp = e.gamepad.index;
      gpEmpty.style.display = 'none';
      gpBody.style.display = 'block';
      gpName.textContent = `✅ ${e.gamepad.id}  (${e.gamepad.buttons.length} 键)`;
    });
    window.addEventListener('gamepaddisconnected', () => {
      currentGp = -1;
      gpEmpty.style.display = 'block';
      gpBody.style.display = 'none';
    });

    const pollGp = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = pads[currentGp];
      if (pad) {
        // 摇杆
        const lx = pad.axes[0] || 0;
        const ly = pad.axes[1] || 0;
        const rx = pad.axes[2] || 0;
        const ry = pad.axes[3] || 0;
        gpL.style.transform = `translate(${lx * 30}px, ${ly * 30}px)`;
        gpR.style.transform = `translate(${rx * 30}px, ${ry * 30}px)`;

        // 按钮
        if (gpBtns.children.length !== pad.buttons.length) {
          gpBtns.innerHTML = pad.buttons
            .map((_, i) => `<div class="gp-btn" data-i="${i}">${i}</div>`)
            .join('');
        }
        pad.buttons.forEach((b, i) => {
          const el = gpBtns.children[i];
          if (el) el.classList.toggle('pressed', b.pressed);
        });
      }
      requestAnimationFrame(pollGp);
    };
    pollGp();

    if (gpVibrate) {
      gpVibrate.addEventListener('click', () => {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        const pad = pads[currentGp];
        const actuator = pad && /** @type {any} */ (pad).vibrationActuator;
        if (actuator && actuator.playEffect) {
          actuator.playEffect('dual-rumble', {
            duration: 300,
            strongMagnitude: 0.8,
            weakMagnitude: 0.4,
          });
        } else {
          alert('此手柄不支持震动，或浏览器未实现 vibrationActuator');
        }
      });
    }
  }

  /* ---- 游戏其他 API ---- */
  const out = (msg) => {
    const el = document.getElementById('gameApiOut');
    if (el) el.textContent = msg;
  };

  const fsBtn = document.getElementById('fsBtn');
  if (fsBtn) {
    fsBtn.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          out('已退出全屏');
        } else {
          await document.documentElement.requestFullscreen();
          out('✅ 已进入全屏');
        }
      } catch (e) {
        out('❌ ' + e.message);
      }
    });
  }

  const vibBtn = document.getElementById('vibBtn');
  if (vibBtn) {
    vibBtn.addEventListener('click', () => {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 300]);
        out('📳 已发送震动指令（仅移动端真机生效）');
      } else {
        out('❌ 当前设备不支持 Vibration API');
      }
    });
  }

  const wakeBtn = document.getElementById('wakeBtn');
  if (wakeBtn) {
    /** @type {any} */
    let wakeLock = null;
    wakeBtn.addEventListener('click', async () => {
      const w = /** @type {any} */ (navigator);
      if (!w.wakeLock) {
        out('❌ 当前浏览器未支持 Wake Lock');
        return;
      }
      try {
        if (wakeLock) {
          await wakeLock.release();
          wakeLock = null;
          out('已释放 Wake Lock（屏幕可正常休眠）');
          wakeBtn.textContent = '💡 请求屏幕常亮（Wake Lock）';
          return;
        }
        wakeLock = await w.wakeLock.request('screen');
        out('✅ 已获得 Wake Lock，屏幕不会自动熄灭');
        wakeBtn.textContent = '💡 释放 Wake Lock';
      } catch (e) {
        out('❌ ' + e.message);
      }
    });
  }

  const lockBtn = document.getElementById('lockBtnR');
  if (lockBtn) {
    lockBtn.addEventListener('click', async () => {
      const scr = /** @type {any} */ (screen);
      if (!scr.orientation || !scr.orientation.lock) {
        out('❌ 当前浏览器未支持 Orientation Lock（通常只在全屏 + 移动端可用）');
        return;
      }
      try {
        await scr.orientation.lock('landscape');
        out('✅ 已锁定横屏');
      } catch (e) {
        out('❌ ' + e.message + '（需先进入全屏）');
      }
    });
  }

  const ptrLockBtn = document.getElementById('ptrLockBtn');
  if (ptrLockBtn) {
    ptrLockBtn.addEventListener('click', async () => {
      const el = /** @type {any} */ (document.documentElement);
      if (!el.requestPointerLock) {
        out('❌ 不支持 Pointer Lock');
        return;
      }
      try {
        await el.requestPointerLock();
        out('✅ 鼠标已锁定 · 按 Esc 退出');
      } catch (e) {
        out('❌ ' + e.message);
      }
    });
  }
})();


/* =====================================================
 * 32. 游戏 Demo E：FPS 射击游戏
 *     Three.js + Raycaster 命中判定 + 血量/子弹/AI
 * ===================================================== */
(function initFpsGame() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('exploreCanvas')
  );
  const overlay = document.getElementById('expOverlay');
  const loadBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('expLoad')
  );
  const joinBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('expJoin')
  );
  const fpsEl = document.getElementById('expFps');
  const posEl = document.getElementById('expPos');
  const onlineEl = document.getElementById('expOnline');
  const pingEl = document.getElementById('expPing');
  const chatBox = document.getElementById('expChat');
  const crosshair = document.getElementById('fpsCrosshair');
  const hitmarker = document.getElementById('fpsHitmarker');
  const damageEl = document.getElementById('fpsDamage');
  const hpBar = document.getElementById('fpsHpBar');
  const arBar = document.getElementById('fpsArBar');
  const hpText = document.getElementById('fpsHp');
  const arText = document.getElementById('fpsAr');
  const ammoEl = document.getElementById('fpsAmmo');
  const ammoTotalEl = document.getElementById('fpsAmmoTotal');
  const killsEl = document.getElementById('fpsKills');
  const deathsEl = document.getElementById('fpsDeaths');
  const killFeed = document.getElementById('fpsKillFeed');
  const respawnBox = document.getElementById('fpsRespawn');
  const respawnTitle = document.getElementById('fpsRespawnTitle');
  const respawnTip = document.getElementById('fpsRespawnTip');
  const gunEl = document.getElementById('fpsGun');
  const muzzleEl = document.getElementById('fpsMuzzle');

  if (
    !canvas ||
    !overlay ||
    !loadBtn ||
    !joinBtn ||
    !fpsEl ||
    !posEl ||
    !onlineEl ||
    !pingEl ||
    !chatBox ||
    !crosshair ||
    !hitmarker ||
    !damageEl ||
    !hpBar ||
    !arBar ||
    !hpText ||
    !arText ||
    !ammoEl ||
    !ammoTotalEl ||
    !killsEl ||
    !deathsEl ||
    !killFeed ||
    !respawnBox ||
    !respawnTitle ||
    !respawnTip ||
    !gunEl ||
    !muzzleEl
  ) {
    return;
  }

  /* =====================================================
   * 武器配置（5 把 + 手雷）
   * ===================================================== */
  const WEAPONS = {
    pistol: {
      key: 'pistol',
      name: '🔫 手枪 Glock',
      icon: '🔫',
      damage: 22,
      fireRate: 200,
      magSize: 15,
      reserve: 999,    // 备弹无限
      reloadTime: 1200,
      recoil: 0.6,
      spread: 0.8,
      range: 40,
      pellets: 1,      // 单发
      auto: false,     // 半自动
    },
    rifle: {
      key: 'rifle',
      name: '🎯 步枪 AK-47',
      icon: '🎯',
      damage: 32,
      fireRate: 100,
      magSize: 30,
      reserve: 90,
      reloadTime: 2000,
      recoil: 1.2,
      spread: 1.5,
      range: 80,
      pellets: 1,
      auto: true,      // 全自动
    },
    sniper: {
      key: 'sniper',
      name: '🔭 狙击 AWP',
      icon: '🔭',
      damage: 120,
      fireRate: 1500,
      magSize: 5,
      reserve: 20,
      reloadTime: 3500,
      recoil: 4,
      spread: 0,
      range: 200,
      pellets: 1,
      auto: false,
    },
    shotgun: {
      key: 'shotgun',
      name: '💥 霰弹 SPAS-12',
      icon: '💥',
      damage: 14,
      fireRate: 800,
      magSize: 8,
      reserve: 32,
      reloadTime: 2500,
      recoil: 3,
      spread: 10,      // 大散布
      range: 20,
      pellets: 8,      // 一发 8 颗
      auto: false,
    },
    rpg: {
      key: 'rpg',
      name: '🚀 火箭筒 RPG',
      icon: '🚀',
      damage: 120,     // 直击
      fireRate: 1500,
      magSize: 1,
      reserve: 4,
      reloadTime: 3000,
      recoil: 6,
      spread: 0,
      range: 100,
      pellets: 1,
      auto: false,
      projectile: 'rocket',  // 抛物体
      explosion: { radius: 4, damage: 80 },
    },
  };
  const WEAPON_ORDER = ['pistol', 'rifle', 'sniper', 'shotgun', 'rpg'];
  /** 当前武器 */
  let weapon = WEAPONS.rifle;

  /* =====================================================
   * 玩家状态
   * ===================================================== */
  /** 每把武器独立的 ammo/reserve */
  /** @type {Record<string,{ammo:number,reserve:number}>} */
  const ammoState = {};
  WEAPON_ORDER.forEach((k) => {
    ammoState[k] = {
      ammo: WEAPONS[k].magSize,
      reserve: WEAPONS[k].reserve,
    };
  });

  const player = {
    hp: 100,
    maxHp: 100,
    armor: 50,
    maxArmor: 100,
    grenades: 3,
    maxGrenades: 3,
    kills: 0,
    deaths: 0,
    dead: false,
    reloading: false,
    lastFireT: 0,
    lastNadeT: 0,
  };

  /** @type {any} */
  let THREE;
  /** @type {any} */
  let scene;
  /** @type {any} */
  let camera;
  /** @type {any} */
  let renderer;
  /** @type {any} */
  let raycaster;

  /** 障碍物 AABB（阻挡移动+子弹） */
  /** @type {any[]} */
  const obstacleBoxes = [];
  /** 障碍物 Mesh（供 Raycaster 阻挡子弹） */
  /** @type {any[]} */
  const obstacleMeshes = [];

  /** 敌人 Group 列表（每个含 head/body/leg 子 Mesh） */
  /** @type {any[]} */
  const enemies = [];

  /** 子弹追踪线（短暂存在） */
  /** @type {{mesh:any, born:number}[]} */
  const tracers = [];
  /** 弹孔贴花 */
  /** @type {{mesh:any, born:number}[]} */
  const bulletHoles = [];

  /** 投掷物（手雷 + 火箭）：mesh + 速度向量 + 类型 */
  /** @type {Array<{mesh:any, vel:any, gravity:number, born:number, fuse:number, type:string, owner:string, damage:number, radius:number}>} */
  const projectiles = [];

  /** 输入 */
  const keys = { w: false, a: false, s: false, d: false, shift: false };
  let yaw = 0;
  let pitch = 0;
  let pitchRecoil = 0; // 后坐力导致的额外抬头
  let vy = 0;
  let onGround = true;
  const EYE_HEIGHT = 1.6;
  let mouseDown = false;

  /** GLTF 模板（可选） */
  /** @type {any} */
  let gltfTemplate = null;
  /** @type {any[]} */
  let gltfClips = [];
  /** @type {any} */
  let SkeletonUtils = null;

  /* =====================================================
   * 日志 / UI 工具
   * ===================================================== */
  const chat = (text, cls = '') => {
    const row = document.createElement('div');
    row.className = 'chat-line ' + cls;
    row.textContent = text;
    chatBox.appendChild(row);
    while (chatBox.children.length > 6) chatBox.removeChild(chatBox.firstChild);
  };

  const killFeedAdd = (text, cls = '') => {
    const row = document.createElement('div');
    row.className = cls;
    row.textContent = text;
    killFeed.appendChild(row);
    setTimeout(() => row.remove(), 4000);
  };

  const updateHud = () => {
    hpBar.style.width = Math.max(0, (player.hp / player.maxHp) * 100) + '%';
    arBar.style.width = Math.max(0, (player.armor / player.maxArmor) * 100) + '%';
    hpText.textContent = String(Math.max(0, Math.round(player.hp)));
    arText.textContent = String(Math.max(0, Math.round(player.armor)));
    const a = ammoState[weapon.key];
    ammoEl.textContent = String(a.ammo);
    ammoTotalEl.textContent = a.reserve >= 999 ? '∞' : String(a.reserve);
    killsEl.textContent = String(player.kills);
    deathsEl.textContent = String(player.deaths);

    const nameEl = document.getElementById('fpsWeaponName');
    if (nameEl) nameEl.textContent = weapon.name;
    const nadeEl = document.getElementById('fpsNade');
    if (nadeEl) nadeEl.textContent = String(player.grenades);

    // 武器栏高亮
    document.querySelectorAll('.loadout-slot').forEach((slot) => {
      const k = /** @type {HTMLElement} */ (slot).dataset.key;
      slot.classList.toggle('active', k === String(WEAPON_ORDER.indexOf(weapon.key) + 1));
    });
  };

  /* =====================================================
   * 启动：加载 Three.js，构建关卡
   * ===================================================== */
  const boot = async () => {
    loadBtn.disabled = true;
    loadBtn.textContent = '⏳ 加载 Three.js...';
    try {
      THREE = await import(
        /* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
      );

      const rect = canvas.getBoundingClientRect();
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(rect.width, rect.height, false);
      renderer.shadowMap.enabled = true;

      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1b2b3a);
      scene.fog = new THREE.Fog(0x1b2b3a, 30, 100);

      camera = new THREE.PerspectiveCamera(75, rect.width / rect.height, 0.1, 200);
      camera.position.set(0, EYE_HEIGHT, 5);

      raycaster = new THREE.Raycaster();

      buildMap();

      // GLTF 可选
      const useGltfCheckbox = /** @type {HTMLInputElement | null} */ (
        document.getElementById('expUseGltf')
      );
      if (useGltfCheckbox && useGltfCheckbox.checked) {
        loadBtn.textContent = '⏳ 加载模型...';
        try {
          const gltfMod = await import(
            /* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js'
          );
          const skMod = await import(
            /* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/utils/SkeletonUtils.js'
          );
          SkeletonUtils = skMod;
          const loader = new gltfMod.GLTFLoader();
          const gltf = await new Promise((res, rej) =>
            loader.load(
              'https://threejs.org/examples/models/gltf/RobotExpressive/RobotExpressive.glb',
              res,
              undefined,
              rej
            )
          );
          gltfTemplate = gltf.scene;
          gltfClips = gltf.animations || [];
          chat('🤖 模型加载完成', 'chat-join');
        } catch (e) {
          chat('⚠️ GLTF 加载失败，使用盒子：' + e.message, 'chat-leave');
        }
      }

      window.addEventListener('resize', onResize);
      bindControls();

      // 动画循环
      let lastT = performance.now();
      let frames = 0;
      let lastFpsT = performance.now();
      renderer.setAnimationLoop(() => {
        const now = performance.now();
        const dt = Math.min(0.05, (now - lastT) / 1000);
        lastT = now;

        updateMovement(dt);
        updateEnemies(dt);
        updateProjectiles(dt);
        updateEffects(now);

        // 连发：按住鼠标左键
        if (mouseDown) fire(now);

        renderer.render(scene, camera);

        frames++;
        if (now - lastFpsT >= 500) {
          fpsEl.textContent = Math.round((frames * 1000) / (now - lastFpsT)).toString();
          posEl.textContent = `(${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)})`;
          frames = 0;
          lastFpsT = now;
        }
      });

      loadBtn.textContent = '✅ 已加载';
      joinBtn.disabled = false;
      overlay.innerHTML = `
        <div>
          <h3 style="margin:0 0 10px;font-size:22px">🎯 点击进入战场</h3>
          <p style="color:var(--muted);margin:0 0 14px">鼠标锁定 + WASD 移动 + 左键开火</p>
          <button class="btn btn-primary" id="expEnter">▶ 进入游戏</button>
          <button class="btn btn-ghost" id="expJoin2">🤖 召唤 AI 敌人 x3</button>
        </div>`;
      document.getElementById('expEnter').addEventListener('click', enterPointerLock);
      document.getElementById('expJoin2').addEventListener('click', spawnBots);

      updateHud();
    } catch (err) {
      loadBtn.disabled = false;
      loadBtn.textContent = '▶ 加载场景';
      alert('加载失败：' + err.message);
    }
  };

  const onResize = () => {
    const r = canvas.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  };

  /* =====================================================
   * 关卡构建：战术地图
   * ===================================================== */
  const buildMap = () => {
    // 光
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(20, 30, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    sun.shadow.camera.left = -40;
    sun.shadow.camera.right = 40;
    sun.shadow.camera.top = 40;
    sun.shadow.camera.bottom = -40;
    scene.add(sun);

    // 地面
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0x3a4a5a })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    obstacleMeshes.push(ground);

    // 网格
    const grid = new THREE.GridHelper(100, 50, 0x1a2a3a, 0x1a2a3a);
    /** @type {any} */ (grid.material).opacity = 0.4;
    /** @type {any} */ (grid.material).transparent = true;
    scene.add(grid);

    // 障碍物：矮墙、箱子（掩体）
    const addBox = (x, y, z, w, h, d, color) => {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshStandardMaterial({ color })
      );
      mesh.position.set(x, y + h / 2, z);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      scene.add(mesh);
      obstacleMeshes.push(mesh);
      obstacleBoxes.push(new THREE.Box3().setFromObject(mesh));
      return mesh;
    };

    // 4 个对称的大掩体（玩家南，敌人北/东/西）
    const wallColor = 0x5a6a7a;
    const crateColor = 0x8b4513;

    // 玩家出生掩体（南）：3 段挡墙
    addBox(-3, 0, 12, 6, 1.4, 0.5, wallColor);
    addBox(3, 0, 12, 6, 1.4, 0.5, wallColor);

    // 敌人北掩体（远）：长墙 + 缺口
    addBox(-5, 0, -14, 4, 1.6, 0.5, wallColor);
    addBox(5, 0, -14, 4, 1.6, 0.5, wallColor);

    // 敌人东掩体
    addBox(14, 0, 0, 0.5, 1.6, 6, wallColor);

    // 敌人西掩体
    addBox(-14, 0, 0, 0.5, 1.6, 6, wallColor);

    // 中央十字掩体（争夺位）
    addBox(0, 0, 0, 1.6, 0.9, 1.6, crateColor);
    addBox(-6, 0, -2, 1.4, 1.2, 1.4, crateColor);
    addBox(6, 0, -2, 1.4, 1.2, 1.4, crateColor);
    addBox(-3, 0, 4, 1.4, 1.0, 1.4, crateColor);
    addBox(3, 0, 4, 1.4, 1.0, 1.4, crateColor);

    // 随机辅助掩体
    for (let i = 0; i < 6; i++) {
      const x = (Math.random() - 0.5) * 24;
      const z = (Math.random() - 0.5) * 20;
      if (Math.abs(x) < 4 && Math.abs(z) < 6) continue;
      addBox(x, 0, z, 1, 0.9, 1, crateColor);
    }

    // 玩家初始位置：南掩体后
    if (camera) {
      camera.position.set(0, EYE_HEIGHT, 14);
    }
  };

  /** 敌人出生点（藏在掩体后） */
  const ENEMY_SPAWNS = [
    { x: 0, z: -16 },   // 北掩体后
    { x: 16, z: 0 },    // 东掩体后
    { x: -16, z: 0 },   // 西掩体后
    { x: -8, z: -16 },  // 北西
    { x: 8, z: -16 },   // 北东
    { x: 16, z: -8 },   // 东北
  ];

  /* =====================================================
   * 敌人创建：Box + head/body/leg 分 Part
   * ===================================================== */
  const createEnemy = (x, z) => {
    const group = new THREE.Group();
    group.position.set(x, 0, z);

    const color = new THREE.Color().setHSL(Math.random() * 0.2, 0.6, 0.5);

    // 身体
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 1.0, 0.4),
      new THREE.MeshStandardMaterial({ color })
    );
    body.position.y = 1.1;
    body.castShadow = true;
    body.userData.hitMultiplier = 1;
    body.userData.partName = 'body';
    group.add(body);

    // 头
    const head = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0xffdbac })
    );
    head.position.y = 1.85;
    head.castShadow = true;
    head.userData.hitMultiplier = 2;
    head.userData.partName = 'head';
    group.add(head);

    // 腿
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.6, 0.6, 0.3),
      new THREE.MeshStandardMaterial({ color: 0x2a3a4a })
    );
    leg.position.y = 0.3;
    leg.castShadow = true;
    leg.userData.hitMultiplier = 0.75;
    leg.userData.partName = 'leg';
    group.add(leg);

    // 血条（Sprite）
    const hpCanvas = document.createElement('canvas');
    hpCanvas.width = 128;
    hpCanvas.height = 16;
    const tex = new THREE.CanvasTexture(hpCanvas);
    const hpSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true }));
    hpSprite.position.y = 2.3;
    hpSprite.scale.set(1.6, 0.2, 1);
    group.add(hpSprite);

    group.userData.hp = 100;
    group.userData.maxHp = 100;
    group.userData.hpCanvas = hpCanvas;
    group.userData.hpTex = tex;
    group.userData.dead = false;
    group.userData.state = 'patrol';
    group.userData.stateT = 0;
    group.userData.targetPos = new THREE.Vector3(
      (Math.random() - 0.5) * 30,
      0,
      (Math.random() - 0.5) * 30
    );
    group.userData.respawnAt = 0;
    group.userData.id = 'bot_' + Math.floor(Math.random() * 10000);
    group.userData.lastFireT = 0;

    drawHpBar(group);

    scene.add(group);
    enemies.push(group);
    return group;
  };

  const drawHpBar = (enemy) => {
    const cv = enemy.userData.hpCanvas;
    const ctx = cv.getContext('2d');
    ctx.clearRect(0, 0, cv.width, cv.height);
    // 背景
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, cv.width, cv.height);
    // 血条
    const ratio = Math.max(0, enemy.userData.hp / enemy.userData.maxHp);
    const g = ctx.createLinearGradient(0, 0, cv.width, 0);
    g.addColorStop(0, '#ff6b81');
    g.addColorStop(1, '#ffb84d');
    ctx.fillStyle = g;
    ctx.fillRect(2, 2, (cv.width - 4) * ratio, cv.height - 4);
    enemy.userData.hpTex.needsUpdate = true;
  };

  /* =====================================================
   * 开火 / 射线命中
   * ===================================================== */
  const fire = (now) => {
    if (player.dead || player.reloading) return;
    if (now - player.lastFireT < weapon.fireRate) return;
    const a = ammoState[weapon.key];
    if (a.ammo <= 0) {
      if (a.reserve > 0) reload();
      return;
    }
    player.lastFireT = now;
    a.ammo -= 1;
    updateHud();

    // 枪口闪光 + 后坐力动画
    muzzleEl.classList.add('flash');
    setTimeout(() => muzzleEl.classList.remove('flash'), 50);
    gunEl.classList.remove('shooting');
    void gunEl.offsetWidth;
    gunEl.classList.add('shooting');
    crosshair.classList.add('spread');
    setTimeout(() => crosshair.classList.remove('spread'), 120);

    // 后坐力（狙击/火箭强后坐力）
    pitchRecoil += (weapon.recoil * Math.PI) / 180;

    // 火箭筒：发射可视化抛物体，命中即爆炸
    if (weapon.projectile === 'rocket') {
      launchRocket();
      return;
    }

    // 普通子弹（霰弹会循环 pellets 次）
    const pellets = weapon.pellets || 1;
    let anyHit = false;
    let anyHead = false;
    for (let i = 0; i < pellets; i++) {
      const result = fireOneRay();
      if (result.enemyHit) {
        anyHit = true;
        if (result.head) anyHead = true;
      }
    }
    if (anyHit) showHitmarker(anyHead);
  };

  /** 发射一条射线 + 渲染弹道，返回是否命中敌人 */
  const fireOneRay = () => {
    const spreadRad = (weapon.spread * Math.PI) / 180;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.x += (Math.random() - 0.5) * spreadRad;
    dir.y += (Math.random() - 0.5) * spreadRad;
    dir.normalize();

    raycaster.set(camera.position, dir);
    raycaster.far = weapon.range;

    const enemyParts = [];
    enemies.forEach((en) => {
      if (en.userData.dead) return;
      en.traverse((c) => {
        if (c.isMesh && c.userData.hitMultiplier !== undefined) enemyParts.push(c);
      });
    });

    const enemyHits = raycaster.intersectObjects(enemyParts, false);
    const obstacleHits = raycaster.intersectObjects(obstacleMeshes, false);
    const enemyHit = enemyHits[0];
    const obstacleHit = obstacleHits[0];

    let endPoint;
    let hitEnemyFlag = false;
    let isHead = false;
    if (enemyHit && (!obstacleHit || enemyHit.distance < obstacleHit.distance)) {
      endPoint = enemyHit.point.clone();
      const mult = enemyHit.object.userData.hitMultiplier || 1;
      const falloff = Math.max(0.4, 1 - enemyHit.distance / weapon.range);
      const dmg = weapon.damage * mult * falloff;
      const headshot = mult === 2;
      hitEnemy(enemyHit.object.parent, dmg, headshot);
      hitEnemyFlag = true;
      isHead = headshot;
    } else if (obstacleHit) {
      endPoint = obstacleHit.point.clone();
      spawnBulletHole(obstacleHit.point, obstacleHit.face.normal, obstacleHit.object);
    } else {
      endPoint = camera.position.clone().add(dir.multiplyScalar(weapon.range));
    }

    spawnTracer(camera.position, endPoint);
    return { enemyHit: hitEnemyFlag, head: isHead };
  };

  const showHitmarker = (headshot) => {
    hitmarker.classList.toggle('headshot', headshot);
    hitmarker.classList.remove('show');
    void hitmarker.offsetWidth;
    hitmarker.classList.add('show');
  };

  /** 弹道轨迹（LineSegments） */
  const spawnTracer = (from, to) => {
    const geo = new THREE.BufferGeometry().setFromPoints([from.clone(), to.clone()]);
    const mat = new THREE.LineBasicMaterial({
      color: 0xffd24d,
      transparent: true,
      opacity: 0.9,
    });
    const line = new THREE.Line(geo, mat);
    scene.add(line);
    tracers.push({ mesh: line, born: performance.now() });
  };

  /** 弹孔（平面贴在命中点，朝法线方向） */
  const spawnBulletHole = (point, normal, targetMesh) => {
    const geo = new THREE.PlaneGeometry(0.08, 0.08);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const hole = new THREE.Mesh(geo, mat);
    hole.position.copy(point).addScaledVector(normal, 0.005);
    // 让平面法线对齐命中法线
    hole.lookAt(point.clone().add(normal));
    scene.add(hole);
    bulletHoles.push({ mesh: hole, born: performance.now() });
    // 限制总数
    if (bulletHoles.length > 50) {
      const old = bulletHoles.shift();
      scene.remove(old.mesh);
    }
  };

  /** 伤害敌人 */
  const hitEnemy = (enemy, dmg, headshot) => {
    if (!enemy || enemy.userData.dead) return;
    enemy.userData.hp -= dmg;
    drawHpBar(enemy);
    if (enemy.userData.hp <= 0) {
      enemy.userData.dead = true;
      enemy.userData.respawnAt = performance.now() + 3000;
      // 倒地
      enemy.rotation.x = -Math.PI / 2;
      enemy.position.y = -0.3;
      player.kills += 1;
      updateHud();
      killFeedAdd(
        `🎯 你 ${headshot ? '爆头' : '击杀'} 了 ${enemy.userData.id}`,
        headshot ? 'headshot' : 'me'
      );
    }
  };

  /* =====================================================
   * 玩家受伤
   * ===================================================== */
  const takeDamage = (dmg, headshot) => {
    if (player.dead) return;
    if (player.armor > 0) {
      const absorbed = Math.min(player.armor, dmg * 0.66);
      player.armor -= absorbed;
      dmg -= absorbed;
    }
    player.hp -= dmg;
    damageEl.classList.remove('hit');
    void damageEl.offsetWidth;
    damageEl.classList.add('hit');
    setTimeout(() => damageEl.classList.remove('hit'), 300);

    if (player.hp <= 0) die();
    updateHud();
  };

  const die = () => {
    player.dead = true;
    player.hp = 0;
    player.deaths += 1;
    updateHud();
    respawnBox.classList.remove('hide');
    respawnTitle.textContent = '💀 你被击杀';
    let secs = 3;
    respawnTip.textContent = `${secs} 秒后复活...`;
    const timer = setInterval(() => {
      secs -= 1;
      if (secs <= 0) {
        clearInterval(timer);
        respawn();
      } else {
        respawnTip.textContent = `${secs} 秒后复活...`;
      }
    }, 1000);
  };

  const respawn = () => {
    player.hp = player.maxHp;
    player.armor = player.maxArmor;
    player.grenades = player.maxGrenades;
    // 所有武器重置弹药
    WEAPON_ORDER.forEach((k) => {
      ammoState[k].ammo = WEAPONS[k].magSize;
      ammoState[k].reserve = WEAPONS[k].reserve;
    });
    player.dead = false;
    // 玩家在南掩体后重生
    camera.position.set(0, EYE_HEIGHT, 14);
    yaw = 0;
    pitch = 0;
    respawnBox.classList.add('hide');
    updateHud();
  };

  /* =====================================================
   * 换弹
   * ===================================================== */
  const reload = () => {
    if (player.reloading) return;
    const a = ammoState[weapon.key];
    if (a.ammo === weapon.magSize || a.reserve === 0) return;
    player.reloading = true;
    chat(`🔄 ${weapon.name} 换弹中...`);
    const w = weapon;
    setTimeout(() => {
      const aa = ammoState[w.key];
      const need = w.magSize - aa.ammo;
      const take = Math.min(need, aa.reserve >= 999 ? need : aa.reserve);
      aa.ammo += take;
      if (aa.reserve < 999) aa.reserve -= take;
      player.reloading = false;
      updateHud();
    }, w.reloadTime);
  };

  /* =====================================================
   * 武器切换
   * ===================================================== */
  const switchWeapon = (key) => {
    if (!WEAPONS[key] || weapon.key === key || player.dead || player.reloading) return;
    weapon = WEAPONS[key];
    chat(`🔫 切换到 ${weapon.name}`);
    updateHud();
  };

  /* =====================================================
   * 手雷投掷 + 抛物线
   * ===================================================== */
  const throwGrenade = (now) => {
    if (player.dead) return;
    if (player.grenades <= 0) return;
    if (now - player.lastNadeT < 600) return;
    player.lastNadeT = now;
    player.grenades -= 1;
    updateHud();

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    // 起点比相机略低（手部）
    const start = camera.position.clone().addScaledVector(dir, 0.5);
    start.y -= 0.2;

    // 初速度：朝准星方向 18m/s + 抬头分量
    const vel = dir.clone().multiplyScalar(20);
    vel.y += 5;

    // 球体（带绿色）
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 12),
      new THREE.MeshStandardMaterial({ color: 0x4caf50, emissive: 0x1a3a1a })
    );
    mesh.position.copy(start);
    mesh.castShadow = true;
    scene.add(mesh);

    projectiles.push({
      mesh,
      vel,
      gravity: 18,
      born: now,
      fuse: 1500,
      type: 'grenade',
      owner: 'player',
      damage: 100,
      radius: 5,
    });
    chat('💣 投掷手雷');
  };

  /** 火箭弹（直线速度 + 命中即爆，无重力衰减用极小重力） */
  const launchRocket = () => {
    const now = performance.now();
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);

    const start = camera.position.clone().addScaledVector(dir, 0.6);
    const vel = dir.clone().multiplyScalar(40); // 40 m/s

    // 火箭外形：圆锥
    const mesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.6, 12),
      new THREE.MeshStandardMaterial({ color: 0x9e9e9e, emissive: 0xff5722 })
    );
    mesh.position.copy(start);
    mesh.castShadow = true;
    // 朝向飞行方向
    mesh.lookAt(start.clone().add(dir));
    mesh.rotateX(Math.PI / 2);
    scene.add(mesh);

    projectiles.push({
      mesh,
      vel,
      gravity: 2, // 轻微下坠
      born: now,
      fuse: 5000,
      type: 'rocket',
      owner: 'player',
      damage: weapon.explosion.damage,
      radius: weapon.explosion.radius,
    });
  };

  /** 投掷物物理 + 命中检测 */
  const updateProjectiles = (dt) => {
    const now = performance.now();
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const p = projectiles[i];
      const age = now - p.born;

      // 重力
      p.vel.y -= p.gravity * dt;

      // 步进位置（简化连续：分多步检测）
      const step = p.vel.clone().multiplyScalar(dt);
      const newPos = p.mesh.position.clone().add(step);

      // 火箭：命中检测（射线 = 当前到下一帧位置）
      if (p.type === 'rocket') {
        const rayDir = step.clone().normalize();
        raycaster.set(p.mesh.position, rayDir);
        raycaster.far = step.length() + 0.3;
        const enemyParts = [];
        enemies.forEach((en) => {
          if (en.userData.dead) return;
          en.traverse((c) => {
            if (c.isMesh && c.userData.hitMultiplier !== undefined) enemyParts.push(c);
          });
        });
        const eHit = raycaster.intersectObjects(enemyParts, false)[0];
        const oHit = raycaster.intersectObjects(obstacleMeshes, false)[0];
        const closest =
          eHit && (!oHit || eHit.distance < oHit.distance) ? eHit : oHit;
        if (closest) {
          explode(closest.point, p.damage, p.radius, p.owner);
          scene.remove(p.mesh);
          projectiles.splice(i, 1);
          continue;
        }
      } else {
        // 手雷：触地反弹
        if (newPos.y <= 0.18) {
          newPos.y = 0.18;
          p.vel.y *= -0.4;
          p.vel.x *= 0.7;
          p.vel.z *= 0.7;
        }
      }

      p.mesh.position.copy(newPos);

      // 引信到时爆炸
      if (age >= p.fuse) {
        explode(p.mesh.position, p.damage, p.radius, p.owner);
        scene.remove(p.mesh);
        projectiles.splice(i, 1);
      }
    }
  };

  /** 范围爆炸：对所有敌人 + 玩家结算伤害 */
  const explode = (center, baseDmg, radius, owner) => {
    // 视觉光圈（3D 球壳 + DOM 闪光）
    const ring = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 16, 16),
      new THREE.MeshBasicMaterial({
        color: 0xffaa33,
        transparent: true,
        opacity: 0.9,
      })
    );
    ring.position.copy(center);
    scene.add(ring);
    const start = performance.now();
    const dur = 400;
    const expand = () => {
      const t = (performance.now() - start) / dur;
      if (t >= 1) {
        scene.remove(ring);
        return;
      }
      const s = 0.3 + t * radius * 2;
      ring.scale.set(s, s, s);
      /** @type {any} */ (ring.material).opacity = 0.9 * (1 - t);
      requestAnimationFrame(expand);
    };
    expand();

    // 敌人结算
    enemies.forEach((en) => {
      if (en.userData.dead) return;
      const dist = en.position.distanceTo(center);
      if (dist < radius) {
        const dmg = baseDmg * (1 - dist / radius);
        hitEnemy(en, dmg, false);
      }
    });

    // 玩家自伤（友军伤害）
    const myDist = camera.position.distanceTo(center);
    if (myDist < radius && !player.dead) {
      const dmg = baseDmg * (1 - myDist / radius);
      takeDamage(dmg, false);
      if (owner === 'player') {
        chat('💥 自爆！注意安全距离');
      }
    }
  };

  /* =====================================================
   * 敌人 AI
   * ===================================================== */
  const updateEnemies = (dt) => {
    const now = performance.now();
    enemies.forEach((en) => {
      // 死亡后等待复活
      if (en.userData.dead) {
        if (now >= en.userData.respawnAt) {
          en.userData.hp = en.userData.maxHp;
          en.userData.dead = false;
          en.rotation.x = 0;
          // 在掩体出生点重生
          const sp = ENEMY_SPAWNS[Math.floor(Math.random() * ENEMY_SPAWNS.length)];
          en.position.set(sp.x, 0, sp.z);
          en.userData.state = 'patrol';
          drawHpBar(en);
        }
        return;
      }

      const toPlayer = new THREE.Vector3().subVectors(camera.position, en.position);
      const dist = toPlayer.length();
      toPlayer.y = 0;
      toPlayer.normalize();

      // 旋转朝玩家
      const targetAngle = Math.atan2(toPlayer.x, toPlayer.z);
      en.rotation.y += (targetAngle - en.rotation.y) * Math.min(1, dt * 5);

      // 视野 60°扇形 + 距离 30m
      const inSight = dist < 30;

      if (inSight && !player.dead) {
        // 靠近并射击
        if (dist > 8) {
          en.position.x += toPlayer.x * 2 * dt;
          en.position.z += toPlayer.z * 2 * dt;
        }
        // 射击（延迟 + 扩散）
        if (now - en.userData.lastFireT > 900) {
          en.userData.lastFireT = now;
          // 射线判定（带遮挡）
          const enemyEye = en.position.clone();
          enemyEye.y = 1.7;
          const toEye = new THREE.Vector3()
            .subVectors(camera.position, enemyEye)
            .normalize();
          // 加散布 ±5°
          toEye.x += (Math.random() - 0.5) * 0.09;
          toEye.y += (Math.random() - 0.5) * 0.09;
          toEye.normalize();
          raycaster.set(enemyEye, toEye);
          raycaster.far = 40;
          const blocked = raycaster.intersectObjects(obstacleMeshes, false);
          // 计算到玩家的距离
          const toPlayerDist = camera.position.distanceTo(enemyEye);
          const isBlocked =
            blocked.length > 0 && blocked[0].distance < toPlayerDist;
          // 弹道特效（即使没命中也画）
          const endP = isBlocked
            ? blocked[0].point
            : camera.position.clone().addScaledVector(toEye, 0.5);
          spawnTracer(enemyEye, endP);

          if (!isBlocked) {
            // 给玩家造成伤害（随机 8-18）
            const headshot = Math.random() < 0.1;
            const dmg = (headshot ? 40 : 10 + Math.random() * 8);
            takeDamage(dmg, headshot);
            if (player.dead) {
              killFeedAdd(`💀 ${en.userData.id} 击杀了你`);
            }
          }
        }
      } else {
        // 巡逻
        const dir = new THREE.Vector3().subVectors(en.userData.targetPos, en.position);
        dir.y = 0;
        if (dir.length() < 1) {
          en.userData.targetPos.set(
            (Math.random() - 0.5) * 30,
            0,
            (Math.random() - 0.5) * 30
          );
        } else {
          dir.normalize();
          en.position.x += dir.x * 1.2 * dt;
          en.position.z += dir.z * 1.2 * dt;
        }
      }
    });
  };

  /** 清理过期弹道/弹孔 */
  const updateEffects = (now) => {
    // 弹道 80ms 消失
    for (let i = tracers.length - 1; i >= 0; i--) {
      const t = tracers[i];
      const age = now - t.born;
      if (age > 80) {
        scene.remove(t.mesh);
        tracers.splice(i, 1);
      } else {
        t.mesh.material.opacity = 0.9 * (1 - age / 80);
      }
    }
    // 弹孔 15s 淡出
    for (let i = bulletHoles.length - 1; i >= 0; i--) {
      const h = bulletHoles[i];
      const age = now - h.born;
      if (age > 15000) {
        scene.remove(h.mesh);
        bulletHoles.splice(i, 1);
      }
    }
    // 后坐力恢复
    pitchRecoil *= 0.9;
  };

  /* =====================================================
   * 输入
   * ===================================================== */
  const bindControls = () => {
    document.addEventListener('keydown', (e) => {
      if (document.pointerLockElement !== canvas) return;
      if (e.code === 'KeyW') keys.w = true;
      if (e.code === 'KeyA') keys.a = true;
      if (e.code === 'KeyS') keys.s = true;
      if (e.code === 'KeyD') keys.d = true;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.shift = true;
      if (e.code === 'Space') {
        if (onGround) {
          vy = 5;
          onGround = false;
        }
        e.preventDefault();
      }
      if (e.code === 'KeyR') reload();
      if (e.code === 'KeyG') throwGrenade(performance.now());
      if (e.code === 'Digit1') switchWeapon('pistol');
      if (e.code === 'Digit2') switchWeapon('rifle');
      if (e.code === 'Digit3') switchWeapon('sniper');
      if (e.code === 'Digit4') switchWeapon('shotgun');
      if (e.code === 'Digit5') switchWeapon('rpg');
    });
    document.addEventListener('keyup', (e) => {
      if (e.code === 'KeyW') keys.w = false;
      if (e.code === 'KeyA') keys.a = false;
      if (e.code === 'KeyS') keys.s = false;
      if (e.code === 'KeyD') keys.d = false;
      if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') keys.shift = false;
    });

    document.addEventListener('mousemove', (e) => {
      if (document.pointerLockElement !== canvas) return;
      yaw -= e.movementX * 0.002;
      pitch -= e.movementY * 0.002;
      pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, pitch));
    });

    // 鼠标按下开火
    canvas.addEventListener('mousedown', (e) => {
      if (document.pointerLockElement !== canvas) {
        enterPointerLock();
        return;
      }
      if (e.button === 0) mouseDown = true;
    });
    window.addEventListener('mouseup', () => (mouseDown = false));

    // 点击武器栏图标也能切换
    document.querySelectorAll('.loadout-slot').forEach((slot) => {
      slot.addEventListener('click', (e) => {
        const k = /** @type {HTMLElement} */ (slot).dataset.key;
        if (k === 'g') {
          throwGrenade(performance.now());
        } else {
          const idx = Number(k) - 1;
          const wkey = WEAPON_ORDER[idx];
          if (wkey) switchWeapon(wkey);
        }
        e.stopPropagation();
      });
    });
  };

  const enterPointerLock = () => {
    canvas.requestPointerLock();
  };
  document.addEventListener('pointerlockchange', () => {
    if (document.pointerLockElement === canvas) {
      overlay.classList.add('hide');
    } else {
      overlay.classList.remove('hide');
      mouseDown = false;
    }
  });

  /* =====================================================
   * 玩家移动（复用之前 AABB 碰撞）
   * ===================================================== */
  const updateMovement = (dt) => {
    if (player.dead) return;
    const speed = keys.shift ? 8 : 5;
    const forward = new THREE.Vector3(Math.sin(yaw), 0, Math.cos(yaw));
    const right = new THREE.Vector3(forward.z, 0, -forward.x);

    let dx = 0;
    let dz = 0;
    if (keys.w) {
      dx -= forward.x * speed * dt;
      dz -= forward.z * speed * dt;
    }
    if (keys.s) {
      dx += forward.x * speed * dt;
      dz += forward.z * speed * dt;
    }
    if (keys.a) {
      dx -= right.x * speed * dt;
      dz -= right.z * speed * dt;
    }
    if (keys.d) {
      dx += right.x * speed * dt;
      dz += right.z * speed * dt;
    }

    camera.position.x += dx;
    if (hitObstacle()) camera.position.x -= dx;
    camera.position.z += dz;
    if (hitObstacle()) camera.position.z -= dz;

    vy -= 15 * dt;
    camera.position.y += vy * dt;
    if (camera.position.y <= EYE_HEIGHT) {
      camera.position.y = EYE_HEIGHT;
      vy = 0;
      onGround = true;
    }

    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch + pitchRecoil;
  };

  const hitObstacle = () => {
    const px = camera.position.x;
    const pz = camera.position.z;
    const r = 0.4;
    for (const bbox of obstacleBoxes) {
      if (
        px + r > bbox.min.x &&
        px - r < bbox.max.x &&
        pz + r > bbox.min.z &&
        pz - r < bbox.max.z &&
        camera.position.y - 1.6 < bbox.max.y
      ) {
        return true;
      }
    }
    return false;
  };

  /* =====================================================
   * 召唤 AI 敌人（在掩体出生点）
   * ===================================================== */
  const spawnBots = () => {
    if (enemies.length >= 6) {
      chat('⚠️ 已达敌人上限');
      return;
    }
    const used = new Set(
      enemies.filter((e) => !e.userData.dead).map((e) => `${Math.round(e.position.x)}_${Math.round(e.position.z)}`)
    );
    let count = 0;
    for (const sp of ENEMY_SPAWNS) {
      if (count >= 3) break;
      const key = `${sp.x}_${sp.z}`;
      if (used.has(key)) continue;
      const bot = createEnemy(sp.x, sp.z);
      // 朝向玩家（南）
      bot.rotation.y = Math.atan2(0 - sp.x, 14 - sp.z);
      chat(`🤖 ${bot.userData.id} 部署到掩体 (${sp.x}, ${sp.z})`, 'chat-join');
      count += 1;
    }
    onlineEl.textContent = String(enemies.filter((e) => !e.userData.dead).length + 1);
  };

  loadBtn.addEventListener('click', boot);
  joinBtn.addEventListener('click', spawnBots);
})();

/* =====================================================
 * 24. WebRTC 深度：MediaRecorder 本地录制
 * ===================================================== */
(function initMediaRecorder() {
  const startBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('recStart')
  );
  const stopBtn = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('recStop')
  );
  const timeEl = document.getElementById('recTime');
  if (!startBtn || !stopBtn || !timeEl) return;

  /** @type {MediaRecorder | null} */
  let recorder = null;
  /** @type {Blob[]} */
  let chunks = [];
  /** @type {number | null} */
  let timer = null;
  let sec = 0;

  startBtn.addEventListener('click', async () => {
    let stream =
      window.__rtc && window.__rtc.getLocalStream && window.__rtc.getLocalStream();
    if (!stream) {
      // 如果 7.11 还未启动摄像头，独立请求一次
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (e) {
        alert('无法获取摄像头：' + e.message);
        return;
      }
    }

    chunks = [];
    sec = 0;
    timeEl.textContent = '0';

    /** 优雅降级选 mime */
    const mimeCandidates = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];
    const mime = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || '';

    try {
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    } catch (e) {
      alert('MediaRecorder 初始化失败：' + e.message);
      return;
    }

    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const ext = (recorder.mimeType || 'video/webm').includes('mp4') ? 'mp4' : 'webm';
      a.href = url;
      a.download = `webrtc-record-${Date.now()}.${ext}`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    };
    recorder.start(1000);

    timer = window.setInterval(() => {
      sec += 1;
      timeEl.textContent = String(sec);
    }, 1000);

    startBtn.disabled = true;
    stopBtn.disabled = false;
  });

  stopBtn.addEventListener('click', () => {
    if (recorder && recorder.state !== 'inactive') recorder.stop();
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
    startBtn.disabled = false;
    stopBtn.disabled = true;
  });
})();

/* =====================================================
 * 25. 现代 Web API 能力检测与实战
 * ===================================================== */
(function initModernApis() {
  /** 写入徽章：api-ok / api-no */
  /**
   * @param {string} name
   * @param {boolean} supported
   * @param {string} [label]
   */
  const setSupport = (name, supported, label) => {
    document
      .querySelectorAll(`.api-support[data-api="${name}"]`)
      .forEach((el) => {
        el.textContent = label || (supported ? '✅ 支持' : '❌ 未支持');
        el.classList.add(supported ? 'api-ok' : 'api-no');
      });
  };

  /** 简便的 out 写入 */
  const out = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  /* ========== 能力矩阵检测 ========== */
  const w = /** @type {any} */ (window);
  const n = /** @type {any} */ (navigator);
  setSupport('webtransport', typeof w.WebTransport === 'function');
  setSupport('webcodecs', typeof w.VideoEncoder === 'function');
  setSupport('locks', !!(n.locks && n.locks.request));
  setSupport('payment', typeof w.PaymentRequest === 'function');
  setSupport('webauthn', !!(n.credentials && n.credentials.create));
  setSupport('filehandling', 'launchQueue' in w);
  setSupport('idle', typeof w.IdleDetector === 'function');
  setSupport('hid', !!n.hid);
  setSupport('serial', !!n.serial);
  setSupport('midi', typeof n.requestMIDIAccess === 'function');
  setSupport('xr', !!n.xr);

  /* ========== WebTransport 检测 ========== */
  const wtBtn = document.getElementById('wtCheck');
  if (wtBtn) {
    wtBtn.addEventListener('click', () => {
      if (typeof w.WebTransport === 'function') {
        out(
          'wtOut',
          '✅ 可用 · 需要 HTTP/3 服务端。示例：new WebTransport("https://your-h3-server/wt")'
        );
      } else {
        out('wtOut', '❌ 当前浏览器未支持（Chrome 97+ / Edge 97+）');
      }
    });
  }

  /* ========== WebCodecs 列出支持的编码器 ========== */
  const wcBtn = document.getElementById('wcCheck');
  if (wcBtn) {
    wcBtn.addEventListener('click', async () => {
      if (typeof w.VideoEncoder !== 'function') {
        out('wcOut', '❌ 当前浏览器未支持 WebCodecs');
        return;
      }
      const codecs = [
        'avc1.42E01E', // H.264 Baseline
        'avc1.64001F', // H.264 High
        'vp8',
        'vp09.00.10.08', // VP9
        'av01.0.01M.08', // AV1
        'hev1.1.6.L93.B0', // HEVC
      ];
      const results = [];
      for (const codec of codecs) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const r = await w.VideoEncoder.isConfigSupported({
            codec,
            width: 1280,
            height: 720,
          });
          results.push(`${r.supported ? '✅' : '❌'}  ${codec}`);
        } catch {
          results.push(`❌  ${codec}`);
        }
      }
      out('wcOut', results.join('\n'));
    });
  }

  /* ========== WASM 跑分 ========== */
  const wasmBtn = document.getElementById('wasmRun');
  if (wasmBtn) {
    wasmBtn.addEventListener('click', async () => {
      out('wasmOut', '⏳ 编译 WASM 中...');

      // 手写 WAT -> wasm bytes：导出 fib(n) 函数
      // (module (func (export "fib") (param $n i32) (result i32)
      //   local.get $n
      //   i32.const 2
      //   i32.lt_s
      //   if (result i32)
      //     local.get $n
      //   else
      //     local.get $n i32.const 1 i32.sub call 0
      //     local.get $n i32.const 2 i32.sub call 0
      //     i32.add
      //   end))
      // prettier-ignore
      const wasmBytes = new Uint8Array([
        0, 97, 115, 109, 1, 0, 0, 0,
        1, 6, 1, 96, 1, 127, 1, 127,
        3, 2, 1, 0,
        7, 7, 1, 3, 102, 105, 98, 0, 0,
        10, 31, 1, 29, 0,
        32, 0, 65, 2, 72,
        4, 127, 32, 0,
        5,
        32, 0, 65, 1, 107, 16, 0,
        32, 0, 65, 2, 107, 16, 0,
        106,
        11, 11,
      ]);

      let wasmFib;
      try {
        const { instance } = await WebAssembly.instantiate(wasmBytes);
        wasmFib = /** @type {(n:number)=>number} */ (instance.exports.fib);
      } catch (e) {
        out('wasmOut', '❌ WASM 加载失败：' + e.message);
        return;
      }

      const N = 35;
      const jsFib = (x) => (x < 2 ? x : jsFib(x - 1) + jsFib(x - 2));

      // 预热
      jsFib(10);
      wasmFib(10);

      const t1 = performance.now();
      const r1 = jsFib(N);
      const jsCost = performance.now() - t1;

      const t2 = performance.now();
      const r2 = wasmFib(N);
      const wasmCost = performance.now() - t2;

      const ratio = (jsCost / wasmCost).toFixed(2);
      out(
        'wasmOut',
        `fib(${N}) = ${r1}\n` +
          `JS:   ${jsCost.toFixed(1)} ms\n` +
          `WASM: ${wasmCost.toFixed(1)} ms\n` +
          `WASM 快 ${ratio} 倍 ${r1 === r2 ? '（结果一致 ✅）' : '（结果不一致 ❌）'}`
      );
    });
  }

  /* ========== Web Locks：5 次并发抢同一把锁 ========== */
  const lockBtn = document.getElementById('lockRun');
  if (lockBtn) {
    lockBtn.addEventListener('click', async () => {
      if (!(n.locks && n.locks.request)) {
        out('lockOut', '❌ 当前浏览器未支持 Web Locks');
        return;
      }
      const lines = [];
      const run = (i) =>
        n.locks.request('demo-lock', async () => {
          const start = performance.now();
          lines.push(`[#${i}] 🔓 拿到锁`);
          out('lockOut', lines.join('\n'));
          await new Promise((r) => setTimeout(r, 300));
          lines.push(`[#${i}] 🔒 释放（持有 ${(performance.now() - start).toFixed(0)}ms）`);
          out('lockOut', lines.join('\n'));
        });
      lines.push('🚀 并发发起 5 个请求，观察顺序获得锁：');
      out('lockOut', lines.join('\n'));
      await Promise.all([run(1), run(2), run(3), run(4), run(5)]);
      lines.push('✅ 全部完成');
      out('lockOut', lines.join('\n'));
    });
  }

  /* ========== Payment Request ========== */
  const payBtn = document.getElementById('payRun');
  if (payBtn) {
    payBtn.addEventListener('click', async () => {
      if (typeof w.PaymentRequest !== 'function') {
        out('payOut', '❌ 未支持');
        return;
      }
      try {
        const req = new w.PaymentRequest(
          [{ supportedMethods: 'basic-card', data: { supportedNetworks: ['visa', 'mastercard'] } }],
          {
            total: {
              label: '前端全景指南 · VIP',
              amount: { currency: 'CNY', value: '99.00' },
            },
            displayItems: [
              { label: '课程', amount: { currency: 'CNY', value: '99.00' } },
            ],
          }
        );
        const canMake = await req.canMakePayment();
        if (!canMake) {
          out('payOut', '⚠️ 浏览器无可用支付方式');
          return;
        }
        const resp = await req.show();
        await resp.complete('success');
        out('payOut', '✅ 已调起原生支付面板');
      } catch (e) {
        out('payOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== WebAuthn 注册演示 ========== */
  const waBtn = document.getElementById('waRun');
  if (waBtn) {
    waBtn.addEventListener('click', async () => {
      if (!(n.credentials && n.credentials.create)) {
        out('waOut', '❌ 未支持');
        return;
      }
      try {
        const challenge = crypto.getRandomValues(new Uint8Array(32));
        const userId = crypto.getRandomValues(new Uint8Array(16));
        const cred = /** @type {any} */ (
          await n.credentials.create({
            publicKey: {
              challenge,
              rp: { name: '前端全景指南' },
              user: { id: userId, name: 'demo@fe.com', displayName: 'Demo User' },
              pubKeyCredParams: [
                { type: 'public-key', alg: -7 }, // ES256
                { type: 'public-key', alg: -257 }, // RS256
              ],
              authenticatorSelection: {
                userVerification: 'preferred',
              },
              timeout: 60000,
              attestation: 'none',
            },
          })
        );
        out(
          'waOut',
          '✅ 已创建凭证\nID: ' +
            cred.id.slice(0, 32) +
            '...\nType: ' +
            cred.type +
            '\n服务器应保存此凭证公钥，后续登录时验证签名即可无密码登录。'
        );
      } catch (e) {
        out('waOut', '❌ ' + e.name + ': ' + e.message);
      }
    });
  }

  /* ========== File Handling：检查是否被从文件系统拉起 ========== */
  if ('launchQueue' in w) {
    w.launchQueue.setConsumer(async (launchParams) => {
      if (!launchParams.files || launchParams.files.length === 0) return;
      const names = [];
      for (const handle of launchParams.files) {
        const file = await handle.getFile();
        names.push(`${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      }
      out('fhOut', '📂 从文件系统启动：\n' + names.join('\n'));
    });
    out('fhOut', '✅ 已注册 launchQueue。发布为 PWA 并在 manifest.json 配置 file_handlers 后可双击打开。');
  } else {
    out('fhOut', '❌ 当前浏览器未支持（Chrome 102+ 且需安装为 PWA）');
  }

  /* ========== Idle Detection ========== */
  const idleBtn = document.getElementById('idleRun');
  if (idleBtn) {
    idleBtn.addEventListener('click', async () => {
      if (typeof w.IdleDetector !== 'function') {
        out('idleOut', '❌ 未支持');
        return;
      }
      try {
        const state = await w.IdleDetector.requestPermission();
        if (state !== 'granted') {
          out('idleOut', '❌ 用户拒绝权限');
          return;
        }
        const detector = new w.IdleDetector();
        detector.addEventListener('change', () => {
          out(
            'idleOut',
            `用户状态: ${detector.userState} · 屏幕: ${detector.screenState}`
          );
        });
        await detector.start({ threshold: 60_000 });
        out('idleOut', '✅ 已开始监听（60s 无操作会切 idle）');
      } catch (e) {
        out('idleOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== Clipboard 高级 ========== */
  const cbWrite = document.getElementById('cbWrite');
  const cbRead = document.getElementById('cbRead');
  if (cbWrite) {
    cbWrite.addEventListener('click', async () => {
      try {
        const html = '<b style="color:#6c8cff">来自网页的富文本</b> 🎉';
        const text = '来自网页的富文本 🎉';
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([html], { type: 'text/html' }),
            'text/plain': new Blob([text], { type: 'text/plain' }),
          }),
        ]);
        out('cbOut', '✅ 已写入（可粘贴到富文本编辑器看效果）');
      } catch (e) {
        out('cbOut', '❌ ' + e.message);
      }
    });
  }
  if (cbRead) {
    cbRead.addEventListener('click', async () => {
      try {
        const items = await navigator.clipboard.read();
        const lines = [];
        for (const item of items) {
          lines.push(`MIME: ${item.types.join(', ')}`);
          if (item.types.includes('text/plain')) {
            const blob = await item.getType('text/plain');
            lines.push('  text: ' + (await blob.text()).slice(0, 80));
          }
          if (item.types.includes('text/html')) {
            const blob = await item.getType('text/html');
            lines.push('  html: ' + (await blob.text()).slice(0, 80));
          }
        }
        out('cbOut', lines.join('\n'));
      } catch (e) {
        out('cbOut', '❌ ' + e.message + '（需要用户手势且页面聚焦）');
      }
    });
  }

  /* ========== WebHID ========== */
  const hidBtn = document.getElementById('hidRun');
  if (hidBtn) {
    hidBtn.addEventListener('click', async () => {
      if (!n.hid) {
        out('hidOut', '❌ 未支持');
        return;
      }
      try {
        const devices = await n.hid.requestDevice({ filters: [] });
        if (!devices.length) {
          out('hidOut', '⚠️ 未选择设备');
          return;
        }
        const dev = devices[0];
        await dev.open();
        let msg = `✅ ${dev.productName || 'HID 设备'}\nVID: 0x${dev.vendorId.toString(16)} · PID: 0x${dev.productId.toString(16)}\n等待输入报告...`;
        out('hidOut', msg);
        dev.addEventListener('inputreport', (e) => {
          const data = Array.from(new Uint8Array(e.data.buffer))
            .slice(0, 8)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join(' ');
          out('hidOut', msg + '\n← ' + data);
        });
      } catch (e) {
        out('hidOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== Web Serial ========== */
  const serialBtn = document.getElementById('serialRun');
  if (serialBtn) {
    serialBtn.addEventListener('click', async () => {
      if (!n.serial) {
        out('serialOut', '❌ 未支持');
        return;
      }
      try {
        const port = await n.serial.requestPort();
        await port.open({ baudRate: 115200 });
        out('serialOut', '✅ 串口已打开\n' + JSON.stringify(port.getInfo(), null, 2));

        const reader = port.readable.getReader();
        let total = 0;
        const readLoop = async () => {
          try {
            while (true) {
              // eslint-disable-next-line no-await-in-loop
              const { value, done } = await reader.read();
              if (done) break;
              total += value.byteLength;
              out('serialOut', `✅ 已打开 · 累计接收 ${total} B`);
            }
          } catch {
            /* ignore */
          }
        };
        readLoop();
      } catch (e) {
        out('serialOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== Web MIDI ========== */
  const midiBtn = document.getElementById('midiRun');
  if (midiBtn) {
    midiBtn.addEventListener('click', async () => {
      if (typeof n.requestMIDIAccess !== 'function') {
        out('midiOut', '❌ 未支持');
        return;
      }
      try {
        const midi = await n.requestMIDIAccess();
        const ins = [];
        midi.inputs.forEach((input) => ins.push(`${input.name} (${input.manufacturer || '-'})`));
        const outs = [];
        midi.outputs.forEach((o) => outs.push(o.name));
        let msg = `✅ 已授权\n输入设备 (${midi.inputs.size}): ${ins.join(', ') || '无'}\n输出设备 (${midi.outputs.size}): ${outs.join(', ') || '无'}`;
        out('midiOut', msg);

        midi.inputs.forEach((input) => {
          input.onmidimessage = (e) => {
            const [cmd, note, vel] = e.data;
            out(
              'midiOut',
              msg + `\n🎵 cmd=${cmd.toString(16)} note=${note} vel=${vel}`
            );
          };
        });
      } catch (e) {
        out('midiOut', '❌ ' + e.message);
      }
    });
  }

  /* ========== WebXR ========== */
  const xrBtn = document.getElementById('xrRun');
  if (xrBtn) {
    xrBtn.addEventListener('click', async () => {
      if (!n.xr) {
        out('xrOut', '❌ 当前浏览器/设备未支持 WebXR');
        return;
      }
      try {
        const vr = await n.xr.isSessionSupported('immersive-vr').catch(() => false);
        const ar = await n.xr.isSessionSupported('immersive-ar').catch(() => false);
        const inline = await n.xr.isSessionSupported('inline').catch(() => false);
        out(
          'xrOut',
          `immersive-vr: ${vr ? '✅' : '❌'}\nimmersive-ar: ${ar ? '✅' : '❌'}\ninline:        ${inline ? '✅' : '❌'}\n\n在 VR 头显 (Quest / Vision Pro) 中访问本页可直接进入沉浸模式。`
        );
      } catch (e) {
        out('xrOut', '❌ ' + e.message);
      }
    });
  }
})();

/* =====================================================
 * 26. SVG 流程编辑器（Demo A）
 *    节点拖拽 + 锚点连线 + 选中删除 + Undo/Redo + JSON 导入导出 + 自动布局
 * ===================================================== */
(function initFlowEditor() {
  const stage = document.getElementById('flowStage');
  const svg = /** @type {SVGSVGElement | null} */ (document.getElementById('flowSvg'));
  const edgesG = document.getElementById('flowEdges');
  const nodesG = document.getElementById('flowNodes');
  const ghost = document.getElementById('flowGhost');
  const tip = document.getElementById('flowTip');
  const jsonArea = /** @type {HTMLTextAreaElement | null} */ (
    document.getElementById('flowJson')
  );

  if (!stage || !svg || !edgesG || !nodesG || !ghost || !tip || !jsonArea) return;

  const NS = 'http://www.w3.org/2000/svg';

  /**
   * @typedef {{id:string,type:string,x:number,y:number,label:string}} FNode
   * @typedef {{id:string,from:string,to:string}} FEdge
   * @typedef {{nodes:FNode[],edges:FEdge[]}} FGraph
   */

  /** @type {FGraph} */
  let state = { nodes: [], edges: [] };
  /** 选中的对象 id（节点或边） */
  let selectedId = '';
  /** 撤销栈 */
  /** @type {FGraph[]} */
  const history = [];
  let historyIdx = -1;

  const NODE_W = 120;
  const NODE_H = 48;
  const COLORS = {
    start: '#25d4a8',
    task: '#6c8cff',
    cond: '#ffb84d',
    end: '#ff6b81',
  };
  const LABELS = { start: '开始', task: '任务', cond: '判断', end: '结束' };

  const uid = () => Math.random().toString(36).slice(2, 9);

  /** 拷贝当前 state 入栈 */
  const pushHistory = () => {
    history.length = historyIdx + 1;
    history.push(JSON.parse(JSON.stringify(state)));
    historyIdx = history.length - 1;
    if (history.length > 100) {
      history.shift();
      historyIdx--;
    }
  };

  const render = () => {
    // 清空
    edgesG.innerHTML = '';
    nodesG.innerHTML = '';

    // 节点
    state.nodes.forEach((n) => {
      const g = document.createElementNS(NS, 'g');
      g.setAttribute('class', 'flow-node' + (selectedId === n.id ? ' selected' : ''));
      g.setAttribute('transform', `translate(${n.x}, ${n.y})`);
      g.dataset.id = n.id;

      // 判断节点画成菱形，其余圆角矩形
      if (n.type === 'cond') {
        const poly = document.createElementNS(NS, 'polygon');
        const w = NODE_W;
        const h = NODE_H;
        poly.setAttribute('points', `${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}`);
        poly.setAttribute('fill', COLORS[n.type]);
        poly.setAttribute('class', 'node-body');
        g.appendChild(poly);
      } else {
        const rect = document.createElementNS(NS, 'rect');
        rect.setAttribute('width', String(NODE_W));
        rect.setAttribute('height', String(NODE_H));
        rect.setAttribute('rx', '10');
        rect.setAttribute('fill', COLORS[n.type] || '#888');
        rect.setAttribute('class', 'node-body');
        g.appendChild(rect);
      }

      // 文本
      const text = document.createElementNS(NS, 'text');
      text.setAttribute('x', String(NODE_W / 2));
      text.setAttribute('y', String(NODE_H / 2 + 4));
      text.setAttribute('text-anchor', 'middle');
      text.textContent = n.label;
      g.appendChild(text);

      // 右侧锚点（输出）—— 结束节点没有
      if (n.type !== 'end') {
        const anchorR = document.createElementNS(NS, 'circle');
        anchorR.setAttribute('cx', String(NODE_W));
        anchorR.setAttribute('cy', String(NODE_H / 2));
        anchorR.setAttribute('r', '5');
        anchorR.setAttribute('class', 'flow-anchor');
        anchorR.dataset.role = 'source';
        anchorR.dataset.nid = n.id;
        g.appendChild(anchorR);
      }
      // 左侧锚点（输入）—— 开始节点没有
      if (n.type !== 'start') {
        const anchorL = document.createElementNS(NS, 'circle');
        anchorL.setAttribute('cx', '0');
        anchorL.setAttribute('cy', String(NODE_H / 2));
        anchorL.setAttribute('r', '5');
        anchorL.setAttribute('class', 'flow-anchor');
        anchorL.dataset.role = 'target';
        anchorL.dataset.nid = n.id;
        g.appendChild(anchorL);
      }

      nodesG.appendChild(g);
    });

    // 边
    state.edges.forEach((e) => {
      const s = state.nodes.find((n) => n.id === e.from);
      const t = state.nodes.find((n) => n.id === e.to);
      if (!s || !t) return;
      const sx = s.x + NODE_W;
      const sy = s.y + NODE_H / 2;
      const tx = t.x;
      const ty = t.y + NODE_H / 2;
      const d = bezierPath(sx, sy, tx, ty);

      // 隐形的更宽命中区，方便点击
      const hit = document.createElementNS(NS, 'path');
      hit.setAttribute('d', d);
      hit.setAttribute('class', 'flow-edge-hit');
      hit.dataset.eid = e.id;
      edgesG.appendChild(hit);

      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'flow-edge' + (selectedId === e.id ? ' selected' : ''));
      path.setAttribute('marker-end', 'url(#arrow)');
      path.dataset.eid = e.id;
      edgesG.appendChild(path);
    });

    // 隐藏提示
    if (state.nodes.length > 0) tip.classList.add('hide');
    else tip.classList.remove('hide');
  };

  /** 贝塞尔路径 */
  const bezierPath = (sx, sy, tx, ty) => {
    const dx = Math.max(Math.abs(tx - sx) * 0.5, 50);
    return `M ${sx} ${sy} C ${sx + dx} ${sy}, ${tx - dx} ${ty}, ${tx} ${ty}`;
  };

  /** 屏幕坐标 → SVG 内坐标 */
  const screenToSvg = (x, y) => {
    const rect = svg.getBoundingClientRect();
    return { x: x - rect.left, y: y - rect.top };
  };

  /* ========== 拖入节点：HTML5 DnD ========== */
  document.querySelectorAll('.flow-pal-item').forEach((item) => {
    item.addEventListener('dragstart', (e) => {
      const type = /** @type {HTMLElement} */ (item).dataset.type || 'task';
      e.dataTransfer.setData('text/fe-node', type);
      e.dataTransfer.effectAllowed = 'copy';
    });
  });
  stage.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  stage.addEventListener('drop', (e) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('text/fe-node');
    if (!type) return;
    const { x, y } = screenToSvg(e.clientX, e.clientY);
    state.nodes.push({
      id: uid(),
      type,
      x: x - NODE_W / 2,
      y: y - NODE_H / 2,
      label: LABELS[type] || type,
    });
    pushHistory();
    render();
  });

  /* ========== 节点拖拽 & 连线 ========== */
  let dragging = null; // { type: 'node'|'connect', ... }

  svg.addEventListener('mousedown', (e) => {
    const target = /** @type {Element} */ (e.target);

    // 锚点 → 开始连线
    if (target.classList.contains('flow-anchor')) {
      const role = /** @type {HTMLElement} */ (target).dataset.role;
      const nid = /** @type {HTMLElement} */ (target).dataset.nid;
      if (role === 'source' && nid) {
        const node = state.nodes.find((n) => n.id === nid);
        if (!node) return;
        const sx = node.x + NODE_W;
        const sy = node.y + NODE_H / 2;
        dragging = { type: 'connect', from: nid, sx, sy };
      }
      return;
    }

    // 节点拖动
    const nodeEl = target.closest('.flow-node');
    if (nodeEl) {
      const id = /** @type {HTMLElement} */ (nodeEl).dataset.id;
      const node = state.nodes.find((n) => n.id === id);
      if (!node) return;
      const { x, y } = screenToSvg(e.clientX, e.clientY);
      dragging = {
        type: 'node',
        id,
        dx: x - node.x,
        dy: y - node.y,
        moved: false,
      };
      selectedId = id;
      render();
      return;
    }

    // 边
    if (target.classList.contains('flow-edge') || target.classList.contains('flow-edge-hit')) {
      selectedId = /** @type {HTMLElement} */ (target).dataset.eid || '';
      render();
      return;
    }

    // 空白点击：取消选中
    selectedId = '';
    render();
  });

  svg.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const { x, y } = screenToSvg(e.clientX, e.clientY);

    if (dragging.type === 'node') {
      const node = state.nodes.find((n) => n.id === dragging.id);
      if (!node) return;
      node.x = x - dragging.dx;
      node.y = y - dragging.dy;
      dragging.moved = true;
      render();
    } else if (dragging.type === 'connect') {
      ghost.setAttribute('d', bezierPath(dragging.sx, dragging.sy, x, y));
    }
  });

  svg.addEventListener('mouseup', (e) => {
    if (!dragging) return;

    if (dragging.type === 'node' && dragging.moved) {
      pushHistory();
    }

    if (dragging.type === 'connect') {
      ghost.setAttribute('d', '');
      const target = /** @type {Element} */ (e.target);
      if (target.classList.contains('flow-anchor')) {
        const role = /** @type {HTMLElement} */ (target).dataset.role;
        const nid = /** @type {HTMLElement} */ (target).dataset.nid;
        if (role === 'target' && nid && nid !== dragging.from) {
          // 避免重复边
          const exists = state.edges.find(
            (ed) => ed.from === dragging.from && ed.to === nid
          );
          if (!exists) {
            state.edges.push({ id: uid(), from: dragging.from, to: nid });
            pushHistory();
            render();
          }
        }
      }
    }
    dragging = null;
  });

  svg.addEventListener('mouseleave', () => {
    if (dragging && dragging.type === 'connect') ghost.setAttribute('d', '');
    dragging = null;
  });

  /* ========== 键盘：Delete 删除 ========== */
  window.addEventListener('keydown', (e) => {
    if (
      (e.key === 'Delete' || e.key === 'Backspace') &&
      selectedId &&
      document.activeElement &&
      document.activeElement.tagName !== 'TEXTAREA' &&
      document.activeElement.tagName !== 'INPUT'
    ) {
      // 仅在流程图 SVG 聚焦或鼠标在上方时才响应
      const isNode = state.nodes.some((n) => n.id === selectedId);
      if (isNode) {
        state.nodes = state.nodes.filter((n) => n.id !== selectedId);
        state.edges = state.edges.filter(
          (ed) => ed.from !== selectedId && ed.to !== selectedId
        );
      } else {
        state.edges = state.edges.filter((ed) => ed.id !== selectedId);
      }
      selectedId = '';
      pushHistory();
      render();
    }
  });

  /* ========== 工具按钮 ========== */
  const $ = (id) => document.getElementById(id);

  $('flowUndo').addEventListener('click', () => {
    if (historyIdx > 0) {
      historyIdx--;
      state = JSON.parse(JSON.stringify(history[historyIdx]));
      render();
    }
  });
  $('flowRedo').addEventListener('click', () => {
    if (historyIdx < history.length - 1) {
      historyIdx++;
      state = JSON.parse(JSON.stringify(history[historyIdx]));
      render();
    }
  });
  $('flowClear').addEventListener('click', () => {
    state = { nodes: [], edges: [] };
    selectedId = '';
    pushHistory();
    render();
  });
  $('flowExport').addEventListener('click', () => {
    jsonArea.value = JSON.stringify(state, null, 2);
    jsonArea.parentElement && (jsonArea.parentElement.open = true);
  });
  $('flowImport').addEventListener('click', () => {
    try {
      const data = JSON.parse(jsonArea.value);
      if (!data.nodes || !data.edges) throw new Error('格式错误');
      state = data;
      selectedId = '';
      pushHistory();
      render();
    } catch (e) {
      alert('导入失败：' + e.message);
    }
  });

  /** 简易自动布局：按依赖分层（Kahn 算法） */
  $('flowAuto').addEventListener('click', () => {
    if (state.nodes.length === 0) return;
    const levels = {};
    const indeg = {};
    state.nodes.forEach((n) => {
      indeg[n.id] = 0;
      levels[n.id] = 0;
    });
    state.edges.forEach((e) => (indeg[e.to] = (indeg[e.to] || 0) + 1));
    const queue = state.nodes.filter((n) => indeg[n.id] === 0).map((n) => n.id);
    const visited = new Set();
    while (queue.length) {
      const id = queue.shift();
      if (visited.has(id)) continue;
      visited.add(id);
      state.edges
        .filter((e) => e.from === id)
        .forEach((e) => {
          levels[e.to] = Math.max(levels[e.to], levels[id] + 1);
          indeg[e.to]--;
          if (indeg[e.to] <= 0) queue.push(e.to);
        });
    }
    // 按层排列
    const levelMap = {};
    state.nodes.forEach((n) => {
      const l = levels[n.id];
      (levelMap[l] ||= []).push(n);
    });
    const startX = 40;
    const startY = 40;
    const gapX = NODE_W + 60;
    const gapY = NODE_H + 30;
    Object.keys(levelMap)
      .sort((a, b) => Number(a) - Number(b))
      .forEach((l, col) => {
        levelMap[l].forEach((n, row) => {
          n.x = startX + col * gapX;
          n.y = startY + row * gapY;
        });
      });
    pushHistory();
    render();
  });

  // 初始化：放一个开始节点示范
  state.nodes.push({
    id: uid(),
    type: 'start',
    x: 40,
    y: 180,
    label: '开始',
  });
  state.nodes.push({
    id: uid(),
    type: 'task',
    x: 240,
    y: 180,
    label: '审批',
  });
  state.nodes.push({
    id: uid(),
    type: 'end',
    x: 440,
    y: 180,
    label: '结束',
  });
  state.edges.push({ id: uid(), from: state.nodes[0].id, to: state.nodes[1].id });
  state.edges.push({ id: uid(), from: state.nodes[1].id, to: state.nodes[2].id });
  pushHistory();
  render();
})();

/* =====================================================
 * 27. Canvas 无限画布（Demo B）
 *    Pan / Zoom（以光标为中心）+ 双击新建 + 框选 + 适配视图
 * ===================================================== */
(function initInfiniteCanvas() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('infCanvas')
  );
  const info = document.getElementById('canvasInfo');
  const resetBtn = document.getElementById('canvasReset');
  const addBtn = document.getElementById('canvasAdd');
  const fitBtn = document.getElementById('canvasFit');
  if (!canvas || !info || !resetBtn || !addBtn || !fitBtn) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  };
  window.addEventListener('resize', resize);

  /** 世界坐标系下的节点 */
  /** @type {{x:number,y:number,w:number,h:number,color:string,label:string,id:number}[]} */
  let nodes = [];
  let nextId = 1;

  /** 视图矩阵：offsetX/Y + scale */
  let offsetX = 0;
  let offsetY = 0;
  let scale = 1;

  /** 交互状态 */
  let panning = false;
  let startPan = { x: 0, y: 0 };
  let startOffset = { x: 0, y: 0 };
  /** 被拖拽的节点 */
  let hoverNode = null;
  let draggingNode = null;
  let dragDelta = { x: 0, y: 0 };

  const COLORS = ['#6c8cff', '#8a5cff', '#25d4a8', '#ffb84d', '#ff6b81'];

  const draw = () => {
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;

    ctx.clearRect(0, 0, W, H);

    /* ---- 1. 绘制网格（跟随缩放） ---- */
    const gridSize = 40 * scale;
    const gridOffsetX = offsetX % gridSize;
    const gridOffsetY = offsetY % gridSize;
    ctx.strokeStyle = 'rgba(154,163,199,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = gridOffsetX; x < W; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
    }
    for (let y = gridOffsetY; y < H; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
    }
    ctx.stroke();

    /* ---- 2. 原点标记 ---- */
    ctx.fillStyle = 'rgba(108,140,255,0.5)';
    ctx.beginPath();
    ctx.arc(offsetX, offsetY, 4, 0, Math.PI * 2);
    ctx.fill();

    /* ---- 3. 绘制节点（应用视图矩阵） ---- */
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);

    nodes.forEach((n) => {
      // 视口裁剪（可选：只画可见节点）
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.roundRect
        ? ctx.roundRect(n.x, n.y, n.w, n.h, 8)
        : ctx.rect(n.x, n.y, n.w, n.h);
      ctx.fill();

      if (hoverNode === n || draggingNode === n) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      ctx.fillStyle = '#fff';
      ctx.font = '600 14px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(n.label, n.x + n.w / 2, n.y + n.h / 2);
    });
    ctx.restore();

    info.textContent = `偏移 (${offsetX.toFixed(0)}, ${offsetY.toFixed(0)}) · 缩放 ${(scale * 100).toFixed(0)}%`;
  };

  /** 屏幕 → 世界 */
  const screenToWorld = (sx, sy) => ({
    x: (sx - offsetX) / scale,
    y: (sy - offsetY) / scale,
  });

  /** 命中测试（世界坐标） */
  const hitNode = (wx, wy) => {
    for (let i = nodes.length - 1; i >= 0; i--) {
      const n = nodes[i];
      if (wx >= n.x && wx <= n.x + n.w && wy >= n.y && wy <= n.y + n.h) return n;
    }
    return null;
  };

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { x, y } = screenToWorld(sx, sy);
    const hit = hitNode(x, y);
    if (hit) {
      draggingNode = hit;
      dragDelta = { x: x - hit.x, y: y - hit.y };
      // 把选中节点移到最上层
      nodes = nodes.filter((n) => n !== hit).concat(hit);
    } else {
      panning = true;
      startPan = { x: sx, y: sy };
      startOffset = { x: offsetX, y: offsetY };
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;

    if (draggingNode) {
      const { x, y } = screenToWorld(sx, sy);
      draggingNode.x = x - dragDelta.x;
      draggingNode.y = y - dragDelta.y;
      draw();
      return;
    }
    if (panning) {
      offsetX = startOffset.x + (sx - startPan.x);
      offsetY = startOffset.y + (sy - startPan.y);
      draw();
      return;
    }
    const { x, y } = screenToWorld(sx, sy);
    const before = hoverNode;
    hoverNode = hitNode(x, y);
    if (before !== hoverNode) {
      canvas.style.cursor = hoverNode ? 'move' : '';
      draw();
    }
  });

  window.addEventListener('mouseup', () => {
    panning = false;
    draggingNode = null;
  });

  /** 滚轮缩放：以光标为中心 */
  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const wx = (cx - offsetX) / scale;
      const wy = (cy - offsetY) / scale;
      scale = Math.min(4, Math.max(0.1, scale * factor));
      offsetX = cx - wx * scale;
      offsetY = cy - wy * scale;
      draw();
    },
    { passive: false }
  );

  /** 双击新建节点 */
  canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const sx = e.clientX - rect.left;
    const sy = e.clientY - rect.top;
    const { x, y } = screenToWorld(sx, sy);
    if (hitNode(x, y)) return;
    nodes.push({
      id: nextId++,
      x: x - 60,
      y: y - 30,
      w: 120,
      h: 60,
      color: COLORS[nodes.length % COLORS.length],
      label: 'Node ' + nextId,
    });
    draw();
  });

  /** 按钮 */
  resetBtn.addEventListener('click', () => {
    offsetX = 0;
    offsetY = 0;
    scale = 1;
    draw();
  });
  addBtn.addEventListener('click', () => {
    for (let i = 0; i < 10; i++) {
      const x = (Math.random() - 0.5) * 1500;
      const y = (Math.random() - 0.5) * 800;
      nodes.push({
        id: nextId++,
        x,
        y,
        w: 120,
        h: 60,
        color: COLORS[nextId % COLORS.length],
        label: 'Node ' + nextId,
      });
    }
    draw();
  });
  fitBtn.addEventListener('click', () => {
    if (nodes.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const xs = nodes.map((n) => n.x);
    const xe = nodes.map((n) => n.x + n.w);
    const ys = nodes.map((n) => n.y);
    const ye = nodes.map((n) => n.y + n.h);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xe);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ye);
    const padding = 60;
    const boxW = maxX - minX + padding * 2;
    const boxH = maxY - minY + padding * 2;
    scale = Math.min((rect.width / boxW) * 1, (rect.height / boxH) * 1, 2);
    scale = Math.max(0.1, scale);
    offsetX = rect.width / 2 - ((minX + maxX) / 2) * scale;
    offsetY = rect.height / 2 - ((minY + maxY) / 2) * scale;
    draw();
  });

  // 初始化：放置几个示例节点
  for (let i = 0; i < 6; i++) {
    nodes.push({
      id: nextId++,
      x: 80 + (i % 3) * 180,
      y: 80 + Math.floor(i / 3) * 120,
      w: 120,
      h: 60,
      color: COLORS[i % COLORS.length],
      label: 'Node ' + nextId,
    });
  }

  resize();
})();

/* =====================================================
 * 28. 游戏 Demo A：Canvas 2D 打砖块
 * ===================================================== */
(function initBreakout() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('breakoutCanvas')
  );
  const overlay = document.getElementById('breakoutOverlay');
  const startBtn = document.getElementById('bkStart');
  const scoreEl = document.getElementById('bkScore');
  const lifeEl = document.getElementById('bkLife');
  const levelEl = document.getElementById('bkLevel');
  if (!canvas || !overlay || !startBtn || !scoreEl || !lifeEl || !levelEl) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;

  /** @type {{x:number,y:number,vx:number,vy:number,r:number}} */
  let ball;
  /** @type {{x:number,y:number,w:number,h:number}} */
  let paddle;
  /** @type {{x:number,y:number,w:number,h:number,color:string,alive:boolean}[]} */
  let bricks = [];
  let score = 0;
  let life = 3;
  let level = 1;
  let running = false;
  let raf = 0;

  const keys = { left: false, right: false };

  const buildLevel = (lv) => {
    bricks = [];
    const cols = 12;
    const rows = 4 + Math.min(lv, 4);
    const bw = (W - 40) / cols - 4;
    const bh = 18;
    const colors = ['#ff6b81', '#ffb84d', '#25d4a8', '#6c8cff', '#8a5cff'];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        bricks.push({
          x: 20 + c * (bw + 4),
          y: 50 + r * (bh + 4),
          w: bw,
          h: bh,
          color: colors[r % colors.length],
          alive: true,
        });
      }
    }
  };

  const reset = () => {
    paddle = { x: W / 2 - 50, y: H - 30, w: 100, h: 10 };
    ball = {
      x: W / 2,
      y: H - 50,
      vx: 4 * (Math.random() > 0.5 ? 1 : -1),
      vy: -4,
      r: 7,
    };
  };

  const start = () => {
    score = 0;
    life = 3;
    level = 1;
    buildLevel(level);
    reset();
    running = true;
    overlay.classList.add('hide');
    updateHud();
    loop();
  };

  const updateHud = () => {
    scoreEl.textContent = String(score);
    lifeEl.textContent = String(life);
    levelEl.textContent = String(level);
  };

  const showOverlay = (html) => {
    overlay.innerHTML = `<div>${html}<button class="btn btn-primary" style="margin-top:14px" id="bkRestart">再来一局</button></div>`;
    overlay.classList.remove('hide');
    const btn = document.getElementById('bkRestart');
    if (btn) btn.addEventListener('click', start);
    running = false;
  };

  const loop = () => {
    if (!running) return;

    // 更新
    if (keys.left) paddle.x = Math.max(0, paddle.x - 7);
    if (keys.right) paddle.x = Math.min(W - paddle.w, paddle.x + 7);

    ball.x += ball.vx;
    ball.y += ball.vy;
    if (ball.x < ball.r || ball.x > W - ball.r) ball.vx *= -1;
    if (ball.y < ball.r) ball.vy *= -1;

    // 挡板
    if (
      ball.y + ball.r >= paddle.y &&
      ball.y + ball.r <= paddle.y + paddle.h + 10 &&
      ball.x >= paddle.x &&
      ball.x <= paddle.x + paddle.w &&
      ball.vy > 0
    ) {
      ball.vy *= -1;
      // 依据击中位置调整水平速度
      const hit = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
      ball.vx = hit * 6;
    }

    // 掉落
    if (ball.y > H + 20) {
      life -= 1;
      updateHud();
      if (life <= 0) {
        draw();
        showOverlay(
          `<h3 style="margin:0 0 8px;color:#ff6b81">💀 Game Over</h3>
           <p style="color:var(--muted);margin:0">最终得分：${score}</p>`
        );
        return;
      }
      reset();
    }

    // 砖块碰撞
    for (const b of bricks) {
      if (!b.alive) continue;
      if (
        ball.x + ball.r > b.x &&
        ball.x - ball.r < b.x + b.w &&
        ball.y + ball.r > b.y &&
        ball.y - ball.r < b.y + b.h
      ) {
        b.alive = false;
        score += 10;
        updateHud();
        // 简单判断：从侧面或上下撞
        const prevX = ball.x - ball.vx;
        const prevY = ball.y - ball.vy;
        if (prevX < b.x || prevX > b.x + b.w) ball.vx *= -1;
        else ball.vy *= -1;
        break;
      }
    }

    // 全部消灭 → 下一关
    if (bricks.every((b) => !b.alive)) {
      level += 1;
      buildLevel(level);
      reset();
      ball.vx *= 1.1;
      ball.vy *= 1.1;
      updateHud();
    }

    draw();
    raf = requestAnimationFrame(loop);
  };

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    // 背景渐变
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#11152f');
    g.addColorStop(1, '#0a0d1f');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // 砖块
    bricks.forEach((b) => {
      if (!b.alive) return;
      ctx.fillStyle = b.color;
      ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fillRect(b.x, b.y, b.w, 3);
    });

    // 挡板
    ctx.fillStyle = '#6c8cff';
    ctx.fillRect(paddle.x, paddle.y, paddle.w, paddle.h);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(paddle.x, paddle.y, paddle.w, 2);

    // 球
    ctx.fillStyle = '#25d4a8';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowColor = '#25d4a8';
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  // 输入
  window.addEventListener('keydown', (e) => {
    if (!running) return;
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
  });
  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
  });
  // 鼠标/触摸
  const movePaddle = (clientX) => {
    if (!running) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    paddle.x = Math.max(0, Math.min(W - paddle.w, x - paddle.w / 2));
  };
  canvas.addEventListener('mousemove', (e) => movePaddle(e.clientX));
  canvas.addEventListener(
    'touchmove',
    (e) => {
      if (e.touches[0]) movePaddle(e.touches[0].clientX);
      e.preventDefault();
    },
    { passive: false }
  );

  startBtn.addEventListener('click', start);
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && !running && overlay.offsetParent !== null) {
      e.preventDefault();
      start();
    }
  });
})();

/* =====================================================
 * 29. 游戏 Demo B：Three.js 3D 场景（CDN 按需加载）
 * ===================================================== */
(function initThreeDemo() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('threeCanvas')
  );
  const loadBtn = document.getElementById('threeLoad');
  const wireBtn = document.getElementById('threeWire');
  const addBtn = document.getElementById('threeAdd');
  const fpsEl = document.getElementById('threeFps');
  const triEl = document.getElementById('threeTri');
  const dcEl = document.getElementById('threeDc');
  if (!canvas || !loadBtn || !wireBtn || !addBtn || !fpsEl || !triEl || !dcEl) return;

  let loaded = false;
  let wireframe = false;

  /** 动态 ESM import + 懒加载 */
  const boot = async () => {
    loadBtn.disabled = true;
    loadBtn.textContent = '⏳ 加载中...';
    try {
      /** @type {any} */
      const THREE = await import(
        /* webpackIgnore: true */ 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js'
      );

      const rect = canvas.getBoundingClientRect();
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(rect.width, rect.height, false);
      renderer.shadowMap.enabled = true;
      renderer.setClearColor(0x0a0d1f);

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x0a0d1f, 10, 40);

      const camera = new THREE.PerspectiveCamera(
        60,
        rect.width / rect.height,
        0.1,
        1000
      );
      camera.position.set(6, 5, 8);
      camera.lookAt(0, 0, 0);

      // 地面
      const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({ color: 0x1e2340, roughness: 0.8 })
      );
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -1.5;
      plane.receiveShadow = true;
      scene.add(plane);

      // 光
      scene.add(new THREE.AmbientLight(0xffffff, 0.35));
      const dir = new THREE.DirectionalLight(0xffffff, 1.2);
      dir.position.set(5, 10, 4);
      dir.castShadow = true;
      dir.shadow.mapSize.set(1024, 1024);
      scene.add(dir);

      // 主立方体
      const cubes = [];
      const colors = [0x6c8cff, 0x8a5cff, 0x25d4a8, 0xffb84d, 0xff6b81];
      const makeCube = (x, y, z) => {
        const mat = new THREE.MeshStandardMaterial({
          color: colors[Math.floor(Math.random() * colors.length)],
          metalness: 0.3,
          roughness: 0.4,
        });
        const m = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
        m.position.set(x, y, z);
        m.castShadow = true;
        scene.add(m);
        cubes.push(m);
        return m;
      };
      makeCube(0, 0, 0);
      // 外围一圈
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        makeCube(Math.cos(a) * 3, 0, Math.sin(a) * 3);
      }

      // 鼠标交互：拖拽旋转相机 + 滚轮缩放
      let theta = Math.atan2(camera.position.x, camera.position.z);
      let phi = Math.asin(camera.position.y / camera.position.length());
      let radius = camera.position.length();
      let down = false;
      let lx = 0;
      let ly = 0;
      canvas.addEventListener('mousedown', (e) => {
        down = true;
        lx = e.clientX;
        ly = e.clientY;
      });
      window.addEventListener('mouseup', () => (down = false));
      window.addEventListener('mousemove', (e) => {
        if (!down) return;
        theta -= (e.clientX - lx) * 0.005;
        phi += (e.clientY - ly) * 0.005;
        phi = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, phi));
        lx = e.clientX;
        ly = e.clientY;
      });
      canvas.addEventListener(
        'wheel',
        (e) => {
          e.preventDefault();
          radius += e.deltaY * 0.01;
          radius = Math.max(3, Math.min(30, radius));
        },
        { passive: false }
      );

      const resize = () => {
        const r = canvas.getBoundingClientRect();
        renderer.setSize(r.width, r.height, false);
        camera.aspect = r.width / r.height;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', resize);

      // FPS 测量
      let frames = 0;
      let lastFpsT = performance.now();

      renderer.setAnimationLoop(() => {
        // 更新相机位置
        camera.position.set(
          radius * Math.cos(phi) * Math.sin(theta),
          radius * Math.sin(phi),
          radius * Math.cos(phi) * Math.cos(theta)
        );
        camera.lookAt(0, 0, 0);

        // 自转
        cubes.forEach((c, i) => {
          c.rotation.x += 0.005 + i * 0.0003;
          c.rotation.y += 0.008 + i * 0.0004;
        });

        renderer.render(scene, camera);

        frames++;
        const t = performance.now();
        if (t - lastFpsT >= 500) {
          fpsEl.textContent = Math.round((frames * 1000) / (t - lastFpsT)).toString();
          triEl.textContent = String(renderer.info.render.triangles);
          dcEl.textContent = String(renderer.info.render.calls);
          frames = 0;
          lastFpsT = t;
        }
      });

      wireBtn.addEventListener('click', () => {
        wireframe = !wireframe;
        cubes.forEach((c) => (c.material.wireframe = wireframe));
      });
      addBtn.addEventListener('click', () => {
        for (let i = 0; i < 50; i++) {
          makeCube(
            (Math.random() - 0.5) * 14,
            Math.random() * 5,
            (Math.random() - 0.5) * 14
          );
        }
      });

      loaded = true;
      loadBtn.textContent = '✅ 已启动';
    } catch (err) {
      loadBtn.disabled = false;
      loadBtn.textContent = '▶ 加载 Three.js 并启动';
      alert('加载 Three.js 失败：' + err.message + '\n可能是网络问题或 CDN 被屏蔽');
    }
  };

  loadBtn.addEventListener('click', () => {
    if (!loaded) boot();
  });
})();

/* =====================================================
 * 30. 游戏 Demo C：Web Audio 3D 空间音效
 * ===================================================== */
(function initSpatialAudio() {
  const canvas = /** @type {HTMLCanvasElement | null} */ (
    document.getElementById('audioCanvas')
  );
  const startBtn = document.getElementById('audioStart');
  const stopBtn = document.getElementById('audioStop');
  const typeSel = /** @type {HTMLSelectElement | null} */ (
    document.getElementById('audioType')
  );
  const lVol = document.getElementById('audioL');
  const rVol = document.getElementById('audioR');
  if (!canvas || !startBtn || !stopBtn || !typeSel || !lVol || !rVol) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();
  window.addEventListener('resize', resize);

  /** 音源位置（世界坐标，单位米） */
  let sx = 3;
  let sy = 0;

  /** @type {AudioContext | null} */
  let audio = null;
  /** @type {OscillatorNode | null} */
  let osc = null;
  /** @type {PannerNode | null} */
  let panner = null;
  /** @type {AnalyserNode | null} */
  let analyser = null;
  let rafId = 0;

  const start = async () => {
    if (audio) return;
    audio = new AudioContext();
    osc = audio.createOscillator();
    osc.type = /** @type {OscillatorType} */ (typeSel.value);
    osc.frequency.value = 440;

    // 音量自动衰减的 gain（听感舒适）
    const gain = audio.createGain();
    gain.gain.value = 0.2;

    panner = audio.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 20;
    panner.rolloffFactor = 1;
    panner.positionX.value = sx;
    panner.positionZ.value = sy;

    // 听众位置固定原点，朝 -Z
    const listener = audio.listener;
    if (listener.forwardX) {
      listener.forwardX.value = 0;
      listener.forwardY.value = 0;
      listener.forwardZ.value = -1;
      listener.upX.value = 0;
      listener.upY.value = 1;
      listener.upZ.value = 0;
    }

    analyser = audio.createAnalyser();
    analyser.fftSize = 256;

    osc.connect(gain).connect(panner).connect(analyser).connect(audio.destination);
    osc.start();

    typeSel.addEventListener('change', () => {
      if (osc) osc.type = /** @type {OscillatorType} */ (typeSel.value);
    });

    loop();
  };

  const stop = () => {
    if (!audio) return;
    osc && osc.stop();
    audio.close();
    audio = null;
    osc = null;
    panner = null;
    analyser = null;
    cancelAnimationFrame(rafId);
    drawStage();
    lVol.textContent = '0';
    rVol.textContent = '0';
  };

  const drawStage = () => {
    const rect = canvas.getBoundingClientRect();
    const W = rect.width;
    const H = rect.height;
    ctx.clearRect(0, 0, W, H);

    // 背景圈圈（距离刻度）
    const cx = W / 2;
    const cy = H / 2;
    ctx.strokeStyle = 'rgba(154,163,199,0.15)';
    for (let i = 1; i <= 4; i++) {
      ctx.beginPath();
      ctx.arc(cx, cy, i * 40, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 十字
    ctx.strokeStyle = 'rgba(154,163,199,0.2)';
    ctx.beginPath();
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, H);
    ctx.stroke();

    // 听众
    ctx.fillStyle = '#25d4a8';
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '11px Menlo';
    ctx.textAlign = 'center';
    ctx.fillText('YOU', cx, cy + 4);

    // 音源（像素 = 世界 * 40）
    const sxPx = cx + sx * 40;
    const syPx = cy + sy * 40;
    ctx.fillStyle = '#ff6b81';
    ctx.shadowColor = '#ff6b81';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(sxPx, syPx, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fff';
    ctx.fillText('🔊', sxPx, syPx + 4);
  };

  const loop = () => {
    drawStage();
    if (analyser && audio) {
      // 模拟左右声道音量：距离 + 角度
      const dist = Math.hypot(sx, sy) + 0.1;
      const atten = Math.max(0, 1 - dist / 10);
      const pan = Math.max(-1, Math.min(1, sx / 5));
      const L = Math.round((atten * (1 - Math.max(0, pan))) * 100);
      const R = Math.round((atten * (1 + Math.min(0, pan))) * 100);
      lVol.textContent = String(L);
      rVol.textContent = String(R);

      if (panner) {
        panner.positionX.value = sx;
        panner.positionZ.value = sy;
      }
    }
    rafId = requestAnimationFrame(loop);
  };

  // 拖动音源
  let dragging = false;
  canvas.addEventListener('mousedown', () => (dragging = true));
  window.addEventListener('mouseup', () => (dragging = false));
  canvas.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = canvas.getBoundingClientRect();
    sx = (e.clientX - rect.left - rect.width / 2) / 40;
    sy = (e.clientY - rect.top - rect.height / 2) / 40;
    drawStage();
  });
  // 触摸
  canvas.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      sx = (t.clientX - rect.left - rect.width / 2) / 40;
      sy = (t.clientY - rect.top - rect.height / 2) / 40;
      drawStage();
      e.preventDefault();
    },
    { passive: false }
  );

  startBtn.addEventListener('click', start);
  stopBtn.addEventListener('click', stop);
  drawStage();
})();

/* =====================================================
 * 31. 游戏 Demo D：Gamepad / Fullscreen / Vibration / Wake Lock
 * ===================================================== */
(function initGameApis() {
  /* ---- Gamepad 实时面板 ---- */
  const gpEmpty = document.getElementById('gpEmpty');
  const gpBody = document.getElementById('gpBody');
  const gpName = document.getElementById('gpName');
  const gpL = document.getElementById('gpL');
  const gpR = document.getElementById('gpR');
  const gpBtns = document.getElementById('gpBtns');
  const gpVibrate = document.getElementById('gpVibrate');

  let currentGp = -1;
  if (gpEmpty && gpBody && gpName && gpL && gpR && gpBtns) {
    window.addEventListener('gamepadconnected', (e) => {
      currentGp = e.gamepad.index;
      gpEmpty.style.display = 'none';
      gpBody.style.display = 'block';
      gpName.textContent = `✅ ${e.gamepad.id}  (${e.gamepad.buttons.length} 键)`;
    });
    window.addEventListener('gamepaddisconnected', () => {
      currentGp = -1;
      gpEmpty.style.display = 'block';
      gpBody.style.display = 'none';
    });

    const pollGp = () => {
      const pads = navigator.getGamepads ? navigator.getGamepads() : [];
      const pad = pads[currentGp];
      if (pad) {
        // 摇杆
        const lx = pad.axes[0] || 0;
        const ly = pad.axes[1] || 0;
        const rx = pad.axes[2] || 0;
        const ry = pad.axes[3] || 0;
        gpL.style.transform = `translate(${lx * 30}px, ${ly * 30}px)`;
        gpR.style.transform = `translate(${rx * 30}px, ${ry * 30}px)`;

        // 按钮
        if (gpBtns.children.length !== pad.buttons.length) {
          gpBtns.innerHTML = pad.buttons
            .map((_, i) => `<div class="gp-btn" data-i="${i}">${i}</div>`)
            .join('');
        }
        pad.buttons.forEach((b, i) => {
          const el = gpBtns.children[i];
          if (el) el.classList.toggle('pressed', b.pressed);
        });
      }
      requestAnimationFrame(pollGp);
    };
    pollGp();

    if (gpVibrate) {
      gpVibrate.addEventListener('click', () => {
        const pads = navigator.getGamepads ? navigator.getGamepads() : [];
        const pad = pads[currentGp];
        const actuator = pad && /** @type {any} */ (pad).vibrationActuator;
        if (actuator && actuator.playEffect) {
          actuator.playEffect('dual-rumble', {
            duration: 300,
            strongMagnitude: 0.8,
            weakMagnitude: 0.4,
          });
        } else {
          alert('此手柄不支持震动，或浏览器未实现 vibrationActuator');
        }
      });
    }
  }

  /* ---- 游戏其他 API ---- */
  const out = (msg) => {
    const el = document.getElementById('gameApiOut');
    if (el) el.textContent = msg;
  };

  const fsBtn = document.getElementById('fsBtn');
  if (fsBtn) {
    fsBtn.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
          out('已退出全屏');
        } else {
          await document.documentElement.requestFullscreen();
          out('✅ 已进入全屏');
        }
      } catch (e) {
        out('❌ ' + e.message);
      }
    });
  }

  const vibBtn = document.getElementById('vibBtn');
  if (vibBtn) {
    vibBtn.addEventListener('click', () => {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100, 50, 300]);
        out('📳 已发送震动指令（仅移动端真机生效）');
      } else {
        out('❌ 当前设备不支持 Vibration API');
      }
    });
  }

  const wakeBtn = document.getElementById('wakeBtn');
  if (wakeBtn) {
    /** @type {any} */
    let wakeLock = null;
    wakeBtn.addEventListener('click', async () => {
      const w = /** @type {any} */ (navigator);
      if (!w.wakeLock) {
        out('❌ 当前浏览器未支持 Wake Lock');
        return;
      }
      try {
        if (wakeLock) {
          await wakeLock.release();
          wakeLock = null;
          out('已释放 Wake Lock（屏幕可正常休眠）');
          wakeBtn.textContent = '💡 请求屏幕常亮（Wake Lock）';
          return;
        }
        wakeLock = await w.wakeLock.request('screen');
        out('✅ 已获得 Wake Lock，屏幕不会自动熄灭');
        wakeBtn.textContent = '💡 释放 Wake Lock';
      } catch (e) {
        out('❌ ' + e.message);
      }
    });
  }

  const lockBtn = document.getElementById('lockBtnR');
  if (lockBtn) {
    lockBtn.addEventListener('click', async () => {
      const scr = /** @type {any} */ (screen);
      if (!scr.orientation || !scr.orientation.lock) {
        out('❌ 当前浏览器未支持 Orientation Lock（通常只在全屏 + 移动端可用）');
        return;
      }
      try {
        await scr.orientation.lock('landscape');
        out('✅ 已锁定横屏');
      } catch (e) {
        out('❌ ' + e.message + '（需先进入全屏）');
      }
    });
  }

  const ptrLockBtn = document.getElementById('ptrLockBtn');
  if (ptrLockBtn) {
    ptrLockBtn.addEventListener('click', async () => {
      const el = /** @type {any} */ (document.documentElement);
      if (!el.requestPointerLock) {
        out('❌ 不支持 Pointer Lock');
        return;
      }
      try {
        await el.requestPointerLock();
        out('✅ 鼠标已锁定 · 按 Esc 退出');
      } catch (e) {
        out('❌ ' + e.message);
      }
    });
  }
})();
