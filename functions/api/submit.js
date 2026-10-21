import { QUESTIONS, json, ensureTable, score } from '../../lib/common.js';

// POST /api/submit  { name, lang, answers:[0..3,...] }
export async function onRequestPost({ request, env }) {
  let body;
  try { body = await request.json(); } catch { return json({ error: 'bad_json' }, 400); }
  const name = String(body.name || '').trim().slice(0, 80);
  const lang = body.lang === 'en' ? 'en' : body.lang === 'ar' ? 'ar' : null;
  if (name.length < 2 || !lang) return json({ error: 'bad_input' }, 400);
  const n = QUESTIONS[lang].length;
  const answers = Array.isArray(body.answers) ? body.answers.slice(0, n) : [];
  if (answers.length !== n || answers.some((a) => !Number.isInteger(a) || a < 0 || a > 3)) {
    return json({ error: 'incomplete' }, 400);
  }
  const r = score(lang, answers);
  await ensureTable(env);
  await env.DB.prepare(
    'INSERT INTO attempts (id, name, lang, created_at, answers, score, total, pct) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)'
  ).bind(crypto.randomUUID(), name, lang, new Date().toISOString(), JSON.stringify(answers), r.score, r.total, r.pct).run();
  return json({ ok: true }); // examinee gets no score back
}
