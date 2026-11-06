import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CourseCatalog } from './components/CourseCatalog';
import { InteractiveLessonViewer } from './components/InteractiveLessonViewer';
import { InteractiveSimulationLab } from './components/InteractiveSimulationLab';
import { FlashcardsDeck } from './components/FlashcardsDeck';
import { StudentDashboard } from './components/StudentDashboard';
import { AITutorModal } from './components/AITutorModal';
import { CertificateModal } from './components/CertificateModal';
import { InteractiveQuizModal } from './components/InteractiveQuizModal';
import { Footer } from './components/Footer';
import { COURSES_DATA, FLASHCARDS_DATA } from './data/coursesData';
import { Course } from './types/education';
import { Sparkles, HelpCircle, Cpu, Award } from 'lucide-react';

export default function App() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [currentTab, setCurrentTab] = useState<string>('catalog');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [initialLabMode, setInitialLabMode] = useState<string>('optics');

  // Modals state
  const [isAITutorOpen, setIsAITutorOpen] = useState<boolean>(false);
  const [aiTutorTopic, setAiTutorTopic] = useState<string>('');
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState<boolean>(false);

  // Student progress state
  const [completedLessons, setCompletedLessons] = useState<string[]>([
    'l-ai-1',
    'l-phy-1'
  ]);
  const [masteredCardsCount, setMasteredCardsCount] = useState<number>(2);

  // Sync dark class on html root
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setCurrentTab('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenLab = (mode?: string) => {
    if (mode) setInitialLabMode(mode);
    setCurrentTab('lab');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAskAI = (topic: string) => {
    setAiTutorTopic(topic);
    setIsAITutorOpen(true);
  };

  const handleToggleLessonCompletion = (lessonId: string) => {
    setCompletedLessons((prev) =>
      prev.includes(lessonId)
        ? prev.filter((id) => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const handleMasterCard = (_cardId: string) => {
    setMasteredCardsCount((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Bar Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenAITutor={() => {
          setAiTutorTopic('الذكاء الاصطناعي');
          setIsAITutorOpen(true);
        }}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentTab === 'catalog' && (
          <>
            <HeroSection
              onExploreCourses={() => {
                const el = document.getElementById('courses-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenLab={() => handleOpenLab('optics')}
              onOpenAITutor={() => {
                setAiTutorTopic('النسبية الخاصة');
                setIsAITutorOpen(true);
              }}
            />

            {/* Quick Interactive Tool Strip */}
            <div className="bg-amber-400 dark:bg-amber-500 py-3 text-slate-950 font-semibold text-xs border-y border-amber-500">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>تعلّم تفاعلي متقدم: تجارب فيزيائية، شبكات عصبية وبطاقات تكرار متباعد</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsQuizOpen(true)}
                    className="underline hover:text-slate-800 transition-colors"
                  >
                    اختبر معلوماتك الآن
                  </button>
                  <span>·</span>
                  <button
                    onClick={() => handleOpenLab('neural')}
                    className="underline hover:text-slate-800 transition-colors"
                  >
                    تجربة الخلية العصبية
                  </button>
                </div>
              </div>
            </div>

            <div id="courses-section">
              <CourseCatalog
                courses={COURSES_DATA}
                onSelectCourse={handleSelectCourse}
                completedCourseIds={['course-ai-neural']}
              />
            </div>

            {/* Mini lab preview on home */}
            <InteractiveSimulationLab initialMode="optics" />

            {/* Flashcards preview on home */}
            <FlashcardsDeck
              cards={FLASHCARDS_DATA}
              onMasterCard={handleMasterCard}
              masteredCount={masteredCardsCount}
            />
          </>
        )}

        {currentTab === 'lesson' && selectedCourse && (
          <InteractiveLessonViewer
            course={selectedCourse}
            onBack={() => setCurrentTab('catalog')}
            onOpenLab={handleOpenLab}
            onAskAI={handleAskAI}
            completedLessons={completedLessons}
            onToggleLessonCompletion={handleToggleLessonCompletion}
          />
        )}

        {currentTab === 'lab' && (
          <InteractiveSimulationLab initialMode={initialLabMode} />
        )}

        {currentTab === 'flashcards' && (
          <FlashcardsDeck
            cards={FLASHCARDS_DATA}
            onMasterCard={handleMasterCard}
            masteredCount={masteredCardsCount}
          />
        )}

        {currentTab === 'progress' && (
          <StudentDashboard
            completedLessonsCount={completedLessons.length}
            completedCourseIds={['course-ai-neural']}
            masteredCardsCount={masteredCardsCount}
            courses={COURSES_DATA}
            onContinueCourse={handleSelectCourse}
            onOpenCertificate={() => setIsCertificateOpen(true)}
          />
        )}
      </main>

      {/* Floating Action Button for Quick AI Explainer / Quiz */}
      <div className="fixed bottom-6 left-6 z-30 flex flex-col items-start gap-2.5">
        <button
          onClick={() => setIsQuizOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span className="hidden sm:inline">اختبار سريع</span>
        </button>

        <button
          onClick={() => {
            setAiTutorTopic('سؤال عام');
            setIsAITutorOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-full text-xs shadow-xl transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>اسأل المعلّم الذكي</span>
        </button>
      </div>

      {/* Modals */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        initialTopic={aiTutorTopic}
      />

      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      <InteractiveQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onCompleteQuiz={() => {}}
      />

      {/* Footer */}
      <Footer
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenCertificate={() => setIsCertificateOpen(true)}
        onOpenAITutor={() => {
          setAiTutorTopic('الذكاء الاصطناعي');
          setIsAITutorOpen(true);
        }}
      />

    </div>
  );
}
