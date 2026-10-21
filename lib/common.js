import { QUESTIONS } from './questions.js';
export { QUESTIONS };

export const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

export const passMark = (env) => {
  const n = parseInt(env.PASS_MARK, 10);
  return Number.isFinite(n) ? n : 80;
};

export async function ensureTable(env) {
  if (!env.DB) throw new Error('D1 binding "DB" is missing');
  await env.DB.prepare(
    `CREATE TABLE IF NOT EXISTS attempts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      lang TEXT NOT NULL,
      created_at TEXT NOT NULL,
      answers TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      pct INTEGER NOT NULL
    )`
  ).run();
}

export function isSupervisor(request, env) {
  const pin = String(env.SUPERVISOR_PIN || '');
  const given = String(request.headers.get('x-supervisor-pin') || '');
  if (!pin || given.length !== pin.length) return false;
  let diff = 0;
  for (let i = 0; i < pin.length; i++) diff |= pin.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0;
}

export function score(lang, answers) {
  const qs = QUESTIONS[lang];
  let sc = 0, tot = 0;
  qs.forEach((q, i) => { tot += q.p; if (answers[i] === q.c) sc += q.p; });
  return { score: sc, total: tot, pct: tot ? Math.round((sc / tot) * 100) : 0 };
}
