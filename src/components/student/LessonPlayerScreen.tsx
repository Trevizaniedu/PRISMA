import { useEffect, useState } from 'react';

import { supabase } from '../../lib/supabase';

interface LessonPlayerScreenProps {
  courseTitle: string;
  moduleId: string;
  theme?: 'dark' | 'light';
  onBack: () => void;
  onQuiz: () => void;
}

interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  content: string | null;
  video_url: string | null;
  order: number;
  duration_minutes: number | null;
}

export function LessonPlayerScreen({
  courseTitle,
  moduleId,
  theme = 'dark',
  onBack,
  onQuiz,
}: LessonPlayerScreenProps) {
  const [lesson, setLesson] =
    useState<Lesson | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [isCompleted, setIsCompleted] =
    useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      if (!moduleId) {
        setErrorMessage(
          'Módulo não identificado.'
        );

        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');
      setLesson(null);
      setIsCompleted(false);

      const { data, error } = await supabase
        .from('lessons')
        .select(
          'id, module_id, title, description, content, video_url, order, duration_minutes'
        )
        .eq('module_id', moduleId)
        .order('order', {
          ascending: true,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          'Erro ao carregar aula:',
          error
        );

        setErrorMessage(
          `Não foi possível carregar a aula: ${error.message}`
        );

        setLoading(false);
        return;
      }

      if (!data) {
        setErrorMessage(
          'Este módulo ainda não possui aulas cadastradas.'
        );

        setLoading(false);
        return;
      }

      setLesson(data);
      setLoading(false);
    };

    loadLesson();
  }, [moduleId]);

  const handleToggleComplete = () => {
    setIsCompleted((previous) => !previous);
  };

  const isDark = theme === 'dark';

  const bgMain = isDark
    ? 'bg-[#0b0e13] text-white'
    : 'bg-gray-50 text-gray-900';

  const cardBg = isDark
    ? 'bg-[#212127] border-gray-800'
    : 'bg-white border-gray-200 shadow-xl';

  const textColorMuted = isDark
    ? 'text-gray-400'
    : 'text-gray-600';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${bgMain}`}
    >
      <main className="max-w-5xl mx-auto px-6 py-8">

        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 font-medium transition"
        >
          ← Voltar aos detalhes
        </button>

        {loading && (
          <div
            className={`rounded-2xl p-8 border ${cardBg}`}
          >
            <p className={textColorMuted}>
              Carregando aula...
            </p>
          </div>
        )}

        {!loading && errorMessage && (
          <div
            className={`rounded-2xl p-8 border ${cardBg}`}
          >
            <h2 className="text-2xl font-bold mb-3">
              Não foi possível carregar a aula
            </h2>

            <p className="text-red-400">
              {errorMessage}
            </p>
          </div>
        )}

        {!loading &&
          !errorMessage &&
          lesson && (
            <div
              className={`rounded-2xl p-8 border ${cardBg} transition-colors duration-200 shadow-xl`}
            >

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">

                <p
                  className={`${textColorMuted} text-sm`}
                >
                  Curso:{' '}
                  <span className="font-semibold">
                    {courseTitle}
                  </span>
                </p>

                {isCompleted && (
                  <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                    ✓ Aula Concluída
                  </span>
                )}

              </div>

              <h1 className="text-3xl font-bold mb-6">
                {lesson.title}
              </h1>

              {lesson.video_url && (
                <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 border border-gray-800 shadow-inner">
                  <iframe
                    className="w-full h-full"
                    src={lesson.video_url}
                    title={lesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {lesson.description && (
                <>
                  <h2 className="text-2xl font-bold mb-3">
                    Sobre esta aula
                  </h2>

                  <p
                    className={`${textColorMuted} mb-8 leading-relaxed`}
                  >
                    {lesson.description}
                  </p>
                </>
              )}

              {lesson.content && (
                <>
                  <h2 className="text-2xl font-bold mb-3">
                    Conteúdo da aula
                  </h2>

                  <div
                    className={`${textColorMuted} mb-8 leading-relaxed whitespace-pre-line`}
                  >
                    {lesson.content}
                  </div>
                </>
              )}

              {lesson.duration_minutes !== null && (
                <p
                  className={`${textColorMuted} text-sm mb-6`}
                >
                  ⏱️ Duração: {lesson.duration_minutes}{' '}
                  minutos
                </p>
              )}

              {!lesson.video_url &&
                !lesson.description &&
                !lesson.content && (
                  <p
                    className={`${textColorMuted} mb-8`}
                  >
                    Esta aula ainda não possui conteúdo
                    cadastrado.
                  </p>
                )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-800">

                <button
                  onClick={handleToggleComplete}
                  className={`px-6 py-3 rounded-xl font-semibold transition shadow-lg ${
                    isCompleted
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  {isCompleted
                    ? 'Aula Concluída'
                    : 'Marcar como Concluída'}
                </button>

                <button
                  onClick={onQuiz}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg flex items-center gap-2"
                >
                  Fazer quiz do módulo →
                </button>

              </div>
            </div>
          )}

      </main>
    </div>
  );
}