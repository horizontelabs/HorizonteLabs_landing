import React from 'react';
import { ArrowRight, Linkedin } from 'lucide-react';
import { Link } from '../lib/router';

export const teamMembers = [
  {
    id: 'francisco',
    name: 'Francisco Andrades Martínez',
    role: 'Ingeniería de IA y Machine Learning',
    expertise: ['Sistemas agénticos', 'IA en producción', 'MLOps', 'Machine Learning'],
    bio: 'Ingeniero Civil en Informática especializado en diseñar y llevar sistemas de inteligencia artificial a producción. Se desempeña como ML Engineer en ALeRCE (Centro de Modelamiento Matemático de la U. de Chile, Instituto Milenio de Astrofísica y Centro de Datos e IA de la U. de Concepción) y es docente en AnyoneAI formando a ingenieros de Latinoamérica en arquitecturas agénticas.',
    linkedin: 'https://www.linkedin.com/in/francisco-andrades-mart%C3%ADnez-29b6101ab/',
    webp: '/team/francisco.webp',
    jpg: '/team/francisco.jpg',
  },
  {
    id: 'ignacio',
    name: 'Ignacio Rubí Pérez',
    role: 'Ingeniería de Software, Integraciones y Automatización',
    expertise: ['Desarrollo Full-Stack', 'Integraciones ERP/CRM', 'Automatización', 'Arquitectura web'],
    bio: 'Ingeniero en Ejecución en Informática enfocado en construir aplicaciones empresariales y conectar sistemas operativos con flujos automatizados e inteligencia artificial. Especialista en llevar integraciones, APIs y software a medida desde la arquitectura inicial hasta producción estable y mantenible para equipos de negocio.',
    linkedin: 'https://www.linkedin.com/in/ignacio-rubi/',
    webp: '/team/ignacio.webp',
    jpg: '/team/ignacio.jpg',
  },
];

interface TeamSectionProps {
  compact?: boolean;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ compact = false }) => {
  return (
    <section
      id="equipo"
      className={`${compact ? 'py-12 sm:py-24' : 'py-12 sm:py-24'} px-5 sm:px-8 lg:px-14 bg-white border-t border-neutral-200`}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-8 sm:mb-16">
          <div className="max-w-2xl">
            <h2 className="text-[1.75rem] sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
              Quiénes construimos sustrato.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed">
              Trabajas directo con los ingenieros que diseñan, integran y despliegan tu capa en
              producción — sin capas comerciales intermedias.
            </p>
          </div>

          {compact && (
            <Link
              to="/nosotros"
              className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#111111] hover:text-[#E10600] transition-colors shrink-0"
            >
              <span>Conocer cómo trabajamos</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-14 items-stretch">
          {teamMembers.map((member) => (
            <article
              key={member.id}
              className="group flex flex-col bg-[#FAFAFA] border border-neutral-200 rounded-2xl p-5 sm:p-8"
            >
              <div className="w-full max-w-[340px] aspect-[4/3] bg-neutral-100 rounded-xl overflow-hidden mb-5 sm:mb-6 border border-neutral-200">
                <picture>
                  <source srcSet={member.webp} type="image/webp" />
                  <img
                    src={member.jpg}
                    alt={`Retrato de ${member.name}`}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 [@media(hover:hover)]:group-hover:scale-[1.03] [@media(hover:hover)]:grayscale [@media(hover:hover)]:group-hover:grayscale-0"
                  />
                </picture>
              </div>

              <div className="mb-3 sm:mb-4">
                <h3 className="text-xl sm:text-2xl font-bold text-[#111111] tracking-[-0.02em]">
                  {member.name}
                </h3>
                <p className="mt-1 text-xs font-mono-code uppercase tracking-wider text-neutral-600 font-medium">
                  {member.role}
                </p>
              </div>

              <p className="text-base text-neutral-600 leading-relaxed mb-5 sm:mb-6 flex-1">
                {member.bio}
              </p>

              <div className="pt-5 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap gap-1.5">
                  {member.expertise.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white border border-neutral-200 rounded text-[11px] font-medium text-neutral-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 min-h-[44px] text-sm font-semibold text-[#111111] hover:text-[#E10600] transition-colors shrink-0"
                >
                  <Linkedin className="w-4 h-4" aria-hidden="true" />
                  <span>LinkedIn</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
