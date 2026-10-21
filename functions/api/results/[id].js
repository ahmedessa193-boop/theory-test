import { QUESTIONS, json, ensureTable, isSupervisor, passMark } from '../../../lib/common.js';

// GET /api/results/:id (header x-supervisor-pin) → one attempt, question by question
export async function onRequestGet({ request, env, params }) {
  if (!isSupervisor(request, env)) return json({ error: 'unauthorized' }, 401);
  await ensureTable(env);
  const r = await env.DB.prepare('SELECT * FROM attempts WHERE id = ?1').bind(String(params.id)).first();
  if (!r) return json({ error: 'not_found' }, 404);
  const ans = JSON.parse(r.answers);
  const items = QUESTIONS[r.lang].map((q, i) => ({ q: q.q, a: q.a, chosen: ans[i], correct: q.c, ok: ans[i] === q.c }));
  return json({
    id: r.id, name: r.name, lang: r.lang, date: r.created_at,
    score: r.score, total: r.total, pct: r.pct, passed: r.pct >= passMark(env), items,
  });
}
