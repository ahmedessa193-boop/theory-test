import { QUESTIONS, json, ensureTable, isSupervisor, passMark } from '../../../lib/common.js';

// GET /api/results (header x-supervisor-pin) → all attempts, newest first
export async function onRequestGet({ request, env }) {
  if (!isSupervisor(request, env)) return json({ error: 'unauthorized' }, 401);
  await ensureTable(env);
  const { results } = await env.DB.prepare(
    'SELECT id, name, lang, created_at, answers, score, total, pct FROM attempts ORDER BY created_at DESC'
  ).all();
  const pm = passMark(env);
  const rows = results.map((r) => {
    const ans = JSON.parse(r.answers);
    const key = QUESTIONS[r.lang];
    return {
      id: r.id, name: r.name, lang: r.lang, date: r.created_at,
      score: r.score, total: r.total, pct: r.pct, passed: r.pct >= pm,
      marks: ans.map((a, i) => (a === key[i].c ? 1 : 0)),
    };
  });
  return json({ passMark: pm, results: rows });
}

// DELETE /api/results (header x-supervisor-pin) → remove every attempt
export async function onRequestDelete({ request, env }) {
  if (!isSupervisor(request, env)) return json({ error: 'unauthorized' }, 401);
  await ensureTable(env);
  await env.DB.prepare('DELETE FROM attempts').run();
  return json({ ok: true });
}
