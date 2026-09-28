import { useState } from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
}

interface StudentDashboardScreenProps {
  userName: string;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onSelectCourse: (courseTitle: string) => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export function StudentDashboardScreen({
  userName,
  theme = 'dark',
  onToggleTheme,
  onSelectCourse,
  onNavigateToProfile,
  onLogout,
}: StudentDashboardScreenProps) {
  const courses: Course[] = [
    {
      id: 1,
      title: 'HTML5 e CSS3',
      description: 'Aprenda os fundamentos do desenvolvimento web.',
      progress: 0,
    },
    {
      id: 2,
      title: 'JavaScript Avançado',
      description: 'Aprenda JavaScript de forma mais aprofundada.',
      progress: 0,
    },
    {
      id: 3,
      title: 'React.js',
      description: 'Crie aplicações modernas com React.',
      progress: 0,
    },
    {
      id: 4,
      title: 'UX/UI Design',
      description: 'Aprenda princípios de experiência e interface.',
      progress: 0,
    },
  ];

  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0b0e13] text-white' : 'bg-gray-50 text-gray-900';
  const headerBg = isDark ? 'bg-[#212127] border-gray-800' : 'bg-white border-gray-200 shadow-sm';
  const cardBg = isDark ? 'bg-[#212127] border-gray-800' : 'bg-white border-gray-200 shadow-md';
  const textColorMuted = isDark ? 'text-gray-400' : 'text-gray-600';
  const textColorMain = isDark ? 'text-gray-300' : 'text-gray-800';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${bgMain}`}>
      <header className={`${headerBg} border-b px-6 py-4 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-wider">PRISMA</h1>

          <div className="flex items-center gap-5">
            <span className={`text-sm font-medium ${textColorMain}`}>
              Olá, {userName}
            </span>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`px-3 py-1.5 rounded-xl font-semibold text-xs transition shadow-sm flex items-center gap-1.5 ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {isDark ? '☀️ Claro' : '🌙 Escuro'}
              </button>
            )}

            <button
              onClick={onNavigateToProfile}
              className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
            >
              Perfil
            </button>

            <button
              onClick={onLogout}
              className="text-red-400 hover:text-red-300 text-sm font-semibold transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            Bem-vindo ao PRISMA!
          </h2>

          <p className={textColorMuted}>
            Continue seus estudos e acompanhe seu progresso.
          </p>
        </div>

        <h3 className="text-2xl font-bold mb-6">
          Meus cursos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              className={`${cardBg} rounded-2xl p-5 border hover:border-blue-500 transition shadow-lg flex flex-col justify-between`}
            >
              <div>
                <h4 className="text-xl font-bold mb-3">
                  {course.title}
                </h4>

                <p className={`${textColorMuted} text-sm mb-5 leading-relaxed`}>
                  {course.description}
                </p>
              </div>

              <div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className={textColorMuted}>
                      Progresso
                    </span>

                    <span className={textColorMain}>
                      {course.progress}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${course.progress}%`,
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => onSelectCourse(course.title)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold transition shadow-md"
                >
                  Acessar curso
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}