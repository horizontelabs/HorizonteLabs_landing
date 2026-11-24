interface ContactPayload {
  name?: string;
  email?: string;
  company?: string;
  interest?: string;
  tools?: string[];
  notes?: string;
  sourcePath?: string;
  website?: string; // Honeypot field
}

interface VercelRequest {
  method?: string;
  body?: ContactPayload | string;
}

interface VercelResponse {
  status: (code: number) => { json: (data: unknown) => void };
  setHeader: (name: string, value: string) => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Método no permitido.' });
  }

  let body: ContactPayload;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
  } catch {
    return res.status(400).json({ ok: false, error: 'Formato de solicitud inválido.' });
  }

  // Honeypot anti-spam: respond 200 silently without sending
  if (body.website && body.website.trim().length > 0) {
    return res.status(200).json({ ok: true, mode: 'filtered' });
  }

  const name = (body.name || '').trim().slice(0, 120);
  const email = (body.email || '').trim().slice(0, 160);
  const company = (body.company || '').trim().slice(0, 120);
  const interest = (body.interest || 'general').trim().slice(0, 80);
  const tools = Array.isArray(body.tools) ? body.tools.slice(0, 10).map((t) => String(t).slice(0, 60)) : [];
  const notes = (body.notes || '').trim().slice(0, 1200);
  const sourcePath = (body.sourcePath || '/').trim().slice(0, 100);

  if (!name || !email || !company || !EMAIL_RE.test(email)) {
    return res.status(400).json({
      ok: false,
      error: 'Completa nombre, empresa y un correo corporativo válido.',
    });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactTo = process.env.CONTACT_TO_EMAIL || 'contacto@sustrato.ai';
  const contactFrom = process.env.CONTACT_FROM_EMAIL || 'Sustrato <no-reply@sustrato.ai>';
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  const summaryLines = [
    `Nueva solicitud de diagnóstico — sustrato.ai`,
    `Nombre: ${name}`,
    `Correo: ${email}`,
    `Empresa: ${company}`,
    `Área de interés: ${interest}`,
    `Herramientas: ${tools.length ? tools.join(', ') : 'No especificadas'}`,
    `Origen: ${sourcePath}`,
    `Notas: ${notes || 'Sin notas adicionales'}`,
  ];

  const deliveries: Promise<boolean>[] = [];

  if (resendApiKey) {
    deliveries.push(
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: contactFrom,
          to: [contactTo],
          reply_to: email,
          subject: `[Diagnóstico sustrato.ai] ${company} · ${name}`,
          text: summaryLines.join('\n'),
        }),
      }).then((r) => r.ok)
    );
  }

  if (webhookUrl) {
    deliveries.push(
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: summaryLines.join('\n'),
          payload: { name, email, company, interest, tools, notes, sourcePath, receivedAt: new Date().toISOString() },
        }),
      }).then((r) => r.ok)
    );
  }

  if (deliveries.length === 0) {
    return res.status(503).json({
      ok: false,
      code: 'NOT_CONFIGURED',
      error: 'El envío automático aún no está configurado en este entorno.',
    });
  }

  try {
    const results = await Promise.all(deliveries);
    if (results.some(Boolean)) {
      return res.status(200).json({ ok: true });
    }
    return res.status(502).json({
      ok: false,
      error: 'No pudimos entregar tu solicitud en este momento. Intenta nuevamente o escríbenos directo.',
    });
  } catch {
    return res.status(502).json({
      ok: false,
      error: 'Error de red al procesar tu solicitud. Puedes enviarla por correo directo.',
    });
  }
}
