import { useState, FormEvent } from 'react';

// --- INTERFACES & TIPOS ---
interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
}

type ScreenType = 
  | 'login' 
  | 'register' 
  | 'student_dashboard' 
  | 'teacher_dashboard' 
  | 'course_details' 
  | 'lesson' 
  | 'profile' 
  | 'create_course' 
  | 'manage_modules' 
  | 'quiz';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('login');
  const [user, setUser] = useState({
    name: 'Eduardo',
    email: 'seu@email.com',
    role: 'student' as 'student' | 'teacher',
    bio: 'Desenvolvedor em formação apaixonado por tecnologia e design.'
  });
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('UX/UI Design');

  // Login
  const handleLogin = (email: string) => {
    setUser(prev => ({ ...prev, email, name: email.split('@')[0] || 'Eduardo' }));
    setCurrentScreen(user.role === 'teacher' ? 'teacher_dashboard' : 'student_dashboard');
  };

  // Cadastro
  const handleRegister = (name: string, email: string, role: 'student' | 'teacher') => {
    setUser(prev => ({ ...prev, name, email, role }));
    setCurrentScreen(role === 'teacher' ? 'teacher_dashboard' : 'student_dashboard');
  };

  // Logout
  const handleLogout = () => {
    setCurrentScreen('login');
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] font-sans antialiased text-slate-800">
      
      {/* 1. TELA DE LOGIN */}
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigateToRegister={() => setCurrentScreen('register')} 
        />
      )}

      {/* 2. TELA DE CADASTRO */}
      {currentScreen === 'register' && (
        <RegisterScreen 
          onRegister={handleRegister} 
          onNavigateToLogin={() => setCurrentScreen('login')} 
        />
      )}

      {/* 3. DASHBOARD DO ALUNO */}
      {currentScreen === 'student_dashboard' && (
        <StudentDashboardScreen 
          userName={user.name} 
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onSelectCourse={(title) => {
            setSelectedCourseTitle(title);
            setCurrentScreen('lesson');
          }}
          onViewDetails={(title) => {
            setSelectedCourseTitle(title);
            setCurrentScreen('course_details');
          }}
        />
      )}

      {/* 4. PAINEL DO PROFESSOR */}
      {currentScreen === 'teacher_dashboard' && (
        <TeacherDashboardScreen 
          userName={user.name} 
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onCreateCourse={() => setCurrentScreen('create_course')}
          onManageCourse={(title) => {
            setSelectedCourseTitle(title);
            setCurrentScreen('manage_modules');
          }}
        />
      )}

      {/* 5. DETALHES DO CURSO */}
      {currentScreen === 'course_details' && (
        <CourseDetailsScreen 
          userName={user.name} 
          courseTitle={selectedCourseTitle}
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onStartCourse={() => setCurrentScreen('lesson')}
          onBack={() => setCurrentScreen('student_dashboard')}
        />
      )}

      {/* 6. PLAYER DE VÍDEO DA AULA */}
      {currentScreen === 'lesson' && (
        <LessonPlayerScreen 
          userName={user.name} 
          courseTitle={selectedCourseTitle}
          onNavigateToProfile={() => setCurrentScreen('profile')}
          onStartQuiz={() => setCurrentScreen('quiz')}
          onBackToDashboard={() => setCurrentScreen('student_dashboard')}
        />
      )}

      {/* 7. QUIZ */}
      {currentScreen === 'quiz' && (
        <QuizScreen 
          userName={user.name} 
          courseTitle={selectedCourseTitle}
          onFinish={() => setCurrentScreen('student_dashboard')}
        />
      )}

      {/* 8. MEU PERFIL */}
      {currentScreen === 'profile' && (
        <ProfileScreen 
          user={user} 
          onSave={(updatedUser) => {
            setUser(prev => ({ ...prev, ...updatedUser }));
            alert('Perfil atualizado com sucesso!');
            setCurrentScreen(user.role === 'teacher' ? 'teacher_dashboard' : 'student_dashboard');
          }}
          onLogout={handleLogout}
          onBack={() => setCurrentScreen(user.role === 'teacher' ? 'teacher_dashboard' : 'student_dashboard')}
        />
      )}

      {/* 9. CRIAR CURSO (PROFESSOR) */}
      {currentScreen === 'create_course' && (
        <CreateCourseScreen 
          onSaveAndContinue={() => setCurrentScreen('manage_modules')}
          onBack={() => setCurrentScreen('teacher_dashboard')}
        />
      )}

      {/* 10. GERENCIAR MÓDULOS (PROFESSOR) */}
      {currentScreen === 'manage_modules' && (
        <ManageModulesScreen 
          userName={user.name}
          courseTitle={selectedCourseTitle}
          onFinish={() => setCurrentScreen('teacher_dashboard')}
        />
      )}

    </div>
  );
}

