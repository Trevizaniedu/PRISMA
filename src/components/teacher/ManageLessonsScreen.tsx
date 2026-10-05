import { useEffect, useState } from 'react';

import { supabase } from '../../lib/supabase';

interface ManageLessonsScreenProps {
  moduleId: string;
  moduleTitle: string;
  onBack: () => void;
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
  created_at: string;
}

export function ManageLessonsScreen({
  moduleId,
  moduleTitle,
  onBack,
}: ManageLessonsScreenProps) {
  const [lessons, setLessons] = useState<Lesson[]>([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');

  const [isAdding, setIsAdding] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editingLessonId, setEditingLessonId] =
    useState('');

  const [newLessonTitle, setNewLessonTitle] =
    useState('');

  const [newLessonDescription, setNewLessonDescription] =
    useState('');

  const [newLessonContent, setNewLessonContent] =
    useState('');

  const [newLessonVideoUrl, setNewLessonVideoUrl] =
    useState('');

  const [newLessonDuration, setNewLessonDuration] =
    useState('');

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadLessons = async () => {
      if (!moduleId) {
        setErrorMessage(
          'Módulo não identificado.'
        );

        setLoading(false);

        return;
      }

      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('lessons')
        .select(
          'id, module_id, title, description, content, video_url, order, duration_minutes, created_at'
        )
        .eq('module_id', moduleId)
        .order('order', {
          ascending: true,
        });

      if (error) {
        console.error(
          'Erro ao carregar aulas:',
          error
        );

        setErrorMessage(
          `Não foi possível carregar as aulas: ${error.message}`
        );

        setLessons([]);
        setLoading(false);

        return;
      }

      setLessons(data || []);
      setLoading(false);
    };

    loadLessons();
  }, [moduleId]);

  const clearForm = () => {
    setNewLessonTitle('');
    setNewLessonDescription('');
    setNewLessonContent('');
    setNewLessonVideoUrl('');
    setNewLessonDuration('');

    setEditingLessonId('');
    setIsEditing(false);
    setIsAdding(false);
  };

  const handleAddLesson = async () => {
    if (!newLessonTitle.trim()) {
      alert('Digite o nome da aula.');
      return;
    }

    if (!moduleId) {
      alert('Módulo não identificado.');
      return;
    }

    setIsSaving(true);

    const nextOrder =
      lessons.length > 0
        ? Math.max(
            ...lessons.map(
              (lesson) => lesson.order
            )
          ) + 1
        : 1;

    let durationMinutes: number | null = null;

    if (newLessonDuration.trim()) {
      const parsedDuration = Number(
        newLessonDuration
      );

      if (
        !Number.isInteger(parsedDuration) ||
        parsedDuration < 0
      ) {
        alert(
          'A duração deve ser um número inteiro maior ou igual a zero.'
        );

        setIsSaving(false);

        return;
      }

      durationMinutes = parsedDuration;
    }

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        module_id: moduleId,
        title: newLessonTitle.trim(),
        description:
          newLessonDescription.trim() || null,
        content:
          newLessonContent.trim() || null,
        video_url:
          newLessonVideoUrl.trim() || null,
        order: nextOrder,
        duration_minutes: durationMinutes,
      })
      .select(
        'id, module_id, title, description, content, video_url, order, duration_minutes, created_at'
      )
      .single();

    if (error) {
      console.error(
        'Erro ao criar aula:',
        error
      );

      alert(
        `Erro ao criar aula: ${error.message}`
      );

      setIsSaving(false);

      return;
    }

    if (data) {
      setLessons((previousLessons) => [
        ...previousLessons,
        data,
      ]);
    }

    clearForm();

    setIsSaving(false);

    alert('Aula criada com sucesso!');
  };

  const handleStartEditing = (
    lesson: Lesson
  ) => {
    setEditingLessonId(lesson.id);

    setNewLessonTitle(lesson.title);

    setNewLessonDescription(
      lesson.description || ''
    );

    setNewLessonContent(
      lesson.content || ''
    );

    setNewLessonVideoUrl(
      lesson.video_url || ''
    );

    setNewLessonDuration(
      lesson.duration_minutes !== null
        ? String(lesson.duration_minutes)
        : ''
    );

    setIsEditing(true);
    setIsAdding(false);
  };

  const handleUpdateLesson = async () => {
    if (!editingLessonId) {
      alert('Aula não identificada.');
      return;
    }

    if (!newLessonTitle.trim()) {
      alert('Digite o nome da aula.');
      return;
    }

    setIsSaving(true);

    let durationMinutes: number | null = null;

    if (newLessonDuration.trim()) {
      const parsedDuration = Number(
        newLessonDuration
      );

      if (
        !Number.isInteger(parsedDuration) ||
        parsedDuration < 0
      ) {
        alert(
          'A duração deve ser um número inteiro maior ou igual a zero.'
        );

        setIsSaving(false);

        return;
      }

      durationMinutes = parsedDuration;
    }

    const { data, error } = await supabase
      .from('lessons')
      .update({
        title: newLessonTitle.trim(),
        description:
          newLessonDescription.trim() || null,
        content:
          newLessonContent.trim() || null,
        video_url:
          newLessonVideoUrl.trim() || null,
        duration_minutes: durationMinutes,
      })
      .eq('id', editingLessonId)
      .select(
        'id, module_id, title, description, content, video_url, order, duration_minutes, created_at'
      )
      .single();

    if (error) {
      console.error(
        'Erro ao atualizar aula:',
        error
      );

      alert(
        `Erro ao atualizar aula: ${error.message}`
      );

      setIsSaving(false);

      return;
    }

    if (data) {
      setLessons((previousLessons) =>
        previousLessons.map((lesson) =>
          lesson.id === editingLessonId
            ? data
            : lesson
        )
      );
    }

    clearForm();

    setIsSaving(false);

    alert('Aula atualizada com sucesso!');
  };

  const handleDeleteLesson = async (
    lesson: Lesson
  ) => {
    const confirmed = confirm(
      `Deseja realmente excluir a aula "${lesson.title}"?`
    );

    if (!confirmed) {
      return;
    }

    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', lesson.id);

    if (error) {
      console.error(
        'Erro ao excluir aula:',
        error
      );

      alert(
        `Erro ao excluir aula: ${error.message}`
      );

      return;
    }

    setLessons((previousLessons) =>
      previousLessons.filter(
        (item) => item.id !== lesson.id
      )
    );

    alert('Aula excluída com sucesso!');
  };

  const handleCancelForm = () => {
    if (isSaving) {
      return;
    }

    clearForm();
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-4xl mx-auto px-6 py-8">

        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 transition"
        >
          ← Voltar aos módulos
        </button>

        <div className="bg-[#212127] rounded-2xl p-8 border border-gray-800 shadow-xl">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">

            <div>
              <p className="text-gray-400 text-sm">
                Gerenciando aulas
              </p>

              <h1 className="text-3xl font-bold">
                {moduleTitle}
              </h1>

              <p className="text-gray-500 text-xs mt-2">
                Módulo selecionado
              </p>
            </div>

            {!isEditing && (
              <button
                onClick={() => {
                  setIsAdding(!isAdding);

                  if (isAdding) {
                    clearForm();
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-semibold transition shadow-lg"
              >
                {isAdding
                  ? 'Cancelar'
                  : '+ Nova aula'}
              </button>
            )}

          </div>

          {(isAdding || isEditing) && (
            <div className="mb-6 p-5 bg-[#1b1b22] border border-gray-800 rounded-xl space-y-4">

              <h3 className="font-semibold text-lg">
                {isEditing
                  ? 'Editar Aula'
                  : 'Adicionar Nova Aula'}
              </h3>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Nome da aula
                </label>

                <input
                  type="text"
                  value={newLessonTitle}
                  onChange={(e) =>
                    setNewLessonTitle(
                      e.target.value
                    )
                  }
                  placeholder="Ex: Introdução ao JavaScript"
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Descrição
                </label>

                <textarea
                  value={newLessonDescription}
                  onChange={(e) =>
                    setNewLessonDescription(
                      e.target.value
                    )
                  }
                  placeholder="Descreva o que será aprendido nesta aula..."
                  rows={3}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition resize-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Conteúdo da aula
                </label>

                <textarea
                  value={newLessonContent}
                  onChange={(e) =>
                    setNewLessonContent(
                      e.target.value
                    )
                  }
                  placeholder="Digite o conteúdo que será apresentado na aula..."
                  rows={6}
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition resize-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  URL do vídeo
                </label>

                <input
                  type="url"
                  value={newLessonVideoUrl}
                  onChange={(e) =>
                    setNewLessonVideoUrl(
                      e.target.value
                    )
                  }
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2 text-sm font-medium">
                  Duração em minutos
                </label>

                <input
                  type="number"
                  min="0"
                  step="1"
                  value={newLessonDuration}
                  onChange={(e) =>
                    setNewLessonDuration(
                      e.target.value
                    )
                  }
                  placeholder="Ex: 30"
                  disabled={isSaving}
                  className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end gap-3">

                <button
                  type="button"
                  onClick={handleCancelForm}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm font-semibold transition disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={
                    isEditing
                      ? handleUpdateLesson
                      : handleAddLesson
                  }
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold transition disabled:opacity-50"
                >
                  {isSaving
                    ? 'Salvando...'
                    : isEditing
                      ? 'Salvar alterações'
                      : 'Salvar Aula'}
                </button>

              </div>

            </div>
          )}

          {loading && (
            <div className="py-10 text-center">
              <p className="text-gray-400">
                Carregando aulas...
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
            lessons.length === 0 && (
              <div className="bg-[#0b0e13] border border-gray-800 rounded-xl p-8 text-center">

                <h3 className="text-xl font-bold mb-2">
                  Nenhuma aula cadastrada
                </h3>

                <p className="text-gray-400 mb-5">
                  Este módulo ainda não possui aulas.
                  Crie a primeira aula para começar
                  a adicionar conteúdo.
                </p>

                <button
                  onClick={() =>
                    setIsAdding(true)
                  }
                  className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
                >
                  + Criar primeira aula
                </button>

              </div>
            )}

          {!loading &&
            !errorMessage &&
            lessons.length > 0 && (
              <div className="space-y-4">

                {lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-[#0b0e13] border border-gray-800 rounded-xl p-5 shadow-inner"
                  >

                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">

                      <div className="flex-1">

                        <p className="text-xs text-gray-500 mb-1">
                          Aula {lesson.order}
                        </p>

                        <h3 className="font-semibold text-lg">
                          {lesson.title}
                        </h3>

                        {lesson.description && (
                          <p className="text-gray-400 text-sm mt-2">
                            {lesson.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">

                          {lesson.duration_minutes !== null && (
                            <span>
                              ⏱️{' '}
                              {lesson.duration_minutes}{' '}
                              min
                            </span>
                          )}

                          {lesson.video_url && (
                            <span>
                              🎥 Vídeo disponível
                            </span>
                          )}

                          {lesson.content && (
                            <span>
                              📄 Conteúdo disponível
                            </span>
                          )}

                        </div>

                      </div>

                      <div className="flex items-center gap-3">

                        <button
                          onClick={() =>
                            handleStartEditing(
                              lesson
                            )
                          }
                          disabled={isSaving}
                          className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition disabled:opacity-50"
                        >
                          Editar
                        </button>

                        <button
                          onClick={() =>
                            handleDeleteLesson(
                              lesson
                            )
                          }
                          disabled={isSaving}
                          className="text-red-400 hover:text-red-300 text-sm font-semibold transition disabled:opacity-50"
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