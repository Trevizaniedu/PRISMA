import { useEffect, useState } from 'react';

import { supabase } from '../../lib/supabase';

interface ManageModulesScreenProps {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
  onManageLessons: (
    moduleId: string,
    moduleTitle: string
  ) => void;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
  created_at: string;
}

export function ManageModulesScreen({
  courseId,
  courseTitle,
  onBack,
  onManageLessons,
}: ManageModulesScreenProps) {
  const [modules, setModules] =
    useState<Module[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [isAdding, setIsAdding] =
    useState(false);

  const [newModuleTitle, setNewModuleTitle] =
    useState('');

  const [newModuleDescription, setNewModuleDescription] =
    useState('');

  const [isSaving, setIsSaving] =
    useState(false);

  useEffect(() => {
    const loadModules = async () => {
      if (!courseId) {
        setErrorMessage(
          'Curso não identificado.'
        );

        setLoading(false);

        return;
      }

      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('modules')
        .select(
          'id, course_id, title, description, order, created_at'
        )
        .eq('course_id', courseId)
        .order('order', {
          ascending: true,
        });

      if (error) {
        console.error(
          'Erro ao carregar módulos:',
          error
        );

        setErrorMessage(
          `Não foi possível carregar os módulos: ${error.message}`
        );

        setModules([]);
        setLoading(false);

        return;
      }

      setModules(data || []);
      setLoading(false);
    };

    loadModules();
  }, [courseId]);

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) {
      alert('Digite o nome do módulo.');
      return;
    }

    if (!courseId) {
      alert('Curso não identificado.');
      return;
    }

    setIsSaving(true);

    const nextOrder =
      modules.length > 0
        ? Math.max(
            ...modules.map(
              (module) => module.order
            )
          ) + 1
        : 1;

    const { data, error } = await supabase
      .from('modules')
      .insert({
        course_id: courseId,
        title: newModuleTitle.trim(),
        description:
          newModuleDescription.trim() || null,
        order: nextOrder,
      })
      .select(
        'id, course_id, title, description, order, created_at'
      )
      .single();

    if (error) {
      console.error(
        'Erro ao criar módulo:',
        error
      );

      alert(
        `Erro ao criar módulo: ${error.message}`
      );

      setIsSaving(false);

      return;
    }

    if (data) {
      setModules((previousModules) => [
        ...previousModules,
        data,
      ]);
    }

    setNewModuleTitle('');
    setNewModuleDescription('');
    setIsAdding(false);
    setIsSaving(false);

    alert('Módulo criado com sucesso!');
  };

  const handleDeleteModule = async (
    module: Module
  ) => {
    const confirmed = confirm(
      `Deseja realmente excluir o módulo "${module.title}"?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from('modules')
      .delete()
      .eq('id', module.id);

    if (error) {
      console.error(
        'Erro ao excluir módulo:',
        error
      );

      alert(
        `Erro ao excluir módulo: ${error.message}`
      );

      return;
    }

    setModules((previousModules) =>
      previousModules.filter(
        (item) => item.id !== module.id
      )
    );

    alert('Módulo excluído com sucesso!');
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-4xl mx-auto px-6 py-8">

        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 transition"
        >
          ← Voltar aos cursos
        </button>

        <div className="bg-[#212127] rounded-2xl p-8 border border-gray-800 shadow-xl">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">

            <div>
              <p className="text-gray-400 text-sm">
                Gerenciando módulos
              </p>

              <h1 className="text-3xl font-bold">
                {courseTitle}
              </h1>

              <p className="text-gray-500 text-xs mt-2">
                Curso selecionado
              </p>
            </div>

            <button
              onClick={() =>
                setIsAdding(!isAdding)
              }
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-semibold transition shadow-lg"
            >
              {isAdding
                ? 'Cancelar'
                : '+ Novo módulo'}
            </button>

          </div>

          {isAdding && (
            <div className="mb-6 p-5 bg-[#1b1b22] border border-gray-800 rounded-xl space-y-4">

              <h3 className="font-semibold text-lg">
                Adicionar Novo Módulo
              </h3>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Nome do módulo
                </label>

                <input
                  type="text"
                  value={newModuleTitle}
                  onChange={(e) =>
                    setNewModuleTitle(
                      e.target.value
                    )
                  }
                  placeholder="Ex: Fundamentos de JavaScript"
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Descrição do módulo
                </label>

                <textarea
                  value={newModuleDescription}
                  onChange={(e) =>
                    setNewModuleDescription(
                      e.target.value
                    )
                  }
                  placeholder="Descreva o conteúdo deste módulo..."
                  rows={4}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition resize-none disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end gap-3">

                <button
                  onClick={() => {
                    setIsAdding(false);
                    setNewModuleTitle('');
                    setNewModuleDescription('');
                  }}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm font-semibold transition disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleAddModule}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold transition disabled:opacity-50"
                >
                  {isSaving
                    ? 'Salvando...'
                    : 'Salvar Módulo'}
                </button>

              </div>
            </div>
          )}

          {loading && (
            <div className="py-10 text-center">
              <p className="text-gray-400">
                Carregando módulos...
              </p>
            </div>
          )}

          {!loading && errorMessage && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
              <p className="text-red-400">
                {errorMessage}
              </p>
            </div>
          )}

          {!loading &&
            !errorMessage &&
            modules.length === 0 && (
              <div className="bg-[#0b0e13] border border-gray-800 rounded-xl p-8 text-center">

                <h3 className="text-xl font-bold mb-2">
                  Nenhum módulo cadastrado
                </h3>

                <p className="text-gray-400 mb-5">
                  Este curso ainda não possui módulos.
                  Crie o primeiro módulo para começar
                  a adicionar conteúdo.
                </p>

                <button
                  onClick={() =>
                    setIsAdding(true)
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
                >
                  + Criar primeiro módulo
                </button>

              </div>
            )}

          {!loading &&
            !errorMessage &&
            modules.length > 0 && (
              <div className="space-y-4">

                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-[#0b0e13] border border-gray-800 rounded-xl p-5 shadow-inner"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>
                        <p className="text-xs text-gray-500 mb-1">
                          Módulo {module.order}
                        </p>

                        <h3 className="font-semibold text-lg">
                          {module.title}
                        </h3>

                        {module.description && (
                          <p className="text-gray-400 text-sm mt-2">
                            {module.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() =>
                            onManageLessons(
                              module.id,
                              module.title
                            )
                          }
                          className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
                        >
                          Gerenciar aulas
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteModule(module)
                          }
                          className="text-red-400 hover:text-red-300 text-sm font-semibold transition"
                        >
                          Excluir
                        </button>

                      </div>

                    </div>

                  </div>
                ))}

              </div>
            )}

        </div>
      </main>
    </div>
  );
}