interface TeacherDashboardScreenProps {
  userName: string;
  onCreateCourse: () => void;
  onManageModules: () => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export function TeacherDashboardScreen({
  userName,
  onCreateCourse,
  onManageModules,
  onNavigateToProfile,
  onLogout,
}: TeacherDashboardScreenProps) {
  const courses = [
    'HTML5 e CSS3',
    'JavaScript Avançado',
    'React.js',
    'UX/UI Design',
  ];

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <header className="bg-[#212127] border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            PRISMA
          </h1>

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
        <h2 className="text-3xl font-bold mb-2">
          Painel do Professor
        </h2>

        <p className="text-gray-400 mb-8">
          Gerencie seus cursos e conteúdos.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <div className="bg-[#212127] rounded-xl p-6">
            <p className="text-gray-400">
              Alunos
            </p>

            <p className="text-3xl font-bold mt-2">
              120
            </p>
          </div>

          <div className="bg-[#212127] rounded-xl p-6">
            <p className="text-gray-400">
              Cursos ativos
            </p>

            <p className="text-3xl font-bold mt-2">
              4
            </p>
          </div>

          <div className="bg-[#212127] rounded-xl p-6">
            <p className="text-gray-400">
              Avaliação média
            </p>

            <p className="text-3xl font-bold mt-2">
              4.9
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={onCreateCourse}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
          >
            Criar curso
          </button>

          <button
            onClick={onManageModules}
            className="bg-[#212127] border border-gray-700 hover:border-blue-500 px-5 py-3 rounded-lg font-semibold"
          >
            Gerenciar módulos
          </button>
        </div>

        <h3 className="text-2xl font-bold mb-5">
          Meus cursos
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courses.map((course) => (
            <div
              key={course}
              className="bg-[#212127] rounded-xl p-6 border border-gray-800"
            >
              <h4 className="text-xl font-bold">
                {course}
              </h4>

              <p className="text-gray-400 mt-2">
                Curso disponível na plataforma.
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}