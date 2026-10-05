import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  progress: number;
}

interface StudentDashboardScreenProps {
  userName: string;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onSelectCourse: (
    courseId: string,
    courseTitle: string
  ) => void;
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
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('courses')
        .select('id, title, description, image_url')
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        console.error('Erro ao carregar cursos:', error);

        setErrorMessage(
          `Não foi possível carregar os cursos: ${error.message}`
        );

        setCourses([]);
        setLoading(false);
        return;
      }

      const coursesFromDatabase: Course[] =
        (data || []).map((course) => ({
          id: course.id,
          title: course.title,
          description: course.description,
          image_url: course.image_url,
          progress: 0,
        }));

      setCourses(coursesFromDatabase);
      setLoading(false);
    };

    loadCourses();
  }, []);

  const isDark = theme === 'dark';

  const bgMain = isDark
    ? 'bg-[#0b0e13] text-white'
    : 'bg-[#f4f6f9] text-gray-900';

  const headerBg = isDark
    ? 'bg-[#181b22] border-gray-800'
    : 'bg-white border-gray-200 shadow-sm';

  const cardBg = isDark
    ? 'bg-[#181b22] border-gray-800'
    : 'bg-white border-gray-200 shadow-md';

  const textColorMuted = isDark
    ? 'text-gray-400'
    : 'text-gray-600';

  const textColorMain = isDark
    ? 'text-gray-200'
    : 'text-gray-800';

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${bgMain}`}
    >
      {/* Cabeçalho inspirado no modelo PRISMA APRENDIZADO */}
      <header
        className={`${headerBg} border-b px-8 py-5 transition-colors duration-200`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">
                P
              </span>
            </div>

            <span className="font-extrabold tracking-wide text-lg">
              PRISMA APRENDIZADO
            </span>
          </div>

          <div className="flex items-center gap-6">
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
              className={`flex items-center gap-2 text-sm font-semibold transition ${textColorMain} hover:text-blue-500`}
            >
              <span>Meu perfil</span>

              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow">
                {userName
                  ? userName.charAt(0).toUpperCase()
                  : 'U'}
              </div>
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

      <main className="max-w-7xl mx-auto px-8 py-10">
        {/* Mensagem de Boas-Vindas Aprimorada */}
        <div className="mb-10 bg-gradient-to-r from-blue-600/10 via-blue-600/5 to-transparent p-6 rounded-2xl border border-blue-500/20">
          <h2 className="text-3xl font-bold mb-2">
            Olá, {userName}! 👋
          </h2>

          <p
            className={`${textColorMuted} text-base`}
          >
            É ótimo ter você de volta no{' '}
            <strong className="text-blue-500">
              Prisma Aprendizado
            </strong>
            . Continue a sua jornada de evolução profissional
            hoje.
          </p>
        </div>

        <h3 className="text-2xl font-bold mb-6">
          Meus Cursos
        </h3>

        {loading && (
          <div className="py-12 text-center">
            <p className={textColorMuted}>
              Carregando cursos disponíveis...
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
          courses.length === 0 && (
            <div
              className={`${cardBg} border rounded-2xl p-10 text-center shadow-lg`}
            >
              <h3 className="text-xl font-bold mb-2">
                Nenhum curso disponível
              </h3>

              <p className={textColorMuted}>
                Ainda não existem cursos cadastrados na
                plataforma.
              </p>
            </div>
          )}

        {!loading &&
          !errorMessage &&
          courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className={`${cardBg} rounded-2xl p-5 border hover:border-blue-500/60 transition-all duration-200 shadow-xl flex flex-col justify-between h-full group`}
                >
                  <div>
                    {course.image_url ? (
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-36 object-cover rounded-xl mb-4 group-hover:scale-[1.02] transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-full h-36 bg-blue-600/10 border border-blue-500/20 rounded-xl mb-4 flex items-center justify-center text-blue-400 font-bold text-xl">
                        {course.title
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                    )}

                    <h4 className="text-lg font-bold mb-2">
                      {course.title}
                    </h4>

                    <p
                      className={`${textColorMuted} text-xs mb-5 leading-relaxed line-clamp-3`}
                    >
                      {course.description ||
                        'Conteúdo completo estruturado para o seu desenvolvimento prático.'}
                    </p>
                  </div>

                  <div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className={textColorMuted}>
                          Progresso
                        </span>

                        <span className={textColorMain}>
                          {course.progress}%
                        </span>
                      </div>

                      <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden border border-gray-700/50">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        onSelectCourse(
                          course.id,
                          course.title
                        )
                      }
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-semibold text-sm transition shadow-lg shadow-blue-600/20"
                    >
                      Acessar Curso
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </main>
    </div>
  );
}