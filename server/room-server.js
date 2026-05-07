/**
 * 真实 WebSocket 房间服务端
 * ------------------------------------------------------------
 * 运行方式：
 *   1) 在项目根目录执行：  npm init -y && npm install ws
 *   2) 启动：             node server/room-server.js
 *   3) 客户端连接：       ws://localhost:3001/room/{roomId}
 *
 * 支持：
 *  - 多房间按 URL 路径区分：/room/playground、/room/arena-1 等
 *  - 广播位置（type: 'move'）
 *  - 聊天（type: 'chat'）
 *  - 自动心跳 & 断线清理
 *  - peer-join / peer-leave 事件
 *
 * Node.js 18+ 推荐（使用了内置 node:crypto）
 */
import { WebSocketServer } from 'ws';
import { randomUUID } from 'node:crypto';

const PORT = Number(process.env.PORT || 3001);

const wss = new WebSocketServer({ port: PORT });

/** @type {Map<string, Set<import('ws').WebSocket>>} */
const rooms = new Map();
/** @type {Map<import('ws').WebSocket, {uid: string, roomId: string, state: any}>} */
const clients = new Map();

/** 加入房间 */
const join = (ws, roomId) => {
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  rooms.get(roomId).add(ws);
};

/** 离开房间，广播 peer-leave */
const leave = (ws) => {
  const info = clients.get(ws);
  if (!info) return;
  const set = rooms.get(info.roomId);
  if (set) set.delete(ws);
  clients.delete(ws);
  broadcast(info.roomId, { type: 'peer-leave', uid: info.uid });
  console.log(`[-] ${info.uid} left room ${info.roomId}`);
};

/**
 * 向房间广播
 * @param {string} roomId
 * @param {object} msg
 * @param {import('ws').WebSocket} [exclude]
 */
const broadcast = (roomId, msg, exclude) => {
  const data = JSON.stringify(msg);
  const set = rooms.get(roomId);
  if (!set) return;
  for (const c of set) {
    if (c !== exclude && c.readyState === 1) c.send(data);
  }
};

wss.on('connection', (ws, req) => {
  // 根据 URL 提取 roomId：/room/playground → 'playground'
  const url = new URL(req.url, 'http://x');
  const parts = url.pathname.split('/').filter(Boolean);
  const roomId = parts[1] || parts[0] || 'lobby';

  const uid = randomUUID().slice(0, 8);
  clients.set(ws, { uid, roomId, state: {} });
  join(ws, roomId);

  // 当前房间成员列表（给新来的人）
  const peers = [...rooms.get(roomId)]
    .filter((w) => w !== ws)
    .map((w) => {
      const info = clients.get(w);
      return info ? { uid: info.uid, ...info.state } : null;
    })
    .filter(Boolean);

  ws.send(JSON.stringify({ type: 'welcome', uid, roomId, peers }));
  broadcast(roomId, { type: 'peer-join', uid }, ws);
  console.log(`[+] ${uid} joined room ${roomId} (now ${rooms.get(roomId).size})`);

  // 心跳：ws 协议层 ping/pong，30s 无响应踢下线
  ws.isAlive = true;
  ws.on('pong', () => (ws.isAlive = true));

  ws.on('message', (buf) => {
    let msg;
    try {
      msg = JSON.parse(buf.toString());
    } catch {
      return;
    }
    const info = clients.get(ws);
    if (!info) return;

    switch (msg.type) {
      case 'move': {
        info.state = {
          x: Number(msg.x) || 0,
          y: Number(msg.y) || 0,
          z: Number(msg.z) || 0,
          rot: Number(msg.rot) || 0,
        };
        broadcast(
          info.roomId,
          { type: 'state', uid: info.uid, ...info.state, ts: Date.now() },
          ws
        );
        break;
      }
      case 'chat': {
        broadcast(info.roomId, {
          type: 'chat',
          uid: info.uid,
          text: String(msg.text || '').slice(0, 200),
        });
        break;
      }
      case 'ping': {
        // RTT 测量：客户端带 t0，服务端原样回显
        ws.send(JSON.stringify({ type: 'pong', t0: msg.t0 }));
        break;
      }
      default:
        break;
    }
  });

  ws.on('close', () => leave(ws));
  ws.on('error', (e) => console.error('ws error:', e.message));
});

// 30s 心跳扫描
setInterval(() => {
  for (const ws of wss.clients) {
    if (!ws.isAlive) {
      ws.terminate();
      continue;
    }
    ws.isAlive = false;
    ws.ping();
  }
}, 30_000);

console.log(`🚀 Room server running on ws://localhost:${PORT}/room/{roomId}`);
console.log(`   Example: ws://localhost:${PORT}/room/playground`);
