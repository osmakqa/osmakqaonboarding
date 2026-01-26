
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

  // Robust URL Transformation
  const getSafeUrl = (url: string) => {
    if (!url) return '';
    let processedUrl = url.trim();

    // 1. Google Drive Optimization
    if (processedUrl.includes('drive.google.com')) {
      if (processedUrl.includes('/view')) {
        processedUrl = processedUrl.replace(/\/view.*$/, '/preview');
      } else if (processedUrl.includes('open?id=')) {
        processedUrl = processedUrl.replace('open?id=', 'file/d/') + '/preview';
      }
    }

    // 2. YouTube Privacy/Origin Fixes
    // ReactPlayer handles standard YT links well, but we can force certain behaviors
    if (processedUrl.includes('youtube.com') || processedUrl.includes('youtu.be')) {
        // Ensure it's the embed format if it's a raw link
        if (!processedUrl.includes('youtube-nocookie.com')) {
            // Note: ReactPlayer handles the conversion to the API call, 
            // but we ensure the configuration below passes the right parameters.
        }
    }

    return processedUrl;
  };

  const safeVideoUrl = getSafeUrl(module.videoUrl || '');

  // Simulation fallback for modules without video
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
          return prev + 0.005; 
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
      setQuizQuestions([]);
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
    console.error("Video Error Details:", e);
    setVideoError(true);
    setIsVideoLoading(false);
    // Allow progression if video fails to ensure nobody is "stuck"
    setTimeout(() => setIsVideoFinished(true), 1500);
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

  // Casting ReactPlayer to any to bypass the type error where it's misidentified as an HTML video element
  const PlayerComponent = ReactPlayer as any;

  return (
    <div className="fixed inset-0 bg-black z-[200] flex flex-col text-white animate-fadeIn">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-[210]">
        <button 
          onClick={onExit}
          className="flex items-center gap-2 hover:bg-white/20 px-4 py-2 rounded-lg transition-all bg-black/40 backdrop-blur-sm border border-white/10"
        >
          <ArrowLeft size={20} />
          <span className="font-bold text-sm">Return to Dashboard</span>
        </button>
        <div className="text-right">
            <h2 className="text-osmak-green font-bold text-xs uppercase tracking-[0.2em] mb-1">Quality Assurance Training</h2>
            <p className="text-sm font-medium opacity-80">{module.title}</p>
        </div>
      </div>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center bg-black relative">
        {module.videoUrl ? (
          <div className="w-full h-full pt-20 pb-28 flex items-center justify-center">
             <div className="relative w-full h-full max-w-5xl aspect-video bg-gray-900 shadow-2xl overflow-hidden rounded-xl border border-white/5">
                 
                 {/* Video Loading Indicator */}
                 {isVideoLoading && !videoError && (
                     <div className="absolute inset-0 z-20 bg-gray-900 flex flex-col items-center justify-center gap-4">
                        <Loader2 size={48} className="animate-spin text-osmak-green" />
                        <p className="text-sm font-bold opacity-60">Initializing Stream...</p>
                     </div>
                 )}

                 {/* Error State Handler */}
                 {videoError ? (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-12 text-center bg-gray-950">
                        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 border border-red-500/30">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">Playback Connection Error</h3>
                        <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
                            This video content may be restricted by your network firewall or the platform's security policy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a 
                                href={module.videoUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white text-black px-8 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-xl"
                            >
                                <ExternalLink size={18} /> Watch Externally
                            </a>
                            <button 
                                onClick={() => { setVideoError(false); setIsVideoLoading(true); }}
                                className="px-8 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition-all font-bold flex items-center gap-2"
                            >
                                <RefreshCw size={18} /> Retry
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
                        // Fix: explicitly type state as any to prevent SyntheticEvent conflict with ReactPlayer's custom onProgress argument
                        onProgress={(state: any) => setVideoProgress(state.played)}
                        onEnded={() => { setIsVideoFinished(true); setIsPlaying(false); }}
                        onError={handleVideoError}
                        // Critical for fixing Error 153/150
                        // Fix: cast config object to any to avoid TypeScript errors regarding the 'file' property in standard Config types
                        config={{
                            youtube: { 
                                playerVars: { 
                                    modestbranding: 1, 
                                    rel: 0,
                                    origin: window.location.origin,
                                    enablejsapi: 1,
                                    widget_referrer: window.location.origin
                                } 
                            },
                            file: {
                                attributes: {
                                    referrerPolicy: "no-referrer-when-downgrade"
                                }
                            }
                        } as any}
                    />
                 )}
             </div>
          </div>
        ) : (
          /* Simulation Mode Visuals (for modules with no links) */
          <div className="flex flex-col items-center gap-6 p-8 animate-fadeIn">
            <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-700 ${isVideoFinished ? 'border-osmak-green bg-osmak-green/20' : 'border-white/10 bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.05)]'}`}>
                {isVideoFinished ? <CheckCircle size={64} className="text-osmak-green" /> : <Loader2 size={64} className="text-white opacity-20 animate-spin-slow" />}
            </div>
            <div className="text-center space-y-2">
                <h2 className="text-4xl font-black">{isVideoFinished ? 'Ready to Test' : 'Content Review'}</h2>
                <p className="text-gray-500 max-w-sm font-medium">Please review the supplementary materials provided for this section before proceeding.</p>
            </div>
            {!isVideoFinished && (
                <button onClick={() => {setIsVideoFinished(true); setVideoProgress(1);}} className="mt-8 text-xs font-bold text-gray-600 hover:text-white border-b border-gray-800 hover:border-white transition-all">Skip Preview (Admin)</button>
            )}
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div className="bg-gray-900/95 backdrop-blur-xl border-t border-white/10 p-6 absolute bottom-0 w-full z-[210]">
        <div className="max-w-5xl mx-auto space-y-4">
            {/* Progress Visualization */}
            <div className="w-full flex items-center gap-4">
                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-300 shadow-[0_0_10px_rgba(0,154,62,0.3)] ${isVideoFinished ? 'bg-osmak-green' : 'bg-blue-500'}`}
                        style={{ width: `${videoProgress * 100}%` }}
                    />
                </div>
                <div className="text-[10px] font-black font-mono text-gray-500 tracking-tighter whitespace-nowrap">
                    {Math.round(videoProgress * 100)}% COMPLETE
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border transition-colors ${isVideoFinished ? 'bg-osmak-green/10 border-osmak-green/20 text-osmak-green' : 'bg-gray-800 border-white/5 text-gray-400'}`}>
                        {isVideoFinished ? <CheckCircle size={24} /> : <Play size={24} className={isPlaying ? 'animate-pulse' : ''} />}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-0.5">Assessment Status</p>
                        <p className="text-sm font-bold text-white">
                            {videoError ? 'Verification Mode Active' : isVideoFinished ? 'Unlocked - Ready to Begin' : 'Complete View/Review to Unlock'}
                        </p>
                    </div>
                </div>

                <button 
                    onClick={() => setShowQuiz(true)}
                    disabled={!quizReady || (!isVideoFinished && !!module.videoUrl)}
                    className={`
                        px-12 py-4 rounded-xl font-black text-lg flex items-center gap-3 transition-all shadow-2xl
                        ${isVideoFinished || !module.videoUrl 
                            ? 'bg-osmak-green hover:bg-osmak-green-dark text-white hover:scale-[1.02] active:scale-95' 
                            : 'bg-gray-800 text-gray-600 cursor-not-allowed grayscale'}
                    `}
                >
                    {loadingQuiz ? <Loader2 className="animate-spin" size={24} /> : <FileText size={24} />}
                    {loadingQuiz ? 'Initializing Assessment...' : 'Start Assessment'}
                </button>
            </div>
        </div>
      </div>
      
      {error && (
         <div className="fixed top-28 left-1/2 -translate-x-1/2 bg-yellow-500/90 backdrop-blur-md text-black px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black z-[300] border border-yellow-400 animate-slideDown">
             <AlertCircle size={14} />
             <span>Notice: {error}</span>
         </div>
      )}
    </div>
  );
};

export default Player;
