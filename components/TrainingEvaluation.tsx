
import React, { useState } from 'react';
import { TrainingSession, UserProfile, SessionEvaluation } from '../types';
import { ClipboardCheck, MessageSquare, Star, ArrowRight, Loader2, ShieldCheck, Heart, X, CheckCircle } from 'lucide-react';

interface TrainingEvaluationProps {
  session: TrainingSession;
  user: UserProfile;
  existingEvaluation?: SessionEvaluation;
  onSubmit: (evaluation: SessionEvaluation) => Promise<void>;
  isSubmitting: boolean;
  onClose?: () => void;
}

const TrainingEvaluation: React.FC<TrainingEvaluationProps> = ({ session, user, existingEvaluation, onSubmit, isSubmitting, onClose }) => {
  const [scores, setScores] = useState({ q1: 0, q2: 0, q3: 0, q4: 0, q5: 0 });
  const [feedback, setFeedback] = useState('');

  const questions = [
    { id: 'q1', text: "The training clearly explained the key concepts and steps of the procedure/topic." },
    { id: 'q2', text: "The pacing, visuals, and audio of the video supported learning and understanding." },
    { id: 'q3', text: "The guidance, feedback, and supervision during the return demo were adequate and clear." },
    { id: 'q4', text: "The training venue was appropriate for learning and performing the return demonstration (space, lighting, noise, equipment)." },
    { id: 'q5', text: "Overall, this training session improved my confidence in performing the task or applying the topic in actual practice." }
  ];

  const options = [
    { val: 1, label: 'Strongly Disagree' },
    { val: 2, label: 'Disagree' },
    { val: 3, label: 'Neutral' },
    { val: 4, label: 'Agree' },
    { val: 5, label: 'Strongly Agree' }
  ];

  const handleScoreChange = (qId: string, val: number) => {
    setScores(prev => ({ ...prev, [qId]: val }));
  };

  const isComplete = Object.values(scores).every(v => v > 0) && feedback.trim().length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete) return;

    const evalData: SessionEvaluation = {
      userId: user.hospitalNumber,
      userName: `${user.lastName}, ${user.firstName}`,
      date: new Date().toISOString(),
      scores: scores as any,
      feedback
    };

    await onSubmit(evalData);
  };

  if (existingEvaluation) {
    return (
      <div className="flex-1 max-w-4xl mx-auto w-full p-6 py-12 animate-fadeIn">
        <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
          <div className="bg-gray-800 p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-10">
                  <ClipboardCheck size={180} />
              </div>
              <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        <CheckCircle size={28} />
                    </div>
                    {onClose && (
                      <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                        <X size={28} />
                      </button>
                    )}
                  </div>
                  <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">Submitted Feedback</h1>
                  <p className="mt-2 text-gray-300 font-medium opacity-90 max-w-lg">
                      You completed this evaluation on <b>{new Date(existingEvaluation.date).toLocaleDateString()}</b>. Your input helps us improve!
                  </p>
              </div>
          </div>

          <div className="p-10 space-y-10">
              <div className="space-y-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Response Summary</h3>
                  <div className="space-y-6">
                      {questions.map((q, idx) => {
                          const userScore = (existingEvaluation.scores as any)[q.id];
                          const selectedOpt = options.find(o => o.val === userScore);
                          return (
                              <div key={q.id} className="flex gap-4 items-start bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                  <span className="shrink-0 w-8 h-8 bg-gray-200 text-gray-500 rounded-lg flex items-center justify-center font-black text-sm">{idx + 1}</span>
                                  <div className="space-y-3 flex-1">
                                      <p className="text-gray-800 font-bold leading-snug">{q.text}</p>
                                      <div className="flex flex-wrap gap-2">
                                          {options.map(opt => (
                                              <div key={opt.val} className={`
                                                px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border
                                                ${opt.val === userScore ? 'bg-osmak-green border-osmak-green text-white shadow-md' : 'bg-white border-gray-200 text-gray-400 opacity-60'}
                                              `}>
                                                  {opt.val} - {opt.label}
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                          );
                      })}
                  </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Qualitative Feedback</h3>
                  <div className="bg-blue-50/50 p-8 rounded-3xl border border-blue-100 text-blue-900 font-medium italic relative">
                      <MessageSquare className="absolute top-4 right-4 opacity-10" size={32} />
                      "{existingEvaluation.feedback}"
                  </div>
              </div>

              <div className="pt-6 flex justify-center">
                  <button 
                    onClick={onClose}
                    className="px-10 py-3 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl"
                  >
                      Close Evaluation
                  </button>
              </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 py-12 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="bg-osmak-green p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-10">
                <ClipboardCheck size={180} />
            </div>
            <div className="relative z-10">
                <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                    <ShieldCheck size={28} />
                </div>
                <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">Post-Training Evaluation</h1>
                <p className="mt-2 text-green-50 font-medium opacity-90 max-w-lg">
                    Thank you for completing <b>{session.name}</b>. Your feedback is vital to maintaining our standards of excellence.
                </p>
            </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-12">
            <div className="space-y-10">
                {questions.map((q, idx) => (
                    <div key={q.id} className="space-y-6">
                        <div className="flex gap-4">
                            <span className="shrink-0 w-8 h-8 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center font-black text-sm">
                                {idx + 1}
                            </span>
                            <p className="text-lg font-bold text-gray-800 leading-snug pt-1">
                                {q.text}
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 ml-12">
                            {options.map(opt => {
                                const isSelected = (scores as any)[q.id] === opt.val;
                                return (
                                    <button
                                        key={opt.val}
                                        type="button"
                                        onClick={() => handleScoreChange(q.id, opt.val)}
                                        className={`
                                            flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all group
                                            ${isSelected 
                                                ? 'border-osmak-green bg-green-50 text-osmak-green ring-4 ring-green-100' 
                                                : 'border-gray-100 bg-gray-50 hover:border-gray-300 hover:bg-white text-gray-400'}
                                        `}
                                    >
                                        <div className={`
                                            w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 font-black text-xs transition-colors
                                            ${isSelected ? 'border-osmak-green bg-osmak-green text-white' : 'border-gray-300 bg-white'}
                                        `}>
                                            {opt.val}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-tighter text-center leading-none ${isSelected ? 'text-osmak-green' : 'text-gray-400'}`}>
                                            {opt.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="space-y-6 pt-4">
                    <div className="flex gap-4">
                        <span className="shrink-0 w-8 h-8 bg-gray-100 text-gray-500 rounded-lg flex items-center justify-center font-black text-sm">
                            6
                        </span>
                        <div className="space-y-1">
                            <p className="text-lg font-bold text-gray-800 leading-snug pt-1">
                                What part of the training most helped your learning, or what should be improved?
                            </p>
                            <p className="text-sm text-gray-400 font-medium italic">Please provide specific details if possible.</p>
                        </div>
                    </div>
                    <div className="ml-12">
                        <textarea
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            className="w-full p-6 border-2 border-gray-100 rounded-[2rem] bg-gray-50 focus:bg-white focus:border-osmak-green focus:ring-4 focus:ring-green-50 outline-none transition-all text-gray-800 font-medium min-h-[150px] shadow-inner"
                            placeholder="Type your insights here..."
                        />
                    </div>
                </div>
            </div>

            <div className="pt-10 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-gray-400">
                    <Heart className="text-red-400" size={20} />
                    <span className="text-sm font-bold">QA Division values your privacy and honest input.</span>
                </div>
                <button
                    type="submit"
                    disabled={!isComplete || isSubmitting}
                    className={`
                        px-10 py-4 rounded-2xl font-black text-lg uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl
                        ${isComplete && !isSubmitting
                            ? 'bg-osmak-green hover:bg-osmak-green-dark text-white hover:scale-105 active:scale-95 shadow-green-100'
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'}
                    `}
                >
                    {isSubmitting ? <Loader2 size={24} className="animate-spin" /> : <ClipboardCheck size={24} />}
                    {isSubmitting ? 'Submitting...' : 'Submit Evaluation'}
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default TrainingEvaluation;
