import React, { useState, useEffect } from 'react';
import { Module, Question } from '../types';
import { generateQuizForModule } from '../services/geminiService';
import Quiz from './Quiz';
import { Loader2, ArrowLeft, Play, AlertCircle, FileText } from 'lucide-react';

interface PlayerProps {
  module: Module;
  onExit: () => void;
  onComplete: (score: number) => void;
}

const Player: React.FC<PlayerProps> = ({ module, onExit, onComplete }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [quizReady, setQuizReady] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Construct a robust embed URL
  const getSafeEmbedUrl = (url: string) => {
    try {
      // Handle Google Drive links
      if (url.includes('drive.google.com')) {
        // Convert /view or /view?usp=sharing to /preview for embedding
        return url.replace(/\/view.*$/, '/preview');
      }

      // Handle YouTube links
      if (url.includes('youtu.be/') || url.includes('youtube.com')) {
        let embedUrl = url;

        // Convert youtu.be shortened links to embed format
        if (url.includes('youtu.be/')) {
          const id = url.split('youtu.be/')[1].split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${id}`;
        } 
        // Convert standard watch links to embed format
        else if (url.includes('youtube.com/watch')) {
          try {
            const urlObj = new URL(url);
            const id = urlObj.searchParams.get('v');
            if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
          } catch (e) {
            // Fallback simple parse if URL fails
            const id = url.split('v=')[1]?.split('&')[0];
            if (id) embedUrl = `https://www.youtube.com/embed/${id}`;
          }
        }

        const separator = embedUrl.includes('?') ? '&' : '?';
        // origin is crucial for avoiding playback errors in some environments
        const origin = typeof window !== 'undefined' ? window.location.origin : '';
        
        // enablejsapi=1 and origin are key for fixing Error 153 for YouTube
        return `${embedUrl}${separator}enablejsapi=1&rel=0&modestbranding=1&playsinline=1&origin=${encodeURIComponent(origin)}`;
      }

      // Return original for other types
      return url;
    } catch (e) {
      return url;
    }
  };

  // Simulate video playback for modules without a real video
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (!module.videoUrl && isPlaying && videoProgress < 100) {
      interval = setInterval(() => {
        setVideoProgress(prev => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 0.5; // Simulate progress speed
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, videoProgress, module.videoUrl]);

  // Load quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoadingQuiz(true);
      setError(null);
      setQuizQuestions([]);
      setQuizReady(false);
      
      // If module has hardcoded questions, use them
      if (module.questions && module.questions.length > 0) {
        setQuizQuestions(module.questions);
        setQuizReady(true);
        setLoadingQuiz(false);
        return;
      }

      // Otherwise generate using Gemini
      try {
        const questions = await generateQuizForModule(module);
        if (questions && questions.length > 0) {
           setQuizQuestions(questions);
           setQuizReady(true);
        } else {
           throw new Error("No questions generated");
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load assessment. Please check your connection.');
      } finally {
        setLoadingQuiz(false);
      }
    };
    fetchQuiz();
  }, [module]);

  const handleVideoFinish = () => {
    setVideoProgress(100);
    setIsPlaying(false);
    setShowQuiz(true);
  };

  const handleRetake = () => {
    setShowQuiz(false);
    setVideoProgress(0);
    setIsPlaying(true);
  };

  if (showQuiz) {
    return (
      <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
        <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Quiz: {module.title}</h2>
             <button onClick={onExit} className="text-gray-500 hover:text-gray-800 text-sm">Cancel</button>
        </div>
        <div className="flex-1 overflow-y-auto">
             {quizQuestions.length > 0 ? (
               <Quiz 
                  questions={quizQuestions} 
                  onComplete={onComplete}
                  onRetake={handleRetake}
               />
             ) : (
               <div className="flex h-full items-center justify-center flex-col gap-4 text-gray-500">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="font-medium">Preparing assessment...</p>
                  {error && <p className="text-red-500 text-sm">{error}</p>}
               </div>
             )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent absolute top-0 w-full z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <button 
            onClick={onExit}
            className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-full transition-colors bg-black/20 backdrop-blur-sm"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        </div>
        <span className="font-semibold text-sm opacity-90 drop-shadow-md">{module.title}</span>
      </div>

      {/* Video Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-900 w-full h-full">
        {module.videoUrl ? (
          <div className="w-full h-full pb-20">
             <iframe 
                src={getSafeEmbedUrl(module.videoUrl)} 
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                frameBorder={0}
                title={module.title}
             />
          </div>
        ) : (
          /* Simulation Mode for modules with no videoUrl */
          <>
            {videoProgress < 100 ? (
                <>
                    <div className="text-center space-y-4">
                        <div className="animate-pulse bg-gray-800 rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4 border-2 border-osmak-green">
                            <Play size={40} className="ml-2 text-osmak-green" />
                        </div>
                        <h2 className="text-2xl font-bold">Training Video Playing...</h2>
                        <p className="text-gray-400 text-sm max-w-md mx-auto">
                            Video content simulation for {module.title}
                        </p>
                    </div>
                    
                    {/* Debug Control */}
                    <button 
                        onClick={handleVideoFinish}
                        className="absolute bottom-32 bg-white/10 hover:bg-white/20 px-4 py-2 rounded text-xs border border-white/20 backdrop-blur-sm"
                    >
                        [Developer Mode] Skip to Quiz
                    </button>
                </>
            ) : (
                <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Module Completed</h2>
                    <p className="mb-8 text-gray-300">Proceed to the assessment to finalize your training.</p>
                </div>
            )}
          </>
        )}
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-900 p-4 border-t border-gray-800 absolute bottom-0 w-full z-20">
        {!module.videoUrl ? (
          /* Simulation Controls */
          <>
            {videoProgress >= 100 ? (
                 <button 
                    onClick={() => setShowQuiz(true)}
                    disabled={!quizReady}
                    className="w-full bg-osmak-green hover:bg-osmak-green-dark text-white px-4 py-3 rounded-lg font-bold text-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {loadingQuiz ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
                    {loadingQuiz ? 'Generating Quiz...' : 'Take Assessment'}
                 </button>
            ) : (
              <>
                <div className="w-full bg-gray-700 h-1.5 rounded-full mb-4 overflow-hidden cursor-pointer">
                  <div 
                    className="bg-osmak-green h-full transition-all duration-300 ease-linear"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-400 font-mono">
                    <span>{isPlaying ? 'Playing' : 'Paused'}</span>
                    <span>{Math.round(videoProgress)}%</span>
                </div>
              </>
            )}
          </>
        ) : (
          /* Real Video Controls */
          <div className="flex justify-end items-center">
              <button 
                onClick={() => setShowQuiz(true)}
                disabled={!quizReady}
                className="bg-osmak-green hover:bg-osmak-green-dark text-white px-6 py-2 rounded-lg font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingQuiz ? <Loader2 className="animate-spin" size={18} /> : <FileText size={18} />}
                {loadingQuiz ? 'Loading Quiz...' : 'Take Quiz'}
              </button>
          </div>
        )}
      </div>
      
      {error && (
         <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm z-50">
             <AlertCircle size={16} />
             {error}
         </div>
      )}
    </div>
  );
};

export default Player;