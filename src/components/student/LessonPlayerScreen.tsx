import { useState, useEffect } from 'react';

interface LessonPlayerScreenProps {
  courseTitle: string;
  theme?: 'dark' | 'light';
  onBack: () => void;
  onQuiz: () => void;
}

export function LessonPlayerScreen({
  courseTitle,
  theme = 'dark',
  onBack,
  onQuiz,
}: LessonPlayerScreenProps) {
  const [isCompleted, setIsCompleted] = useState(false);

  // Reseta o estado da aula concluída sempre que o curso selecionado mudar
  useEffect(() => {
    setIsCompleted(false);
  }, [courseTitle]);

  const handleToggleComplete = () => {
    setIsCompleted(!isCompleted);
  };

  // Função para retornar o vídeo exato e os detalhes correspondentes a cada matéria
  const getLessonDetails = (title: string) => {
    const t = title.toLowerCase();

    if (t.includes('html') || t.includes('css')) {
      return {
        videoUrl: 'https://www.youtube.com/embed/jgQjeqGRdgA', // Vídeo de Fundamentos (Módulo 1)
        description: 'Nesta aula de Fundamentos de HTML5 e CSS3, você vai entender a evolução da internet, a diferença entre front-end e back-end, organização do ambiente de desenvolvimento (VS Code) e os primeiros passos na estrutura web.',
        topic: 'Fundamentos e Primeiros Passos (Módulo 1)',
      };
    } else if (t.includes('react')) {
      return {
        videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
        description: 'Nesta aula de React.js, compreenda os pilares do desenvolvimento moderno baseados em componentes reutilizáveis, props e o hook useState.',
        topic: 'Introdução ao Ecossistema React e Componentes',
      };
    } else if (t.includes('ux') || t.includes('design')) {
      return {
        videoUrl: 'https://www.youtube.com/embed/P2v1M6_Dx0M',
        description: 'Nesta aula de UX/UI Design, descubra como colocar o utilizador no centro da criação de produtos digitais, mapeando jornadas e hierarquia visual.',
        topic: 'Princípios de Experiência e Interface de Utilizador',
      };
    } else {
      return {
        videoUrl: 'https://www.youtube.com/embed/BXqUH86F-kA',
        description: 'Nesta aula de JavaScript Moderno (ES6+), você dominará os conceitos fundamentais de lógica, funções, manipulação de dados e assincronismo.',
        topic: 'Lógica de Programação e JavaScript Moderno',
      };
    }
  };

  const lessonDetails = getLessonDetails(courseTitle);

  // Tratamento de temas (Dark / Light)
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0b0e13] text-white' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-[#212127] border-gray-800' : 'bg-white border-gray-200 shadow-xl';
  const textColorMuted = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${bgMain}`}>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 font-medium transition"
        >
          ← Voltar aos detalhes
        </button>

        <div className={`rounded-2xl p-8 border ${cardBg} transition-colors duration-200 shadow-xl`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
            <p className={`${textColorMuted} text-sm`}>
              Curso: <span className="font-semibold">{courseTitle}</span>
            </p>
            {isCompleted && (
              <span className="bg-green-500/10 text-green-400 border border-green-500/30 text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5">
                ✓ Aula Concluída
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-6">
            {lessonDetails.topic}
          </h1>

          {/* Leitor de vídeo principal dedicado */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 border border-gray-800 shadow-inner">
            <iframe
              className="w-full h-full"
              src={lessonDetails.videoUrl}
              title={courseTitle}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Sobre esta aula
          </h2>

          <p className={`${textColorMuted} mb-8 leading-relaxed`}>
            {lessonDetails.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-gray-800">
            <button
              onClick={handleToggleComplete}
              className={`px-6 py-3 rounded-xl font-semibold transition shadow-lg ${
                isCompleted
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
            >
              {isCompleted ? 'Aula Concluída' : 'Marcar como Concluída'}
            </button>

            <button
              onClick={onQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg flex items-center gap-2"
            >
              Fazer quiz do módulo →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}