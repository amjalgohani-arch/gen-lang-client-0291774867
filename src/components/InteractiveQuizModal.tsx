import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, ArrowLeft, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { QuizQuestion } from '../types/education';
import confetti from 'canvas-confetti';

interface InteractiveQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteQuiz: (score: number) => void;
}

const DEFAULT_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'ما هو المبدأ الأساسي الذي يفسر عمل كابلات الألياف الضوئية دون فقدان للإشارة؟',
    options: [
      'الانعكاس الداخلي الكلي (Total Internal Reflection)',
      'الانكسار المتكرر في الهواء الطلق',
      'امتصاص الفوتونات وتحويلها لحرارة',
      'تشتت رايلي للضوء الأزرق'
    ],
    correctIndex: 0,
    explanation: 'تعتمد الألياف الضوئية على الانعكاس الداخلي الكلي بنسبة 100% عندما تكون زاوية السقوط أكبر من الزاوية الحرجة للزجاج.'
  },
  {
    id: 'q2',
    question: 'لماذا تفضل دالة ReLU على Sigmoid في الطبقات العميقة للشبكات العصبية؟',
    options: [
      'لأنها تعالج مشكلة تلاشي التدرج الرياضي (Vanishing Gradient) وتسرع الحساب',
      'لأنها تحصر المخرجات دائماً بين 0 و 1',
      'لأنها تتطلب معالجات رسومية باهظة الثمن',
      'لأنها تجعل كافة الأوزان متساوية تلقائياً'
    ],
    correctIndex: 0,
    explanation: 'دالة ReLU مشتقتها تساوي 1 للقيم الموجبة، مما يحافظ على تدفق التدرجات دون اضمحلال سريع أثناء الانتشار العكسي.'
  },
  {
    id: 'q3',
    question: 'ما هي القيمة التقريبية للنسبة الذهبية (Phi) الناتجة عن معادلة φ² - φ - 1 = 0؟',
    options: [
      '1.618033...',
      '3.141592...',
      '2.718281...',
      '1.414213...'
    ],
    correctIndex: 0,
    explanation: 'النسبة الذهبية تساوي (1 + √5) / 2 وهي تقارب 1.6180339887 وتظهر في أبعاد التناغم الطبيعي.'
  }
];

export const InteractiveQuizModal: React.FC<InteractiveQuizModalProps> = ({
  isOpen,
  onClose,
  onCompleteQuiz,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = DEFAULT_QUIZ_QUESTIONS[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    const isCorrect = selectedOption === currentQ.correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < DEFAULT_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 1 : 0);
      onCompleteQuiz(finalScore);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              اختبار قياس الاستيعاب الأكاديمي
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isFinished ? (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>سؤال {currentQuestionIndex + 1} من {DEFAULT_QUIZ_QUESTIONS.length}</span>
                <span className="font-bold text-amber-500 tabular-nums">النتيجة: {score}</span>
              </div>

              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed [text-wrap:balance]">
                {currentQ.question}
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === currentQ.correctIndex;

                  let style = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-amber-400';
                  if (isSelected && !isAnswerSubmitted) {
                    style = 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-900 dark:text-amber-200 font-semibold';
                  }
                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      style = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                    } else if (isSelected) {
                      style = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-right transition-all flex items-center justify-between gap-3 ${style}`}
                    >
                      <span>{option}</span>
                      {isAnswerSubmitted && isCorrect && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {isAnswerSubmitted && isSelected && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation on submit */}
              {isAnswerSubmitted && (
                <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-600 dark:text-amber-400">التفسير الأكاديمي: </span>
                  {currentQ.explanation}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    className="px-5 py-2.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors disabled:opacity-40"
                  >
                    تأكيد الإجابة
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors"
                  >
                    <span>{currentQuestionIndex < DEFAULT_QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Result Screen */
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 border-2 border-amber-500 text-amber-600 mx-auto flex items-center justify-center">
                <Trophy className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  أحسنت! أتممت الاختبار بنجاح
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  لقد أجبت بشكل صحيح على {score} من أصل {DEFAULT_QUIZ_QUESTIONS.length} أسئلة
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-4">
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors"
                >
                  متابعة التعلّم
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
