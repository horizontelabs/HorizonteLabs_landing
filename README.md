# sustrato.ai — Sitio web

Sitio multipágina de **sustrato.ai**: la capa donde los agentes de IA leen, actúan y se integran con la operación de una empresa — con sus herramientas conectadas, sus criterios y trazabilidad completa.

## Rutas principales

- `/` — Inicio: propuesta de valor, diagrama interactivo de **La Capa**, puente a las dos verticales, bloque interactivo de **Control y gobernanza**, proceso en 3 etapas, equipo y FAQ.
- `/soluciones` — **Soluciones tecnológicas**: flujo interactivo paso a paso (5 etapas con reproducción), escenarios por tipo de operación con marco repetible y visual *blueprint*, capacidades y gobernanza aplicada.
- `/ingenieria` — **Ingeniería de software**: demostración interactiva de doble superficie (*Vista Equipo* ↔ *Vista Agente API/MCP*), tipos de proyectos con marco repetible, estándares de ingeniería y ciclo en 4 fases.
- `/nosotros` — Equipo fundador y principios de ingeniería.
- `/api/contact` — Vercel Serverless Function para recibir solicitudes del diagnóstico operacional (vía Resend o webhook).

## Stack

- React 19 + TypeScript 5.8 + Vite 6
- Tailwind CSS v4
- Motion (Framer Motion v12) con `reducedMotion="user"`
- Lucide React

## Desarrollo local

```bash
npm install
npm run dev
```

## Variables de entorno

Copia `.env.example` a `.env` y configura:

- `VITE_SITE_URL` — Dominio canónico en producción.
- `VITE_CONTACT_EMAIL` — Correo visible y fallback directo.
- `VITE_BOOKING_URL` — (Opcional) URL de calendario directo (Cal.com / Calendly).
- `RESEND_API_KEY` + `CONTACT_FROM_EMAIL` + `CONTACT_TO_EMAIL` y/o `CONTACT_WEBHOOK_URL` — Destino real del endpoint `/api/contact` en Vercel.

## Validación y build

```bash
npm run lint
npm run build
```
