interface Course {
  id: number;
  title: string;
  description: string;
  progress: number;
}

interface StudentDashboardScreenProps {
  userName: string;
  onSelectCourse: (courseTitle: string) => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export function StudentDashboardScreen({
  userName,
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

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <header className="bg-[#212127] border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">PRISMA</h1>

          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              Olá, {userName}
            </span>

            <button
              onClick={onNavigateToProfile}
              className="text-blue-400 hover:text-blue-300"
            >
              Perfil
            </button>

            <button
              onClick={onLogout}
              className="text-red-400 hover:text-red-300"
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

          <p className="text-gray-400">
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
              className="bg-[#212127] rounded-xl p-5 border border-gray-800 hover:border-blue-500 transition"
            >
              <h4 className="text-xl font-bold mb-3">
                {course.title}
              </h4>

              <p className="text-gray-400 text-sm mb-5">
                {course.description}
              </p>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">
                    Progresso
                  </span>

                  <span className="text-gray-300">
                    {course.progress}%
                  </span>
                </div>

                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{
                      width: `${course.progress}%`,
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => onSelectCourse(course.title)}
                className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
              >
                Acessar curso
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}