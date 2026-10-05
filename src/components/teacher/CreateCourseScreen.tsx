import { useState } from 'react';

import { supabase } from '../../lib/supabase';

interface CreateCourseScreenProps {
  userId: string;
  onBack: () => void;
}

export function CreateCourseScreen({
  userId,
  onBack,
}: CreateCourseScreenProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Programação');
  const [description, setDescription] = useState('');

  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!title.trim()) {
      alert('Por favor, informe o nome do curso.');
      return;
    }

    if (!category.trim()) {
      alert('Por favor, selecione uma categoria.');
      return;
    }

    if (!description.trim()) {
      alert('Por favor, informe a descrição do curso.');
      return;
    }

    if (!userId) {
      alert(
        'Não foi possível identificar o professor logado.'
      );
      return;
    }

    setIsCreating(true);

    const { error } = await supabase
      .from('courses')
      .insert({
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        teacher_id: userId,
      });

    if (error) {
      console.error(
        'Erro ao criar curso:',
        error
      );

      alert(
        `Erro ao criar curso: ${error.message}`
      );

      setIsCreating(false);
      return;
    }

    alert('Curso criado com sucesso!');

    setIsCreating(false);

    onBack();
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* VOLTAR */}
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 transition"
        >
          ← Voltar ao painel
        </button>

        {/* FORMULÁRIO */}
        <div className="bg-[#212127] rounded-2xl p-8 border border-gray-800 shadow-xl">
          {/* CABEÇALHO */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Criar Novo Curso
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Cadastre uma nova disciplina no PRISMA
              </p>
            </div>

            <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full font-medium">
              Painel do Professor
            </span>
          </div>

          <div className="space-y-5">
            {/* NOME */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm">
                Nome do Curso
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) =>
                  setTitle(e.target.value)
                }
                placeholder="Ex: Desenvolvimento Web com React"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition"
                disabled={isCreating}
              />
            </div>

            {/* CATEGORIA */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm">
                Categoria
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition"
                disabled={isCreating}
              >
                <option value="Programação">
                  Programação
                </option>

                <option value="Desenvolvimento Web">
                  Desenvolvimento Web
                </option>

                <option value="Desenvolvimento Mobile">
                  Desenvolvimento Mobile
                </option>

                <option value="Banco de Dados">
                  Banco de Dados
                </option>

                <option value="Redes">
                  Redes
                </option>

                <option value="Engenharia de Software">
                  Engenharia de Software
                </option>

                <option value="UX/UI Design">
                  UX/UI Design
                </option>

                <option value="Tecnologia">
                  Tecnologia
                </option>
              </select>
            </div>

            {/* DESCRIÇÃO */}
            <div>
              <label className="block text-gray-300 mb-2 font-medium text-sm">
                Descrição do Curso
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                placeholder="Descreva o que os alunos vão aprender neste curso..."
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition resize-none"
                disabled={isCreating}
              />
            </div>

            {/* BOTÕES */}
            <div className="pt-4 border-t border-gray-800 flex justify-end gap-3">
              <button
                onClick={onBack}
                disabled={isCreating}
                className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>

              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating
                  ? 'Criando...'
                  : 'Criar Curso'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}