import React, { useState } from 'react';
import {
  RotateCw,
  CheckCircle2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Sparkles,
  Trophy
} from 'lucide-react';
import { Flashcard } from '../types/education';
import confetti from 'canvas-confetti';

interface FlashcardsDeckProps {
  cards: Flashcard[];
  onMasterCard: (cardId: string) => void;
  masteredCount: number;
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({
  cards,
  onMasterCard,
  masteredCount,
}) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());

  const categories = ['all', ...Array.from(new Set(cards.map((c) => c.category)))];

  const filteredCards = cards.filter(
    (c) => activeCategory === 'all' || c.category === activeCategory
  );

  const currentCard = filteredCards[currentIndex] || filteredCards[0];
  const isCurrentMastered = currentCard ? masteredIds.has(currentCard.id) : false;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleMarkMastered = () => {
    if (!currentCard) return;
    const nextSet = new Set(masteredIds);
    if (nextSet.has(currentCard.id)) {
      nextSet.delete(currentCard.id);
    } else {
      nextSet.add(currentCard.id);
      onMasterCard(currentCard.id);
      confetti({
        particleCount: 30,
        spread: 60,
        origin: { y: 0.7 },
      });
    }
    setMasteredIds(nextSet);
  };

  const progressPercent = filteredCards.length > 0
    ? Math.round((masteredIds.size / filteredCards.length) * 100)
    : 0;

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center justify-center gap-1.5">
            <BookMarked className="w-4 h-4 text-amber-500" />
            <span>نظام الاستذكار المتباعد (Spaced Repetition)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
            بطاقات المراجعة السريعة وتثبيت المفاهيم
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            انقر على البطاقة لقلبها واكتشاف الإجابة والتحليل التفصيلي، ثم حدد ما إذا كنت أتقنت المفهوم.
          </p>
        </div>

        {/* Category Filter & Mastery Progress */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setCurrentIndex(0);
                  setIsFlipped(false);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {cat === 'all' ? 'كافة البطاقات' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span>نسبة الإتقان:</span>
            <div className="w-28 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-mono text-slate-900 dark:text-white tabular-nums font-bold">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* 3D Flip Flashcard */}
        {currentCard ? (
          <div className="space-y-6">
            
            <div
              onClick={handleFlip}
              className="cursor-pointer perspective-1000 min-h-[320px] select-none"
            >
              <div
                className={`relative w-full min-h-[320px] rounded-2xl transition-all duration-500 transform-style-3d border border-slate-200 dark:border-slate-800 shadow-lg ${
                  isFlipped
                    ? 'bg-amber-500/10 dark:bg-amber-950/20 border-amber-300 dark:border-amber-900/60'
                    : 'bg-white dark:bg-slate-900'
                }`}
              >
                {/* Front of Card */}
                {!isFlipped ? (
                  <div className="p-8 flex flex-col justify-between h-full min-h-[320px]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {currentCard.category}
                      </span>
                      <span className="font-mono tabular-nums">
                        بطاقة {currentIndex + 1} من {filteredCards.length}
                      </span>
                    </div>

                    <div className="my-auto py-6 text-center">
                      <div className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-relaxed [text-wrap:balance]">
                        {currentCard.question}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                      <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                      <span>انقر لقلب البطاقة وكشف الإجابة</span>
                    </div>
                  </div>
                ) : (
                  /* Back of Card */
                  <div className="p-8 flex flex-col justify-between h-full min-h-[320px]">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        الإجابة والتحليل
                      </span>
                      <span className="font-mono tabular-nums">
                        بطاقة {currentIndex + 1} من {filteredCards.length}
                      </span>
                    </div>

                    <div className="my-auto py-6 space-y-4">
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                        {currentCard.answer}
                      </div>

                      <div className="p-4 rounded-xl bg-white/70 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-semibold text-amber-600 dark:text-amber-400">التفصيل العلمي: </span>
                        {currentCard.detail}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 font-medium">
                      <RotateCw className="w-3.5 h-3.5 text-amber-500" />
                      <span>انقر للعودة للسؤال</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Controls Bar */}
            <div className="flex items-center justify-between gap-4">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1 px-4 py-2.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
                <span>البطاقة السابقة</span>
              </button>

              <button
                onClick={handleMarkMastered}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 shadow-sm ${
                  isCurrentMastered
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>{isCurrentMastered ? 'أتقنت هذا المفهوم ✓' : 'تحديد كمفهوم متقن'}</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-2.5 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors whitespace-nowrap shrink-0 shadow-sm"
              >
                <span>البطاقة التالية</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

          </div>
        ) : (
          <div className="p-8 text-center text-slate-500">لا توجد بطاقات في هذا التصنيف.</div>
        )}

      </div>
    </section>
  );
};
