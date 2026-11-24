import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  id?: string;
  title: string;
  subtitle?: string;
  items: FaqItem[];
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({ id, title, subtitle, items }) => {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section
      id={id}
      className="py-20 sm:py-24 px-5 sm:px-8 lg:px-14 bg-[#FAFAFA] border-t border-neutral-200"
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] leading-[1.12]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-base sm:text-lg text-neutral-600 leading-relaxed max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>

        <div className="divide-y divide-neutral-200 border-y border-neutral-200 bg-white rounded-xl overflow-hidden border-x">
          {items.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `faq-panel-${item.id}`;
            const buttonId = `faq-btn-${item.id}`;

            return (
              <div key={item.id}>
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    className="w-full min-h-[56px] px-5 sm:px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-[#FAFAFA] transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-semibold text-[#111111] leading-snug">
                      {item.question}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`w-7 h-7 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        isOpen
                          ? 'border-[#E10600] text-[#E10600] bg-[#FFF8F8]'
                          : 'border-neutral-300 text-neutral-700 bg-white'
                      }`}
                    >
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 pt-1 text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
