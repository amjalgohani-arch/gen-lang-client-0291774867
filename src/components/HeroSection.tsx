import React from 'react';
import { ArrowLeft, Play, Cpu, Compass } from 'lucide-react';
import { EDUCATIONAL_STATS } from '../data/coursesData';

interface HeroSectionProps {
  onExploreCourses: () => void;
  onOpenLab: () => void;
  onOpenAITutor: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreCourses,
  onOpenLab,
  onOpenAITutor,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white border-b border-slate-800">
      {/* Background Hero Image with measured scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_education_arabic_1793978975591.jpg"
          alt="أكاديمية نبراس للتعليم التفاعلي الرقمي"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="max-w-3xl">
          
          {/* Natural editorial kicker (clean unboxed text) */}
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-amber-400 mb-4">
            <span>المنصة الرائدة للعلوم والتقنية باللغة العربية</span>
            <span aria-hidden="true">·</span>
            <span>تعليم تفاعلي ومحاكاة حية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6 [text-wrap:balance]">
            ارتقِ بمهاراتك المعرفية مع بيئات تعلّم تفاعلية تجمع بين عمق النظرية ودقة التجربة
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-8 max-w-2xl">
            من شبكات الذكاء الاصطناعي العميقة إلى فيزياء البصريات والنسبة الذهبية؛ نضع بين يديك مختبرات حية، دروساً مقروءة ومسموعة، ومساعداً تعليمياً ذكياً يشرح المفاهيم المعقدة خطوة بخطوة.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-16">
            <button
              onClick={onExploreCourses}
              className="flex items-center gap-2 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm rounded-lg transition-all shadow-lg shadow-amber-400/20 whitespace-nowrap shrink-0"
            >
              <span>استكشف المسارات التعليمية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenLab}
              className="flex items-center gap-2 px-6 py-3.5 bg-slate-800/80 hover:bg-slate-700/80 text-white font-medium text-sm rounded-lg border border-slate-700 transition-colors whitespace-nowrap shrink-0 backdrop-blur-sm"
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>مختبر المحاكاة التفاعلي</span>
            </button>

            <button
              onClick={onOpenAITutor}
              className="flex items-center gap-2 px-5 py-3.5 text-slate-300 hover:text-white font-medium text-sm transition-colors whitespace-nowrap shrink-0"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>اسأل المعلّم الذكي</span>
            </button>
          </div>

        </div>

        {/* Claim-to-Proof Quantitative Adjacency Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-slate-800/80">
          {EDUCATIONAL_STATS.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono tabular-nums">
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-slate-200">
                {stat.label}
              </div>
              <div className="text-xs text-slate-400">
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
