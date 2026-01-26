
import React, { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Module, Question } from '../types';
import { generateQuizForModule } from '../services/geminiService';
import Quiz from './Quiz';
import { Loader2, ArrowLeft, Play, AlertCircle, FileText, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface PlayerProps {
  module: Module;
  onExit: () => void;
  onComplete: (score: number, answers: Record<string, number>) => void;
}

const Player: React.FC<PlayerProps> = ({ module, onExit, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0); 
  const [isVideoFinished, setIsVideoFinished] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizReady, setQuizReady] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  
  const playerRef = useRef<any>(null);

  // URL Transformation Logic
  const getSafeUrl = (url: string) => {
    if (!url) return '';
    let processedUrl = url.trim();

    // Force Google Drive into /preview mode for embedded streaming
    if (processedUrl.includes('drive.google.com')) {
      if (processedUrl.includes('/view')) {
        processedUrl = processedUrl.replace(/\/view.*$/, '/preview');
      } else if (processedUrl.includes('open?id=')) {
        processedUrl = processedUrl.replace('open?id=', 'file/d/') + '/preview';
      }
    }

    return processedUrl;
  };

  const safeVideoUrl = getSafeUrl(module.videoUrl || '');

  // Auto-progression for non-video modules
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!module.videoUrl && isPlaying && videoProgress < 1) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 1) {
            setIsPlaying(false);
            setIsVideoFinished(true);
            return 1;
          }
          return prev + 0.01; // Faster simulation for debug
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoProgress, module.videoUrl]);

  // Assessment Preparation
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoadingQuiz(true);
      setError(null);
      setQuizReady(false);
      
      if (module.questions && module.questions.length > 0) {
        setQuizQuestions(module.questions);
        setQuizReady(true);
        setLoadingQuiz(false);
        return;
      }

      try {
        const questions = await generateQuizForModule(module);
        if (questions && questions.length > 0) {
           setQuizQuestions(questions);
           setQuizReady(true);
        } else {
           throw new Error("Assessment generation failed.");
        }
      } catch (err) {
        setError('Using standard assessment bank.');
      } finally {
        setLoadingQuiz(false);
      }
    };
    fetchQuiz();
  }, [module]);

  const handleVideoError = (e: any) => {
    console.error("Playback Error:", e);
    setVideoError(true);
    setIsVideoLoading(false);
  };

  if (showQuiz) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-[200] flex flex-col">
        <div className="bg-white border-b px-6 py-4 flex items-center justify-between shadow-sm">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <FileText size={20} className="text-osmak-green" />
                Assessment: {module.title}
            </h2>
             <button onClick={onExit} className="text-gray-500 hover:text-gray-900 font-bold transition-colors">Exit Assessment</button>
        </div>
        <div className="flex-1 overflow-y-auto">
             {quizQuestions.length > 0 ? (
               <Quiz questions={quizQuestions} onComplete={onComplete} onRetake={() => { setShowQuiz(false); setVideoProgress(0); setIsVideoFinished(false); setIsPlaying(true); }} />
             ) : (
               <div className="flex h-full items-center justify-center flex-col gap-4">
                  <Loader2 className="animate-spin text-osmak-green" size={40} />
                  <p className="font-bold text-gray-600">Generating Assessment Questions...</p>
               </div>
             )}
        </div>
      </div>
    );
  }

  // Type-safe player component
  const PlayerComponent = ReactPlayer as any;

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col text-white animate-fadeIn">
      {/* Top Navigation Overlay */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/90 to-transparent absolute top-0 w-full z-[210]">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all bg-black/40 backdrop-blur-sm border border-white/10"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Dashboard</span>
        </button>
        <div className="text-right">
            <h2 className="text-osmak-green font-bold text-xs uppercase tracking-[0.2em] mb-1">Module View</h2>
            <p className="text-sm font-medium opacity-80 truncate max-w-[200px] md:max-w-md">{module.title}</p>
        </div>
      </div>

      {/* Primary Video Container */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black relative">
        {module.videoUrl ? (
          <div className="w-full h-full flex items-center justify-center p-4 pt-24 pb-32">
             <div className="relative w-full h-full max-w-5xl aspect-video bg-gray-950 shadow-2xl overflow-hidden rounded-xl border border-white/5">
                 
                 {/* Subtle Loading State */}
                 {isVideoLoading && !videoError && (
                     <div className="absolute inset-0 z-20 bg-gray-950 flex flex-col items-center justify-center gap-4 animate-pulse">
                        <Loader2 size={48} className="animate-spin text-osmak-green" />
                        <p className="text-sm font-bold opacity-40">Connecting to Stream...</p>
                     </div>
                 )}

                 {/* Connectivity Error State */}
                 {videoError ? (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-8 text-center bg-gray-950">
                        <AlertCircle size={48} className="text-red-500 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Streaming Interrupted</h3>
                        <p className="text-gray-400 text-sm max-w-sm mb-6">
                            Unable to load content. This usually happens due to hospital firewall restrictions or invalid links.
                        </p>
                        <div className="flex gap-3">
                            <a 
                                href={module.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-all"
                            >
                                <ExternalLink size={16} className="inline mr-2" /> Open Externally
                            </a>
                            <button 
                                onClick={() => { setVideoError(false); setIsVideoLoading(true); }}
                                className="px-6 py-2 border border-white/20 rounded-lg hover:bg-white/10 transition-all font-bold text-sm"
                            >
                                <RefreshCw size={16} className="inline mr-2" /> Retry
                            </button>
                        </div>
                    </div>
                 ) : (
                    <PlayerComponent
                        ref={playerRef}
                        url={safeVideoUrl}
                        width="100%"
                        height="100%"
                        playing={isPlaying}
                        controls={true}
                        onReady={() => setIsVideoLoading(false)}
                        onProgress={(state: any) => setVideoProgress(state.played)}
                        onEnded={() => { setIsVideoFinished(true); setIsPlaying(false); }}
                        onError={handleVideoError}
                        config={{
                            youtube: { 
                                playerVars: { 
                                    modestbranding: 1, 
                                    rel: 0,
                                    origin: window.location.origin,
                                    enablejsapi: 1
                                } 
                            },
                            file: {
                                attributes: {
                                    referrerPolicy: "no-referrer-when-downgrade",
                                    controlsList: 'nodownload'
                                }
                            }
                        } as any}
                    />
                 )}
             </div>
          </div>
        ) : (
          /* Visual Simulation for Empty Links */
          <div className="flex flex-col items-center gap-6 p-12 text-center animate-fadeIn">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${isVideoFinished ? 'border-osmak-green bg-osmak-green/20' : 'border-white/10 bg-white/5'}`}>
                {isVideoFinished ? <CheckCircle size={64} className="text-osmak-green" /> : <Loader2 size={64} className="text-white opacity-20 animate-spin-slow" />}
            </div>
            <div className="space-y-2">
                <h2 className="text-4xl font-black">{isVideoFinished ? 'Materials Reviewed' : 'Reviewing Content'}</h2>
                <p className="text-gray-500 max-w-sm mx-auto font-medium">Please proceed to the assessment once you have finished reviewing the supplementary files.</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Progress & Unlock Bar */}
      <div className="bg-gray-900/90 backdrop-blur-xl border-t border-white/10 p-6 absolute bottom-0 w-full z-[210]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="w-full md:w-auto flex-1 space-y-3">
                <div className="flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Progress</span>
                    <span className="text-xs font-mono font-bold text-osmak-green">{Math.round(videoProgress * 100)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-500 ${isVideoFinished ? 'bg-osmak-green shadow-[0_0_15px_rgba(0,154,62,0.5)]' : 'bg-blue-500'}`}
                        style={{ width: `${videoProgress * 100}%` }}
                    />
                </div>
            </div>

            <button 
                onClick={() => setShowQuiz(true)}
                disabled={!quizReady || (!isVideoFinished && !!module.videoUrl)}
                className={`
                    px-10 py-4 rounded-xl font-black text-lg flex items-center gap-3 transition-all min-w-[240px] justify-center
                    ${isVideoFinished || !module.videoUrl 
                        ? 'bg-osmak-green hover:bg-osmak-green-dark text-white hover:scale-105 active:scale-95 shadow-xl shadow-osmak-green/20' 
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'}
                `}
            >
                {loadingQuiz ? <Loader2 className="animate-spin" size={20} /> : <FileText size={20} />}
                {loadingQuiz ? 'Preparing Quiz...' : 'Start Assessment'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default Player;