// ==========================================
// COMPONENTES DAS TELAS
// ==========================================

function LoginScreen({ onLogin, onNavigateToRegister }: { onLogin: (email: string) => void; onNavigateToRegister: () => void; }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) onLogin(email);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#111827] mb-6">Acessar Plataforma</h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail</label>
            <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-600" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Senha</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-600" required />
          </div>
          <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 shadow-sm">Entrar</button>
        </form>
        <div className="mt-4 space-y-2">
          <button type="button" className="text-xs text-slate-600 hover:underline block mx-auto">Esqueci minha senha</button>
          <button type="button" onClick={onNavigateToRegister} className="text-xs text-blue-600 font-medium hover:underline block mx-auto">Ainda não tem conta? Cadastre-se</button>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onRegister, onNavigateToLogin }: { onRegister: (name: string, email: string, role: 'student' | 'teacher') => void; onNavigateToLogin: () => void; }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name && email) onRegister(name, email, role);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-lg text-center">
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="w-5 h-5 bg-[#2563EB] rounded"></div>
          <span className="font-bold text-sm text-[#111827]">PRISMA APRENDIZADO</span>
        </div>
        <h1 className="text-2xl font-bold text-[#111827] mb-1">Criar Conta</h1>
        <p className="text-xs text-slate-500 mb-6">Preencha os dados abaixo para começar</p>
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo</label>
            <input type="text" placeholder="Digite seu nome completo" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-600" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail</label>
            <input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-600" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Senha</label>
            <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-600" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2">Você é</label>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setRole('student')} className={`py-2.5 rounded-lg border text-xs font-medium transition ${role === 'student' ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-slate-200 text-slate-600'}`}>Sou Aluno</button>
              <button type="button" onClick={() => setRole('teacher')} className={`py-2.5 rounded-lg border text-xs font-medium transition ${role === 'teacher' ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-slate-200 text-slate-600'}`}>Sou Professor</button>
            </div>
          </div>
          <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 shadow-sm">Criar Minha Conta</button>
        </form>
        <div className="mt-4">
          <span className="text-xs text-slate-500">Já tem uma conta? </span>
          <button type="button" onClick={onNavigateToLogin} className="text-xs text-blue-600 font-medium hover:underline">Fazer Login</button>
        </div>
      </div>
    </div>
  );
}

