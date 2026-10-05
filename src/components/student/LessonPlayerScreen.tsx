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
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [savingProgress, setSavingProgress] = useState(false);

  useEffect(() => {
    const loadLesson = async () => {
      if (!moduleId) {
        setErrorMessage('Módulo não identificado.');
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
        .order('order', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Erro ao carregar aula:', error);
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

      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData.user) {
        setErrorMessage('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      const { data: progressData, error: progressError } =
        await supabase
          .from('progress')
          .select(
            'completed, progress_percent, watched_seconds, completed_at'
          )
          .eq('student_id', userData.user.id)
          .eq('lesson_id', data.id)
          .maybeSingle();

      if (progressError) {
        console.error(
          'Erro ao carregar progresso:',
          progressError
        );
      } else if (progressData) {
        setIsCompleted(progressData.completed === true);
      }

      setLoading(false);
    };

    loadLesson();
  }, [moduleId]);

  const getEmbedUrl = (url: string | null) => {
    if (!url) {
      return '';
    }

    if (url.includes('/embed/')) {
      return url;
    }

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname.includes('youtube.com')) {
        const videoId = parsedUrl.searchParams.get('v');

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }

      if (parsedUrl.hostname.includes('youtu.be')) {
        const videoId = parsedUrl.pathname.substring(1);

        if (videoId) {
          return `https://www.youtube.com/embed/${videoId}`;
        }
      }
    } catch {
      return url;
    }

    return url;
  };

  const handleCompleteLesson = async () => {
    if (!lesson || savingProgress || isCompleted) {
      return;
    }

    setSavingProgress(true);
    setErrorMessage('');

    const { data: userData, error: userError } =
      await supabase.auth.getUser();

    if (userError || !userData.user) {
      setErrorMessage(
        'Não foi possível identificar o usuário logado.'
      );
      setSavingProgress(false);
      return;
    }

    const now = new Date().toISOString();

    const { error } = await supabase
      .from('progress')
      .upsert(
        {
          student_id: userData.user.id,
          lesson_id: lesson.id,
          completed: true,
          progress_percent: 100,
          watched_seconds:
            (lesson.duration_minutes ?? 0) * 60,
          completed_at: now,
          updated_at: now,
        },
        {
          onConflict: 'student_id,lesson_id',
        }
      );

    if (error) {
      console.error(
        'Erro ao salvar progresso:',
        error
      );

      setErrorMessage(
        `Não foi possível salvar o progresso: ${error.message}`
      );

      setSavingProgress(false);
      return;
    }

    setIsCompleted(true);
    setSavingProgress(false);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen ${
        isDark
          ? 'bg-[#0b0e13] text-white'
          : 'bg-gray-50 text-gray-900'
      }`}
    >
      <main className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Voltar
        </button>

        {loading && (
          <div className="bg-[#212127] rounded-2xl p-8">
            <p className="text-gray-400">
              Carregando aula...
            </p>
          </div>
        )}

        {!loading && errorMessage && !lesson && (
          <div className="bg-[#212127] rounded-2xl p-8">
            <p className="text-red-400">
              {errorMessage}
            </p>
          </div>
        )}

        {!loading && lesson && (
          <div
            className={`rounded-2xl p-8 border ${
              isDark
                ? 'bg-[#212127] border-gray-800'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row justify-between gap-3 mb-4">
              <p className="text-gray-400 text-sm">
                Curso: {courseTitle}
              </p>

              {isCompleted && (
                <span className="text-green-400 text-sm font-semibold">
                  ✓ Aula concluída
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold mb-6">
              {lesson.title}
            </h1>

            {lesson.video_url && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8">
                <iframe
                  className="w-full h-full"
                  src={getEmbedUrl(lesson.video_url)}
                  title={lesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            )}

            {lesson.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">
                  Descrição
                </h2>

                <p className="text-gray-400">
                  {lesson.description}
                </p>
              </div>
            )}

            {lesson.content && (
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-3">
                  Conteúdo
                </h2>

                <p className="text-gray-400 whitespace-pre-line">
                  {lesson.content}
                </p>
              </div>
            )}

            {lesson.duration_minutes !== null && (
              <p className="text-gray-400 text-sm mb-6">
                Duração: {lesson.duration_minutes} minutos
              </p>
            )}

            {errorMessage && (
              <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6">
                <p className="text-red-400">
                  {errorMessage}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-800">
              <button
                onClick={handleCompleteLesson}
                disabled={
                  savingProgress || isCompleted
                }
                className={`px-6 py-3 rounded-xl font-semibold ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : savingProgress
                    ? 'bg-gray-600 text-gray-300'
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                {savingProgress
                  ? 'Salvando...'
                  : isCompleted
                  ? '✓ Aula concluída'
                  : 'Marcar como Concluída'}
              </button>

              <button
                onClick={onQuiz}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                Fazer quiz →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}