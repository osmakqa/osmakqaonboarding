import React, { useState } from 'react';
import { Question } from '../types';
import { Check, X, ArrowRight, RotateCcw, AlertCircle } from 'lucide-react';

interface QuizProps {
  questions: Question[];
  onComplete: (scorePercentage: number, answers: Record<string, number>) => void;
  onRetake: () => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete, onRetake }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answersHistory, setAnswersHistory] = useState<Record<string, number>>({});

  // Safety check if questions are missing or empty
  if (!questions || questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
        <AlertCircle size={48} className="mb-4 text-gray-300" />
        <h2 className="text-xl font-bold text-gray-700">No questions available</h2>
        <p>Unable to load assessment data.</p>
        <button 
            onClick={onRetake}
            className="mt-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
            Go Back
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // Extra safety check for the current question
  if (!currentQuestion) {
     return <div className="p-8 text-center">Loading question data...</div>;
  }

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Save current answer to history
    setAnswersHistory(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOption
    }));

    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  const handleFinish = () => {
     const finalScore = Math.round((score / questions.length) * 100);
     onComplete(finalScore, answersHistory);
  };

  if (showResult) {
    const finalScore = Math.round((score / questions.length) * 100);
    const passed = finalScore >= 90;

    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center animate-fadeIn">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${passed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {passed ? <Check size={48} /> : <X size={48} />}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {passed ? 'Assessment Passed!' : 'Assessment Failed'}
        </h2>
        <p className="text-gray-800 mb-6 text-lg">
          You scored <span className={`font-bold ${passed ? 'text-green-700' : 'text-red-700'}`}>{finalScore}%</span>. 
          {passed ? ' You have successfully completed this module.' : ' You need 90% to pass. Please watch the video carefully and try again.'}
        </p>
        
        <div className="flex gap-4">
          {!passed && (
            <button 
              onClick={onRetake}
              className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <RotateCcw size={20} />
              Retake Quiz
            </button>
          )}
          <button 
            onClick={handleFinish}
            className="flex items-center gap-2 px-6 py-3 bg-osmak-green text-white rounded-lg hover:bg-osmak-green-dark transition-colors font-medium"
          >
            {passed ? 'Finish Module' : 'Return to Menu'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full py-8 px-4">
      <div className="mb-6 flex justify-between items-center text-sm text-gray-800 font-bold">
        <span>Question {currentIndex + 1} of {questions.length}</span>
        <span>Score: {score}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
        <div 
          className="bg-osmak-green h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-6 leading-relaxed">
        {currentQuestion.text}
      </h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option, idx) => {
          let optionClass = "w-full p-4 text-left border rounded-lg transition-all flex justify-between items-center font-medium ";
          
          if (isAnswered) {
            if (idx === currentQuestion.correctAnswerIndex) {
              optionClass += "bg-green-50 border-green-500 text-green-900";
            } else if (idx === selectedOption) {
              optionClass += "bg-red-50 border-red-500 text-red-900";
            } else {
              optionClass += "bg-gray-50 border-gray-200 text-gray-400 opacity-60";
            }
          } else {
            if (selectedOption === idx) {
              optionClass += "bg-blue-50 border-blue-500 text-blue-900 ring-1 ring-blue-500";
            } else {
              optionClass += "bg-white border-gray-300 hover:border-blue-400 hover:bg-gray-50 text-gray-900";
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              disabled={isAnswered}
              className={optionClass}
            >
              <span>{option}</span>
              {isAnswered && idx === currentQuestion.correctAnswerIndex && <Check size={20} className="text-green-700" />}
              {isAnswered && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && <X size={20} className="text-red-700" />}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        {!isAnswered ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className={`
              px-6 py-3 rounded-lg font-bold transition-colors
              ${selectedOption === null 
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-osmak-green text-white hover:bg-osmak-green-dark'}
            `}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 font-bold transition-colors"
          >
            {currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Quiz;