import { useState } from 'react';

interface CreateCourseScreenProps {
  onBack: () => void;
}

export function CreateCourseScreen({
  onBack,
}: CreateCourseScreenProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!title || !description) {
      alert('Preencha todos os campos.');
      return;
    }

    alert('Curso criado com sucesso!');
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Voltar
        </button>

        <div className="bg-[#212127] rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-8">
            Criar curso
          </h1>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-2">
                Nome do curso
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Digite o nome do curso"
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Descrição
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Digite a descrição"
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white"
              />
            </div>

            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
            >
              Criar curso
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}