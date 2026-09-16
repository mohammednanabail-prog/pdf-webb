import React from 'react';
import { Rocket, FilePen, Award, Infinity, Star } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface WhyChooseUsProps {
  currentLang: Language;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const items = [
    {
      icon: <Rocket className="w-7 h-7 text-cyan-400" />,
      title: t.whyUs.interface.title,
      desc: t.whyUs.interface.desc
    },
    {
      icon: <FilePen className="w-7 h-7 text-purple-400" />,
      title: t.whyUs.rename.title,
      desc: t.whyUs.rename.desc
    },
    {
      icon: <Award className="w-7 h-7 text-amber-400" />,
      title: t.whyUs.quality.title,
      desc: t.whyUs.quality.desc
    },
    {
      icon: <Infinity className="w-7 h-7 text-emerald-400" />,
      title: t.whyUs.unlimited.title,
      desc: t.whyUs.unlimited.desc
    }
  ];

  return (
    <div className="w-full mt-10 mb-14">
      {/* Title Tag */}
      <div className="flex items-center justify-center gap-2.5 text-xl sm:text-2xl font-black text-white text-center mb-8">
        <Star className="w-6 h-6 text-amber-400 fill-amber-400/30 animate-pulse" />
        <span>{t.whyChooseUs}</span>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {items.map((item, index) => (
          <div
            key={index}
            className="glass-panel rounded-2xl p-5 sm:p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/15 relative overflow-hidden group flex flex-col items-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-purple-600 group-hover:text-white transition-all duration-300">
              {item.icon}
            </div>

            <h4 className="text-sm sm:text-base font-extrabold text-white mb-1.5">
              {item.title}
            </h4>

            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
