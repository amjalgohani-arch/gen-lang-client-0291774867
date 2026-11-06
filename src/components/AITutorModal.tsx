import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  HelpCircle,
  Lightbulb,
  CheckCircle2,
  XCircle,
  Bot,
  User,
  Loader2,
  BookOpen
} from 'lucide-react';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTopic?: string;
}

interface Message {
  role: 'user' | 'model';
  content: string;
}

interface ConceptExplanation {
  topic: string;
  analogy: string;
  corePrinciples: string[];
  practicalExample: string;
  keyTakeaway: string;
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  initialTopic = '',
}) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'explain'>('explain');
  const [conceptQuery, setConceptQuery] = useState<string>(initialTopic || 'النسبة الذهبية');
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<ConceptExplanation | null>(null);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);

  // Chat Tutor states
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: 'مرحباً بك يا باحث العلم! أنا "نبراس"، معلمك وموجهك الذكي. اطرح أي سؤال في الفيزياء، الذكاء الاصطناعي، الرياضيات أو أي موضوع دراسي وسأشرحه لك بأسلوب مبسط وواضح.',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleExplainConcept = async (topicToExplain?: string) => {
    const query = topicToExplain || conceptQuery;
    if (!query.trim()) return;

    setIsExplaining(true);
    setSelectedQuizAnswer(null);

    try {
      const res = await fetch('/api/gemini/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: query, level: 'متوسط' }),
      });
      const data = await res.json();
      setExplanation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExplaining(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content: userMsg }];
    setMessages(newMessages);
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: messages.slice(1),
          currentCourse: conceptQuery,
        }),
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'model', content: data.reply }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { role: 'model', content: 'حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.' },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-slate-950">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                المعلّم الأكاديمي الذكي (نبراس AI)
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                شرح المفاهيم الصعبة، التشبيهات التوضيحية والإجابة المباشرة
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab switch */}
            <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('explain')}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activeTab === 'explain'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                تبسيط المفهوم
              </button>
              <button
                onClick={() => setActiveTab('chat')}
                className={`px-3 py-1 rounded font-medium transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                حوار مع المعلم
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {activeTab === 'explain' ? (
            <div className="space-y-6">
              
              {/* Concept Input & Suggestions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  ما المفهوم العلمي أو التقني الذي تود فهمه الآن؟
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={conceptQuery}
                    onChange={(e) => setConceptQuery(e.target.value)}
                    placeholder="مثال: التراكب الكمي، الانحدار التدرجي، قانون سنيل..."
                    className="flex-1 px-4 py-2.5 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleExplainConcept()}
                  />
                  <button
                    onClick={() => handleExplainConcept()}
                    disabled={isExplaining}
                    className="px-5 py-2.5 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isExplaining ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>جاري التبسيط...</span>
                      </>
                    ) : (
                      <>
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>اشرح وبسط</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Quick suggestions */}
                <div className="flex flex-wrap items-center gap-2 mt-3 text-xs">
                  <span className="text-slate-400 text-[11px]">مفاهيم شائعة:</span>
                  {[
                    'النسبة الذهبية في العمارة',
                    'الانحدار التدرجي في الذكاء الاصطناعي',
                    'الانعكاس الداخلي الكلي',
                    'معادلة شرودنغر'
                  ].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setConceptQuery(topic);
                        handleExplainConcept(topic);
                      }}
                      className="text-[11px] text-amber-700 dark:text-amber-300 hover:underline"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Explanation Output */}
              {explanation && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  
                  {/* Analogy Box */}
                  <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-900/50">
                    <div className="text-xs font-bold text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <span>التشبيه الواقعي لترسيخ الفهم:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      {explanation.analogy}
                    </p>
                  </div>

                  {/* Core Principles */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      المبادئ الجوهرية خطوة بخطوة:
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {explanation.corePrinciples.map((prin, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                            {i + 1}
                          </span>
                          <span className="leading-relaxed">{prin}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Practical Example */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                    <div className="font-bold text-slate-900 dark:text-white">تطبيق عملي من الواقع:</div>
                    <p className="leading-relaxed">{explanation.practicalExample}</p>
                  </div>

                  {/* Key Takeaway */}
                  <div className="p-3 rounded-lg bg-slate-900 text-white text-xs font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>الخلاصة الذهبية: {explanation.keyTakeaway}</span>
                  </div>

                  {/* Interactive Mini-Quiz */}
                  {explanation.quizQuestion && (
                    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-amber-500" />
                          <span>سؤال قياس الفهم السريع:</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {explanation.quizQuestion.question}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {explanation.quizQuestion.options.map((opt, optIdx) => {
                          const isSelected = selectedQuizAnswer === optIdx;
                          const isCorrect = optIdx === explanation.quizQuestion!.correctIndex;

                          let btnStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100';
                          if (selectedQuizAnswer !== null) {
                            if (isCorrect) {
                              btnStyle = 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-semibold';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => setSelectedQuizAnswer(optIdx)}
                              className={`p-2.5 rounded-lg border text-xs text-right transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {selectedQuizAnswer !== null && (
                        <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-xs text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          <span className="font-semibold text-amber-600 dark:text-amber-400">التوضيح: </span>
                          {explanation.quizQuestion.explanation}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              )}

            </div>
          ) : (
            /* Chat Mode */
            <div className="space-y-4">
              <div className="space-y-3">
                {messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 ${
                      m.role === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs ${
                        m.role === 'user'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-400" />}
                    </div>

                    <div
                      className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-line ${
                        m.role === 'user'
                          ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {isChatLoading && (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    <span>نبراس يفكّر في صياغة الإجابة...</span>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer (for Chat Mode) */}
        {activeTab === 'chat' && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="اكتب سؤالك التعليمي هنا..."
              className="flex-1 px-4 py-2 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              disabled={isChatLoading || !chatInput.trim()}
              className="px-4 py-2 text-xs font-semibold bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>إرسال</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
