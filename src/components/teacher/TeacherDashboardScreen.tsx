import { useEffect, useState } from 'react';

import { supabase } from '../../lib/supabase';

interface TeacherDashboardScreenProps {
  userName: string;
  userId: string;
  onCreateCourse: () => void;
  onManageModules: (
    courseId: string,
    courseTitle: string
  ) => void;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

interface Course {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export function TeacherDashboardScreen({
  userName,
  userId,
  onCreateCourse,
  onManageModules,
  onNavigateToProfile,
  onLogout,
}: TeacherDashboardScreenProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');

      const { data, error } = await supabase
        .from('courses')
        .select(
          'id, title, description, image_url, created_at'
        )
        .eq('teacher_id', userId)
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        console.error(
          'Erro ao carregar cursos:',
          error
        );

        setErrorMessage(
          `Não foi possível carregar os cursos: ${error.message}`
        );

        setCourses([]);
        setLoading(false);

        return;
      }

      setCourses(data || []);
      setLoading(false);
    };

    loadCourses();
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      {/* HEADER */}
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

      {/* CONTEÚDO */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold mb-2">
          Painel do Professor
        </h2>

        <p className="text-gray-400 mb-8">
          Gerencie seus cursos e conteúdos.
        </p>

        {/* ESTATÍSTICAS */}
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
              {courses.length}
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

        {/* BOTÃO CRIAR */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={onCreateCourse}
            className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
          >
            Criar curso
          </button>
        </div>

        {/* CURSOS */}
        <h3 className="text-2xl font-bold mb-5">
          Meus cursos
        </h3>

        {/* CARREGANDO */}
        {loading && (
          <div className="bg-[#212127] rounded-xl p-6 border border-gray-800">
            <p className="text-gray-400">
              Carregando seus cursos...
            </p>
          </div>
        )}

        {/* ERRO */}
        {!loading && errorMessage && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-6">
            <p className="text-red-400">
              {errorMessage}
            </p>
          </div>
        )}

        {/* NENHUM CURSO */}
        {!loading &&
          !errorMessage &&
          courses.length === 0 && (
            <div className="bg-[#212127] rounded-xl p-8 border border-gray-800 text-center">
              <h4 className="text-xl font-bold mb-2">
                Você ainda não possui cursos
              </h4>

              <p className="text-gray-400 mb-5">
                Crie seu primeiro curso para começar a
                disponibilizar conteúdo aos alunos.
              </p>

              <button
                onClick={onCreateCourse}
                className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-lg font-semibold"
              >
                Criar meu primeiro curso
              </button>
            </div>
          )}

        {/* LISTA DE CURSOS */}
        {!loading &&
          !errorMessage &&
          courses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-[#212127] rounded-xl p-6 border border-gray-800"
                >
                  {/* IMAGEM */}
                  {course.image_url && (
                    <img
                      src={course.image_url}
                      alt={`Capa do curso ${course.title}`}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}

                  {/* TÍTULO */}
                  <h4 className="text-xl font-bold">
                    {course.title}
                  </h4>

                  {/* DESCRIÇÃO */}
                  <p className="text-gray-400 mt-2">
                    {course.description ||
                      'Este curso ainda não possui uma descrição.'}
                  </p>

                  {/* DATA */}
                  <div className="mt-4 text-sm text-gray-500">
                    Criado em:{' '}
                    {new Date(
                      course.created_at
                    ).toLocaleDateString('pt-BR')}
                  </div>

                  {/* AÇÕES */}
                  <div className="flex flex-wrap gap-3 mt-5">
                    <button
                      onClick={() =>
                        onManageModules(
                          course.id,
                          course.title
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold"
                    >
                      Gerenciar módulos
                    </button>

                    <button
                      className="bg-[#0b0e13] border border-gray-700 hover:border-blue-500 px-4 py-2 rounded-lg font-semibold"
                    >
                      Ver curso
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