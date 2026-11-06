import React from 'react';
import { Award, BookOpen, Heart } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenCertificate: () => void;
  onOpenAITutor: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectTab,
  onOpenCertificate,
  onOpenAITutor,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-base shadow-sm">
                ن
              </div>
              <span className="text-base font-bold text-white tracking-tight">
                منصة نِبراس التعليمية
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm text-xs">
              صرح عربي تفاعلي يُعنى بنشر العلوم المتقدمة، الذكاء الاصطناعي، والرياضيات التطبيقية عبر نماذج محاكاة مخبرية ومساعدين تعليميين أذكياء.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="font-semibold text-white text-xs mb-3">
              الأقسام الأكاديمية
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('catalog')}
                  className="hover:text-amber-400 transition-colors"
                >
                  المسارات والدورات
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('lab')}
                  className="hover:text-amber-400 transition-colors"
                >
                  مختبر المحاكاة التفاعلي
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('flashcards')}
                  className="hover:text-amber-400 transition-colors"
                >
                  بطاقات الاستذكار
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAITutor}
                  className="hover:text-amber-400 transition-colors"
                >
                  المعلّم الذكي
                </button>
              </li>
            </ul>
          </div>

          {/* Certificates & Trust */}
          <div className="space-y-2">
            <div className="font-semibold text-white text-xs mb-3">
              الاعتماد والشهادات
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              كافة المسارات تمنح شهادات إتمام معتمدة قابلة للتحقق الرقمي الفوري عبر الرمز الأكاديمي.
            </p>
            <button
              onClick={onOpenCertificate}
              className="mt-2 text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5" />
              <span>إصدار شهادة مسار</span>
            </button>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>
            جميع الحقوق محفوظة © {new Date().getFullYear()} منصة نِبراس التعليمية.
          </div>
          <div className="flex items-center gap-2">
            <span>صُنع بشغف لخدمة العلم والمعرفة باللغة العربية</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
          </div>
        </div>

      </div>
    </footer>
  );
};
