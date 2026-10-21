import { QUESTIONS, json } from '../../lib/common.js';

// GET /api/questions → questions and options only, without correct answers.
export async function onRequestGet() {
  const strip = (list) => list.map((q) => ({ q: q.q, a: q.a }));
  return json({ ar: strip(QUESTIONS.ar), en: strip(QUESTIONS.en) });
}
