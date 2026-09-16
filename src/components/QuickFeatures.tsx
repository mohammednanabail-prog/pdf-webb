import React from 'react';
import { Infinity, Layers, Zap, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

interface QuickFeaturesProps {
  currentLang: Language;
}

export const QuickFeatures: React.FC<QuickFeaturesProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const items = [
    {
      icon: <Infinity className="w-6 h-6 text-cyan-400" />,
      title: t.features.unlimited.title,
      desc: t.features.unlimited.desc
    },
    {
      icon: <Layers className="w-6 h-6 text-purple-400" />,
      title: t.features.formats.title,
      desc: t.features.formats.desc
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: t.features.fast.title,
      desc: t.features.fast.desc
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: t.features.secure.title,
      desc: t.features.secure.desc
    }
  ];

  return (
    <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {items.map((item, index) => (
        <div
          key={index}
          className="glass-panel rounded-2xl p-4 sm:p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-cyan-500/10 flex flex-col items-center group"
        >
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-cyan-500 group-hover:to-purple-600 transition-all duration-300 group-hover:text-white">
            {item.icon}
          </div>
          <h4 className="text-sm sm:text-base font-extrabold text-white mb-1">
            {item.title}
          </h4>
          <p className="text-xs text-slate-400 font-medium">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  );
};
