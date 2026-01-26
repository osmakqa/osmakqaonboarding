
import React, { useState, useMemo } from 'react';
import { Module, Question } from '../types';
import { 
  Plus, Search, Edit2, Trash2, X, Check, 
  Video, Image as ImageIcon, List, 
  CheckCircle, PlusCircle, Layout, Save,
  BookOpen, ShieldCheck, AlertCircle
} from 'lucide-react';

interface CourseManagerProps {
  modules: Module[];
  onAddModule: (module: Module) => void;
  onUpdateModule: (module: Module) => void;
  onDeleteModule: (moduleId: string) => void;
}

const CourseManager: React.FC<CourseManagerProps> = ({ 
  modules, onAddModule, onUpdateModule, onDeleteModule 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Module>>({
    title: '',
    section: '',
    description: '',
    thumbnailUrl: '',
    videoUrl: '',
    topics: [],
    questions: []
  });

  const [newTopic, setNewTopic] = useState('');

  // Derived sections for dropdown
  const existingSections = useMemo(() => {
    const s = new Set<string>();
    modules.forEach(m => s.add(m.section));
    return Array.from(s).sort();
  }, [modules]);

  const filteredModules = modules.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAdd = () => {
    setEditingModule(null);
    setFormData({
      title: '',
      section: '',
      description: '',
      thumbnailUrl: '',
      videoUrl: '',
      topics: [],
      questions: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({ ...module });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.section) {
      alert("Please fill in at least the Title and Section.");
      return;
    }

    const moduleData: Module = {
      ...formData,
      id: editingModule ? editingModule.id : `m_custom_${Date.now()}`,
      title: formData.title!,
      section: formData.section!,
      description: formData.description || '',
      thumbnailUrl: formData.thumbnailUrl || 'https://images.unsplash.com/photo-1516574187841-69301976e499?auto=format&fit=crop&w=800&q=80',
      topics: formData.topics || [],
      questions: formData.questions || []
    } as Module;

    if (editingModule) {
      onUpdateModule(moduleData);
    } else {
      onAddModule(moduleData);
    }
    setIsModalOpen(false);
  };

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics?.includes(newTopic.trim())) {
      setFormData(prev => ({
        ...prev,
        topics: [...(prev.topics || []), newTopic.trim()]
      }));
      setNewTopic('');
    }
  };

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics?.filter((_, i) => i !== index)
    }));
  };

  const addQuestion = () => {
    const newQ: Question = {
      id: `q_${Date.now()}`,
      text: '',
      options: ['', '', '', ''],
      correctAnswerIndex: 0
    };
    setFormData(prev => ({
      ...prev,
      questions: [...(prev.questions || []), newQ]
    }));
  };

  const updateQuestion = (qIndex: number, field: keyof Question, value: any) => {
    const newQs = [...(formData.questions || [])];
    newQs[qIndex] = { ...newQs[qIndex], [field]: value };
    setFormData(prev => ({ ...prev, questions: newQs }));
  };

  const removeQuestion = (qIndex: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== qIndex)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:ring-2 focus:ring-osmak-green focus:border-osmak-green"
          />
        </div>
        <button 
          onClick={handleOpenAdd}
          className="w-full md:w-auto flex items-center justify-center gap-2 bg-osmak-green hover:bg-osmak-green-dark text-white px-6 py-2.5 rounded-lg font-bold shadow-md transition-all active:scale-95"
        >
          <Plus size={20} />
          Add New Module
        </button>
      </div>

      {/* Modules Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase font-bold text-xs border-b">
              <tr>
                <th className="px-6 py-4">Module Details</th>
                <th className="px-6 py-4">Section</th>
                <th className="px-6 py-4">Quiz</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredModules.map(module => (
                <tr key={module.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={module.thumbnailUrl} 
                        className="w-16 h-10 object-cover rounded-md bg-gray-100 shadow-sm" 
                        alt=""
                      />
                      <div>
                        <div className="font-bold text-gray-900">{module.title}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                          <Video size={12} /> {module.videoUrl ? 'Video Attached' : 'Simulation Mode'} 
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase rounded-full border border-blue-100">
                      {module.section}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs">
                      <List size={14} className="text-gray-400" />
                      <span className="font-medium text-gray-700">{module.questions?.length || 0} Questions</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                    <button 
                      onClick={() => handleOpenEdit(module)}
                      className="p-2 text-gray-500 hover:text-osmak-green hover:bg-green-50 rounded-full transition-all"
                      title="Edit Course"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => { if(confirm('Delete this course?')) onDeleteModule(module.id); }}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                      title="Delete Course"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredModules.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500 italic">
                    No courses found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[300] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-full max-h-[90vh] flex flex-col overflow-hidden">
            <div className="bg-gray-800 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-osmak-green rounded-lg">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{editingModule ? 'Edit Module' : 'Add New Module'}</h3>
                  <p className="text-xs opacity-70">Configure training content and assessment</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="hover:text-red-400 p-1">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-gray-50">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Info Column */}
                <div className="space-y-6">
                  <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2">
                    <Layout size={14} /> Module Configuration
                  </h4>
                  
                  <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Module Title</label>
                      <input 
                        type="text" 
                        value={formData.title} 
                        onChange={e => setFormData(p => ({...p, title: e.target.value}))}
                        className="w-full px-4 py-2.5 border rounded-lg bg-white text-black focus:ring-2 focus:ring-osmak-green outline-none" 
                        placeholder="e.g. Infection Control Basics"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Section / Category</label>
                      <div className="flex gap-2">
                        <select 
                          value={formData.section}
                          onChange={e => setFormData(p => ({...p, section: e.target.value}))}
                          className="flex-1 px-4 py-2.5 border rounded-lg bg-white text-black focus:ring-2 focus:ring-osmak-green outline-none"
                        >
                          <option value="">Select Section</option>
                          {existingSections.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input 
                          type="text" 
                          placeholder="Or type new..."
                          className="w-40 px-4 py-2.5 border rounded-lg bg-white text-black focus:ring-2 focus:ring-osmak-green outline-none"
                          onBlur={e => e.target.value && setFormData(p => ({...p, section: e.target.value}))}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Description</label>
                      <textarea 
                        rows={3}
                        value={formData.description} 
                        onChange={e => setFormData(p => ({...p, description: e.target.value}))}
                        className="w-full px-4 py-2.5 border rounded-lg bg-white text-black focus:ring-2 focus:ring-osmak-green outline-none resize-none"
                        placeholder="Brief overview of the course content..."
                      />
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2">
                    <Video size={14} /> Media Assets
                  </h4>
                  <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                        <ImageIcon size={14} className="text-gray-400" />
                        Thumbnail URL
                      </label>
                      <input 
                        type="text" 
                        value={formData.thumbnailUrl} 
                        onChange={e => setFormData(p => ({...p, thumbnailUrl: e.target.value}))}
                        className="w-full px-4 py-2.5 border rounded-lg bg-white text-black text-xs font-mono"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5 flex items-center gap-2">
                        <Video size={14} className="text-gray-400" />
                        Video URL (YouTube/Drive)
                      </label>
                      <input 
                        type="text" 
                        value={formData.videoUrl} 
                        onChange={e => setFormData(p => ({...p, videoUrl: e.target.value}))}
                        className="w-full px-4 py-2.5 border rounded-lg bg-white text-black text-xs font-mono"
                        placeholder="Leave empty for simulation mode"
                      />
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2">
                    <CheckCircle size={14} /> Tags & Topics
                  </h4>
                  <div className="bg-white p-6 rounded-xl border shadow-sm">
                    <div className="flex gap-2 mb-4">
                      <input 
                        type="text" 
                        value={newTopic}
                        onChange={e => setNewTopic(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && addTopic()}
                        className="flex-1 px-4 py-2 border rounded-lg bg-white text-black"
                        placeholder="Add topic tag..."
                      />
                      <button onClick={addTopic} className="bg-gray-100 hover:bg-gray-200 p-2 rounded-lg text-gray-600">
                        <PlusCircle size={20} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.topics?.map((tag, idx) => (
                        <span key={idx} className="bg-osmak-green/10 text-osmak-green px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                          {tag}
                          <button onClick={() => removeTopic(idx)}><X size={12}/></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quiz Builder Column */}
                <div className="space-y-6">
                   <div className="flex items-center justify-between">
                      <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2">
                        <List size={14} /> Quiz Assessment
                      </h4>
                      <button 
                        onClick={addQuestion}
                        className="text-[10px] font-bold uppercase bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 flex items-center gap-1.5 shadow-sm"
                      >
                        <Plus size={12} /> Add Question
                      </button>
                   </div>

                   <div className="space-y-4">
                     {formData.questions?.length === 0 ? (
                       <div className="bg-gray-200/50 border-2 border-dashed border-gray-300 rounded-xl p-12 text-center text-gray-500">
                          <AlertCircle className="mx-auto mb-3 opacity-20" size={48} />
                          <p className="font-bold">No questions added yet.</p>
                          <p className="text-xs">If left empty, AI will generate questions based on topics.</p>
                       </div>
                     ) : (
                       formData.questions?.map((q, qIdx) => (
                         <div key={q.id} className="bg-white rounded-xl border shadow-sm p-6 relative group animate-fadeIn">
                            <button 
                              onClick={() => removeQuestion(qIdx)}
                              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>

                            <div className="flex items-center gap-2 mb-4">
                               <span className="w-6 h-6 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xs font-bold">
                                  {qIdx + 1}
                               </span>
                               <input 
                                  type="text" 
                                  value={q.text}
                                  onChange={e => updateQuestion(qIdx, 'text', e.target.value)}
                                  className="flex-1 font-bold text-gray-800 border-b border-transparent focus:border-osmak-green bg-transparent outline-none py-1"
                                  placeholder="Enter question text..."
                               />
                            </div>

                            <div className="space-y-2 ml-8">
                               {q.options.map((opt, oIdx) => (
                                 <div key={oIdx} className="flex items-center gap-3">
                                   <input 
                                      type="radio" 
                                      checked={q.correctAnswerIndex === oIdx}
                                      onChange={() => updateQuestion(qIdx, 'correctAnswerIndex', oIdx)}
                                      className="w-4 h-4 accent-osmak-green"
                                   />
                                   <input 
                                      type="text" 
                                      value={opt}
                                      onChange={e => {
                                        const newOpts = [...q.options];
                                        newOpts[oIdx] = e.target.value;
                                        updateQuestion(qIdx, 'options', newOpts);
                                      }}
                                      className={`flex-1 px-3 py-2 text-sm border rounded-lg bg-white text-black focus:bg-white transition-colors ${q.correctAnswerIndex === oIdx ? 'ring-1 ring-osmak-green border-osmak-green bg-green-50/50' : 'border-gray-200'}`}
                                      placeholder={`Option ${oIdx + 1}`}
                                   />
                                   {q.correctAnswerIndex === oIdx && <Check className="text-osmak-green" size={16} />}
                                 </div>
                               ))}
                            </div>
                         </div>
                       ))
                     )}
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white border-t p-6 flex justify-between items-center shrink-0">
               <div className="text-xs text-gray-500 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-osmak-green" />
                  Authorized QA Admin Access
               </div>
               <div className="flex gap-4">
                 <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
                 >
                   Cancel
                 </button>
                 <button 
                  onClick={handleSave}
                  className="px-10 py-2.5 bg-osmak-green hover:bg-osmak-green-dark text-white rounded-lg font-bold shadow-lg flex items-center gap-2 transition-transform transform active:scale-95"
                 >
                   <Save size={18} />
                   Save Module
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseManager;
