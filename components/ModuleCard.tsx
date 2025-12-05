
import React from 'react';
import { Module, ModuleProgress } from '../types';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { PASSING_SCORE } from '../constants';

interface ModuleCardProps {
  module: Module;
  progress: ModuleProgress;
  onStart: (moduleId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, progress, onStart }) => {
  const isCompleted = progress.isCompleted;
  
  // All modules are now unlocked by default
  const canStart = true;

  return (
    <div className={`
      bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full transition-transform duration-200
      hover:shadow-md hover:-translate-y-1
    `}>
      <div className="relative h-48 bg-gray-200 group cursor-pointer" onClick={() => onStart(module.id)}>
        <img 
          src={module.thumbnailUrl} 
          alt={module.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity group-hover:bg-opacity-20">
          {isCompleted ? (
             <div className="bg-osmak-green text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg">
                <CheckCircle size={20} /> Completed
             </div>
          ) : (
            <div className="bg-white text-osmak-green transition-transform transform group-hover:scale-110 p-3 rounded-full shadow-lg">
              <PlayCircle size={48} />
            </div>
          )}
        </div>
        
        {/* Score Badge */}
        {progress.highScore > 0 && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold shadow-sm ${progress.highScore >= PASSING_SCORE ? 'bg-osmak-green text-white' : 'bg-osmak-red text-white'}`}>
            Score: {progress.highScore}%
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">
          {module.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 flex-1">
          {module.description}
        </p>
        
        <div className="flex items-center text-xs text-gray-500 mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {module.duration}
          </div>
        </div>

        {!isCompleted ? (
          <button 
            onClick={() => onStart(module.id)}
            className="mt-4 w-full py-2 bg-osmak-green hover:bg-osmak-green-dark text-white rounded font-medium transition-colors shadow-sm"
          >
            Start Module
          </button>
        ) : (
          <button 
            onClick={() => onStart(module.id)}
            className="mt-4 w-full py-2 border border-osmak-green text-osmak-green hover:bg-gray-50 rounded font-medium transition-colors"
          >
            Review Module
          </button>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;