function StudentDashboardScreen({ userName, onNavigateToProfile, onSelectCourse, onViewDetails }: { userName: string; onNavigateToProfile: () => void; onSelectCourse: (title: string) => void; onViewDetails: (title: string) => void; }) {
  // TODOS OS CURSOS ZERADOS (0% DE PROGRESSO)
  const courses: Course[] = [
    { id: '1', title: 'HTML5 e CSS3', description: 'Aprenda os fundamentos da web moderna com HTML semântico e CSS3 responsivo.', progress: 0 },
    { id: '2', title: 'JavaScript Avançado', description: 'Domine ES6+, async/await, closures e padrões de projeto em JavaScript.', progress: 0 },
    { id: '3', title: 'React.js', description: 'Construa interfaces modernas com componentes, hooks e gerenciamento de estado.', progress: 0 },
    { id: '4', title: 'UX/UI Design', description: 'Princípios de design centrado no usuário, prototipação e testes de usabilidade.', progress: 0 }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <Header userName={userName} onNavigateToProfile={onNavigateToProfile} />
      <main className="p-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-[#111827] mb-8">Meus Cursos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="bg-[#E2E8F0] h-32 w-full flex items-center justify-center cursor-pointer" onClick={() => onViewDetails(course.title)}>
                  <span className="text-slate-400 text-xs font-semibold">Ver ementa do curso</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-[#111827] text-base mb-2 cursor-pointer hover:text-blue-600 transition" onClick={() => onViewDetails(course.title)}>{course.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{course.description}</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button onClick={() => onSelectCourse(course.title)} className="w-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition mb-4">Acessar Curso</button>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 rounded-full h-2.5 overflow-hidden border border-slate-200">
                    {course.progress > 0 && <div className="bg-[#2563EB] h-full transition-all duration-300" style={{ width: `${course.progress}%` }} />}
                  </div>
                  <span className="text-xs font-bold text-slate-700">{course.progress}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function TeacherDashboardScreen({ userName, onNavigateToProfile, onCreateCourse, onManageCourse }: { userName: string; onNavigateToProfile: () => void; onCreateCourse: () => void; onManageCourse: (title: string) => void; }) {
  const teacherCourses = ['HTML5 e CSS3', 'JavaScript Avançado', 'React.js', 'UX/UI Design'];

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <Header userName={userName} onNavigateToProfile={onNavigateToProfile} subtitle="Página do professor" />
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold text-[#111827]">Meus Cursos</h1>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-[#2563EB] text-white px-4 py-2 rounded-xl text-xs font-bold">Total de Alunos | 120</div>
            <div className="bg-[#2563EB] text-white px-4 py-2 rounded-xl text-xs font-bold">Cursos Ativos | 4</div>
            <div className="bg-[#2563EB] text-white px-4 py-2 rounded-xl text-xs font-bold">Avaliação Média | 4.9 ★</div>
            <button onClick={onCreateCourse} className="bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition">+ Criar Novo Curso</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {teacherCourses.map((title, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="bg-[#E2E8F0] h-32 w-full"></div>
                <div className="p-5">
                  <h3 className="font-bold text-[#111827] text-base mb-2">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">Gestão de módulos, conteúdos e avaliações.</p>
                </div>
              </div>
              <div className="p-5 pt-0">
                <button onClick={() => onManageCourse(title)} className="w-full bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-medium py-2 rounded-lg transition">Gerenciar Módulos</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function CourseDetailsScreen({ userName, courseTitle, onNavigateToProfile, onStartCourse, onBack }: { userName: string; courseTitle: string; onNavigateToProfile: () => void; onStartCourse: () => void; onBack: () => void; }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <Header userName={userName} onNavigateToProfile={onNavigateToProfile} />
      <div className="bg-[#2563EB] text-white px-8 py-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{courseTitle}</h1>
            <p className="text-blue-100 text-sm">Aprenda a criar interfaces modernas e protótipos funcionais no Figma</p>
          </div>
          <button onClick={onBack} className="text-xs text-blue-200 hover:text-white underline">← Voltar</button>
        </div>
      </div>
      <main className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div>
            <h2 className="text-base font-bold text-[#111827] mb-3">O que você vai aprender:</h2>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>✓ Criação de Design Systems e protótipos de alta fidelidade.</li>
              <li>✓ Mapeamento da jornada do usuário (UX).</li>
              <li>✓ Preparação de projetos para o time de Front-end.</li>
            </ul>
          </div>
          <div>
            <h2 className="text-base font-bold text-[#111827] mb-3">Grade Curricular:</h2>
            <ul className="space-y-2 text-xs text-slate-600 list-disc list-inside">
              <li>Módulo 1: Introdução ao UX/UI</li>
              <li>Módulo 2: Dominando o Figma</li>
              <li>Módulo 3: Projeto Prático LMS</li>
            </ul>
          </div>
        </div>
        <div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="bg-black h-40 rounded-xl w-full flex items-center justify-center text-white text-xs">Prévia do Vídeo</div>
            <div className="font-bold text-lg text-[#111827]">GRATUITO</div>
            <button onClick={onStartCourse} className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs uppercase transition shadow-sm">Matricular-se Agora</button>
          </div>
        </div>
      </main>
    </div>
  );
}

function LessonPlayerScreen({ userName, courseTitle, onNavigateToProfile, onStartQuiz, onBackToDashboard }: { userName: string; courseTitle: string; onNavigateToProfile: () => void; onStartQuiz: () => void; onBackToDashboard: () => void; }) {
  return (
    <div className="min-h-screen bg-[#0B132B] text-white">
      <Header userName={userName} onNavigateToProfile={onNavigateToProfile} />
      <main className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{courseTitle} — AULA 01</h1>
          <button onClick={onBackToDashboard} className="text-xs text-slate-400 hover:text-white transition">← Voltar para Meus Cursos</button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-black rounded-2xl h-96 w-full border border-slate-800 flex items-center justify-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button onClick={onStartQuiz} className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition">Ir para o Quiz da Aula</button>
            </div>
          </div>
          <div className="bg-white text-slate-800 p-6 rounded-2xl space-y-4 shadow-lg self-start">
            <div className="p-3 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg font-bold text-xs">Aula 01: Introdução ao Curso (Ativa)</div>
            <div className="p-3 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-600 cursor-pointer">Aula 02: Configuração de Ambiente</div>
            <div className="p-3 hover:bg-slate-50 rounded-lg text-xs font-medium text-slate-600 cursor-pointer">Aula 03: Primeiros Passos</div>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuizScreen({ userName, courseTitle, onFinish }: { userName: string; courseTitle: string; onFinish: () => void; }) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#0B132B] text-white">
      <Header userName={userName} onNavigateToProfile={() => {}} />
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Quiz: {courseTitle}</h1>
        <div className="bg-white text-slate-800 rounded-2xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-[#111827]">1. Qual a principal função de um Design System no Figma?</h2>
          <div className="space-y-3">
            {[
              { id: 'A', text: 'Garantir consistência visual e reuso de componentes.' },
              { id: 'B', text: 'Compilar código JavaScript automaticamente.' },
              { id: 'C', text: 'Gerenciar banco de dados PostgreSQL.' },
              { id: 'D', text: 'Executar testes automatizados no navegador.' }
            ].map((opt) => (
              <button key={opt.id} onClick={() => setSelectedOption(opt.id)} className={`w-full text-left p-4 rounded-xl border text-xs font-medium flex items-center gap-3 transition ${selectedOption === opt.id ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold' : 'border-slate-200 hover:bg-slate-50 text-slate-700'}`}>
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs">{opt.id}</span>
                {opt.text}
              </button>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <button onClick={() => alert('Resposta registrada!')} className="bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition">Próxima questão</button>
          </div>
        </div>
        <div className="flex justify-end mt-8">
          <button onClick={onFinish} className="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-xl text-xs hover:bg-slate-100 transition shadow-lg">Finalizar quiz</button>
        </div>
      </main>
    </div>
  );
}

function ProfileScreen({ user, onSave, onLogout, onBack }: { user: { name: string; email: string; bio: string }; onSave: (updated: { name: string; email: string; bio: string }) => void; onLogout: () => void; onBack: () => void; }) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState(user.bio);

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <div className="bg-white border-b border-slate-100 px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-sm">{name.charAt(0).toUpperCase()}</div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">{name}</span>
        </div>
        <button onClick={onBack} className="text-xs text-blue-600 font-bold hover:underline">← Voltar para Painel</button>
      </div>

      <main className="p-8 max-w-2xl mx-auto">
        <h1 className="text-center font-bold text-xl text-[#111827] mb-8">MEU PERFIL</h1>
        <form onSubmit={(e) => { e.preventDefault(); onSave({ name, email, bio }); }} className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
          <button type="button" className="text-xs text-blue-600 font-bold hover:underline block">Alterar foto</button>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nome Completo</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm" required />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Biografia</label>
            <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm" />
          </div>
          <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs uppercase shadow-sm">Salvar Alterações</button>
          <button type="button" onClick={onLogout} className="w-full border border-red-200 text-red-600 hover:bg-red-50 font-bold py-3 rounded-xl text-xs uppercase transition">Sair da Conta</button>
        </form>
      </main>
    </div>
  );
}

function CreateCourseScreen({ onSaveAndContinue, onBack }: { onSaveAndContinue: () => void; onBack: () => void; }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9] p-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <span className="font-bold text-sm text-[#111827]">PRISMA APRENDIZADO</span>
        <button onClick={onBack} className="text-xs text-slate-500 hover:text-slate-800">← Cancelar</button>
      </div>
      <h1 className="text-center text-xl font-bold text-[#111827] mb-8">Criar Novo Curso</h1>
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Título do curso</label>
          <input type="text" placeholder="Digite o título do curso" className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Categoria</label>
          <input type="text" placeholder="Programação..." className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Descrição do Curso</label>
          <textarea placeholder="O curso..." rows={3} className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm" />
        </div>
        <button onClick={onSaveAndContinue} className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs uppercase shadow-sm">Salvar e Continuar</button>
      </div>
    </div>
  );
}

function ManageModulesScreen({ userName, courseTitle, onFinish }: { userName: string; courseTitle: string; onFinish: () => void; }) {
  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <Header userName={userName} onNavigateToProfile={() => {}} />
      <main className="p-8 max-w-4xl mx-auto space-y-6">
        <h1 className="text-xl font-bold text-slate-800">Gerenciar: {courseTitle}</h1>
        <button className="w-full bg-[#2563EB] text-white font-bold py-3.5 rounded-xl text-sm uppercase tracking-wider shadow-sm">Adicionar Módulos</button>
        <div className="space-y-4">
          {['O que você vai aprender:', 'Grade Curricular:', 'Adicionar quiz', 'Materias complementares'].map((item, idx) => (
            <button key={idx} className="w-full bg-[#2563EB] text-white font-bold py-3 px-6 rounded-xl text-xs flex items-center justify-between shadow-sm hover:bg-blue-700 transition">
              <span>{item}</span>
              <span>+</span>
            </button>
          ))}
        </div>
        <div className="flex justify-end pt-8">
          <button onClick={onFinish} className="bg-[#2563EB] hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl text-sm shadow-md transition">Concluir e Salvar</button>
        </div>
      </main>
    </div>
  );
}

function Header({ userName, onNavigateToProfile, subtitle }: { userName: string; onNavigateToProfile: () => void; subtitle?: string; }) {
  return (
    <header className="bg-white border-b border-slate-100 px-8 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-[#2563EB] rounded-md"></div>
        <span className="font-bold tracking-wide text-sm text-[#111827]">PRISMA APRENDIZADO</span>
      </div>
      {subtitle && <span className="font-bold text-sm text-slate-800">{subtitle}</span>}
      <button onClick={onNavigateToProfile} className="flex items-center gap-2 hover:opacity-80 transition">
        <span className="text-xs font-semibold text-slate-700">Meu perfil</span>
        <div className="w-7 h-7 rounded-full bg-blue-300 flex items-center justify-center text-xs font-bold text-blue-900">{userName.charAt(0).toUpperCase()}</div>
      </button>
    </header>
  );
}