interface LessonPlayerScreenProps {
  courseTitle: string;
  onBack: () => void;
  onQuiz: () => void;
}

export function LessonPlayerScreen({
  courseTitle,
  onBack,
  onQuiz,
}: LessonPlayerScreenProps) {
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
          <p className="text-gray-400 mb-2">
            Curso: {courseTitle}
          </p>

          <h1 className="text-3xl font-bold mb-6">
            Aula 1 — Introdução
          </h1>

          <div className="aspect-video bg-black rounded-xl flex items-center justify-center mb-8">
            <div className="text-gray-500 text-xl">
              Vídeo da aula
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Sobre esta aula
          </h2>

          <p className="text-gray-400 mb-8">
            Nesta aula você aprenderá os principais conceitos
            relacionados ao conteúdo do curso.
          </p>

          <button
            onClick={onQuiz}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
          >
            Fazer quiz
          </button>
        </div>
      </main>
    </div>
  );
}