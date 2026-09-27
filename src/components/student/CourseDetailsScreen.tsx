interface CourseDetailsScreenProps {
  courseTitle: string;
  onBack: () => void;
  onStartLesson: () => void;
}

export function CourseDetailsScreen({
  courseTitle,
  onBack,
  onStartLesson,
}: CourseDetailsScreenProps) {
  const modules = [
    'Introdução ao curso',
    'Fundamentos',
    'Prática e exercícios',
  ];

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

          <div className="space-y-4">
            {modules.map((module, index) => (
              <div
                key={index}
                className="bg-[#0b0e13] border border-gray-800 rounded-lg p-5 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm text-gray-500">
                    Módulo {index + 1}
                  </p>

                  <h3 className="font-semibold">
                    {module}
                  </h3>
                </div>

                <button
                  onClick={onStartLesson}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Ver aula
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}