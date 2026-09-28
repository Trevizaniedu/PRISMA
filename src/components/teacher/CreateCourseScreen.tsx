import { useState } from 'react';

interface CreateCourseScreenProps {
  onBack: () => void;
  onCourseCreated?: (course: { title: string; description: string; category: string }) => void;
}

export function CreateCourseScreen({
  onBack,
  onCourseCreated,
}: CreateCourseScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('HTML e CSS');

  const handleCreate = () => {
    if (!title || !description) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Se houver uma função de callback, passa os dados para o componente pai
    if (onCourseCreated) {
      onCourseCreated({ title, description, category });
    }

    alert('Curso criado com sucesso!');
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 transition"
        >
          ← Voltar ao painel
        </button>

        <div className="bg-[#212127] rounded-2xl p-8 border border-gray-800 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Criar Novo Curso</h1>
              <p className="text-gray-400 text-sm mt-1">Adicione uma nova disciplina e conteúdo ao PRISMA</p>
            </div>
            <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-medium">
              Painel do Professor
            </span>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm">
                Nome do Curso
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Introdução ao React.js"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm">
                Categoria / Tecnologia
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition"
              >
                <option value="HTML e CSS">HTML e CSS</option>
                <option value="JavaScript">JavaScript</option>
                <option value="React.js">React.js</option>
                <option value="UX/UI Design">UX/UI Design</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm">
                Descrição do Curso
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que os alunos vão aprender neste módulo..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition resize-none"
              />
            </div>

            <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition shadow-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg"
              >
                Criar Curso
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}