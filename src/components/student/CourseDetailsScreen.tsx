import { useEffect, useState } from 'react';

import { supabase } from '../../lib/supabase';

interface CourseDetailsScreenProps {
  courseId: string;
  courseTitle: string;
  onBack: () => void;
  onStartLesson: (moduleId: string) => void;
}

interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order: number;
}

export function CourseDetailsScreen({
  courseId,
  courseTitle,
  onBack,
  onStartLesson,
}: CourseDetailsScreenProps) {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadModules = async () => {
      if (!courseId) {
        setErrorMessage('Curso não identificado.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('modules')
        .select(
          'id, course_id, title, description, order'
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

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-5xl mx-auto px-6 py-8">

        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Voltar
        </button>

        <div className="bg-[#212127] rounded-2xl p-8">

          <h1 className="text-3xl font-bold mb-4">
            {courseTitle}
          </h1>

          <p className="text-gray-400 mb-8">
            Aprenda os principais conceitos e desenvolva
            suas habilidades através das aulas do curso.
          </p>

          <h2 className="text-2xl font-bold mb-5">
            Conteúdo do curso
          </h2>

          {loading && (
            <div className="py-8 text-center">
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
              <div className="bg-[#0b0e13] border border-gray-800 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold mb-2">
                  Nenhum módulo disponível
                </h3>

                <p className="text-gray-400">
                  Este curso ainda não possui módulos.
                </p>
              </div>
            )}

          {!loading &&
            !errorMessage &&
            modules.length > 0 && (
              <div className="space-y-4">

                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="bg-[#0b0e13] border border-gray-800 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <p className="text-sm text-gray-500">
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

                    <button
                      onClick={() =>
                        onStartLesson(module.id)
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                    >
                      Ver aula
                    </button>
                  </div>
                ))}

              </div>
            )}

        </div>
      </main>
    </div>
  );
}