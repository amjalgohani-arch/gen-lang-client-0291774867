import React, { useState } from 'react';
import { X, Award, Download, Printer, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStudentName?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  defaultStudentName = 'أمجد المطيري',
}) => {
  const [studentName, setStudentName] = useState<string>(defaultStudentName);
  const [selectedCourse, setSelectedCourse] = useState<string>(
    'أساسيات الذكاء الاصطناعي وهندسة الشبكات العصبية'
  );
  const [certificateId] = useState<string>(
    `NBR-EDU-${Math.floor(100000 + Math.random() * 900000)}`
  );
  const currentDate = new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!isOpen) return null;

  const handlePrint = () => {
    confetti({
      particleCount: 80,
      spread: 80,
      origin: { y: 0.6 },
    });
    setTimeout(() => {
      window.print();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              إصدار شهادة إتمام المسار الأكاديمي
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Customizer Inputs */}
        <div className="p-6 bg-slate-100/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              اسم المتعلّم المستحق للشهادة:
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              المسار التعليمي المعتمد:
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="أساسيات الذكاء الاصطناعي وهندسة الشبكات العصبية">
                أساسيات الذكاء الاصطناعي وهندسة الشبكات العصبية
              </option>
              <option value="الفيزياء الكمية والبصريات المتقدمة: تفاعل الضوء والمادة">
                الفيزياء الكمية والبصريات المتقدمة: تفاعل الضوء والمادة
              </option>
              <option value="الرياضيات التطبيقية والنسبة الذهبية في الهندسة والطبيعة">
                الرياضيات التطبيقية والنسبة الذهبية في الهندسة والطبيعة
              </option>
            </select>
          </div>
        </div>

        {/* Printable Official Certificate View */}
        <div className="p-8 sm:p-12 bg-white text-slate-900 flex justify-center">
          <div className="w-full max-w-2xl border-8 border-double border-amber-600/40 p-8 sm:p-10 relative bg-amber-50/20 text-center rounded-lg shadow-sm">
            
            {/* Corner Decorative Ornaments */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600" />
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600" />
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600" />
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600" />

            {/* Emblem Header */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-14 h-14 rounded-full bg-amber-500/10 border-2 border-amber-500 flex items-center justify-center text-amber-700 font-extrabold text-2xl mb-2">
                ن
              </div>
              <div className="text-xs font-semibold tracking-widest text-slate-500 uppercase">
                منصة نِبراس الأكاديمية للتعليم التفاعلي والعلوم
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 font-serif">
                شهادة إتمام معتمدة
              </div>
              <div className="text-xs text-amber-800 font-medium mt-1">
                CERTIFICATE OF ACADEMIC COMPLETION
              </div>
            </div>

            {/* Recipient Statement */}
            <div className="my-6 space-y-4">
              <p className="text-xs text-slate-500">
                تشهد إدارة منصة نبراس التعليمية بأن المتدرب/ـة:
              </p>
              
              <div className="text-2xl sm:text-3xl font-bold text-amber-900 tracking-wide underline decoration-amber-400 decoration-2 underline-offset-8">
                {studentName || 'اسم المتعلّم'}
              </div>

              <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-2">
                قد أتم بنجاح واقتدار كافة متطلبات المسار التفاعلي والمشاريع التطبيقية واختبارات المحاكاة المخبرية في مسار:
              </p>

              <div className="text-base sm:text-lg font-bold text-slate-900 py-1">
                {selectedCourse}
              </div>
            </div>

            {/* Seal & Signatures Footer */}
            <div className="mt-10 pt-6 border-t border-slate-200 grid grid-cols-3 items-center text-center text-xs">
              <div>
                <div className="font-semibold text-slate-800">أ.د. ياسمين خليل</div>
                <div className="text-[10px] text-slate-500">رئيس اللجنة الأكاديمية</div>
              </div>

              {/* Gold Crest Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-200 border-2 border-amber-500 flex flex-col items-center justify-center text-slate-950 shadow-md">
                  <Award className="w-6 h-6" />
                  <span className="text-[8px] font-bold tracking-tighter">معتمد رسمياً</span>
                </div>
              </div>

              <div>
                <div className="font-semibold text-slate-800">{currentDate}</div>
                <div className="text-[10px] text-slate-500 font-mono">{certificateId}</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
