import React from 'react';

export const SolutLogo: React.FC<{ className?: string }> = ({ className = 'h-8 sm:h-9 w-auto' }) => (
  <svg
    viewBox="0 0 269 72"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Top purple circuit trace */}
    <path
      d="M13 18.5H71.5L90 6.2H108.5"
      stroke="#7633EB"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8.5" cy="18.5" r="4.6" stroke="#7633EB" strokeWidth="3.6" />
    <circle cx="113.3" cy="6.2" r="4.6" stroke="#7633EB" strokeWidth="3.6" />

    {/* Outer deep-blue circuit trace */}
    <path
      d="M8.5 39.6V65.5H117V19H93V36.2"
      stroke="#3113F1"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="8.5" cy="35" r="4.6" stroke="#3113F1" strokeWidth="3.6" />
    <circle cx="93" cy="40.8" r="4.6" stroke="#3113F1" strokeWidth="3.6" />

    {/* Inner cyan circuit trace */}
    <path
      d="M22.5 41.6V53H64.4"
      stroke="#0597F2"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="22.5" cy="37" r="4.6" stroke="#0597F2" strokeWidth="3.6" />
    <circle cx="69" cy="53" r="4.6" stroke="#0597F2" strokeWidth="3.6" />

    {/* Inner pink/magenta circuit trace */}
    <path
      d="M51.6 35H80V53H98.2"
      stroke="#D862DA"
      strokeWidth="6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="47" cy="35" r="4.6" stroke="#D862DA" strokeWidth="3.6" />
    <circle cx="102.8" cy="53" r="4.6" stroke="#D862DA" strokeWidth="3.6" />

    {/* SOLUT geometric wordmark */}
    <g
      stroke="#111111"
      strokeWidth="4.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    >
      {/* S */}
      <path d="M159 31.2V30.4C159 27.9 157.3 26.8 154.6 26.8H144.8C142.1 26.8 140.4 28.4 140.4 31C140.4 33.7 142.1 35.4 144.8 35.4H154.6C157.3 35.4 159 37.1 159 40C159 42.7 157.3 44.6 154.6 44.6H144.8C142.1 44.6 140.4 43.3 140.4 40.6" />
      {/* O */}
      <rect x="167.2" y="26.8" width="18.6" height="17.8" rx="4.4" />
      {/* L */}
      <path d="M194.2 26.2V40.2C194.2 42.9 196 44.6 198.7 44.6H211.5" />
      {/* U */}
      <path d="M218.2 26.2V40.2C218.2 42.9 220 44.6 222.7 44.6H232.3C235 44.6 236.8 42.9 236.8 40.2V26.2" />
      {/* T */}
      <path d="M244 26.8H265M254.5 26.8V45.4" />
    </g>
  </svg>
);

export const GeosomLogo: React.FC<{ className?: string }> = ({ className = 'h-7 sm:h-8 w-auto' }) => (
  <svg
    viewBox="0 0 218 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="geosom-loop-grad" x1="9" y1="9" x2="35" y2="9" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2E6BFF" />
        <stop offset="50%" stopColor="#7B35D8" />
        <stop offset="100%" stopColor="#EF3F4D" />
      </linearGradient>
    </defs>

    {/* Official Geosom U-loop mark */}
    <g transform="translate(2, 2)">
      <path
        d="M9 13 C9 37 31 37 31 13"
        stroke="url(#geosom-loop-grad)"
        strokeWidth="3.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="9" cy="9" r="4.2" fill="none" stroke="#2E6BFF" strokeWidth="3.8" />
      <circle cx="31" cy="9" r="4.2" fill="none" stroke="#EF3F4D" strokeWidth="3.8" />
    </g>

    {/* GEOSOM wordmark */}
    <text
      x="56"
      y="30.5"
      fill="#111111"
      fontFamily="'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif"
      fontWeight="700"
      fontSize="26"
      letterSpacing="0.06em"
    >
      GEOSOM
    </text>
  </svg>
);

const clients = [
  {
    name: 'Solut',
    href: 'https://www.solut.cl/',
    logo: <SolutLogo className="h-9 sm:h-10 w-auto" />,
  },
  {
    name: 'Geosom',
    href: 'https://geosom.cl/',
    logo: <GeosomLogo className="h-7 sm:h-[30px] w-auto" />,
  },
];

export const ClientLogos: React.FC = () => {
  return (
    <div className="w-full max-w-xl mx-auto pt-7 sm:pt-8 border-t border-neutral-200/80">
      <p className="text-[11px] font-mono-code uppercase tracking-[0.18em] text-neutral-500 font-medium">
        Han confiado en nosotros
      </p>
      <div className="mt-4 sm:mt-5 flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 gap-y-4">
        {clients.map((client) => (
          <a
            key={client.name}
            href={client.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${client.name} (abre en una nueva pestaña)`}
            className="group inline-flex items-center justify-center min-h-[44px] px-2 py-1 rounded-lg grayscale opacity-60 hover:grayscale-0 hover:opacity-100 focus-visible:grayscale-0 focus-visible:opacity-100 active:grayscale-0 active:opacity-100 transition-[filter,opacity,transform] duration-300 ease-out hover:-translate-y-0.5"
          >
            {client.logo}
          </a>
        ))}
      </div>
    </div>
  );
};
