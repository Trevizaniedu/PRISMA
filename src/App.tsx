import { useState } from 'react';

import { supabase } from './lib/supabase';

import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';

import { StudentDashboardScreen } from './components/student/StudentDashboardScreen';
import { CourseDetailsScreen } from './components/student/CourseDetailsScreen';
import { LessonPlayerScreen } from './components/student/LessonPlayerScreen';
import { QuizScreen } from './components/student/QuizScreen';

import { TeacherDashboardScreen } from './components/teacher/TeacherDashboardScreen';
import { CreateCourseScreen } from './components/teacher/CreateCourseScreen';
import { ManageModulesScreen } from './components/teacher/ManageModulesScreen';

import { ProfileScreen } from './components/profile/ProfileScreen';

type UserRole = 'student' | 'teacher';

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

interface User {
  name: string;
  email: string;
  role: UserRole;
  bio: string;
}

function App() {
  const [currentScreen, setCurrentScreen] =
    useState<ScreenType>('login');

  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    role: 'student',
    bio: 'Desenvolvedor em formação apaixonado por tecnologia e design.',
  });

  const [selectedCourseTitle, setSelectedCourseTitle] =
    useState('UX/UI Design');

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = async (
    email: string,
    password: string
  ) => {
    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      alert(`Erro ao fazer login: ${error.message}`);
      return;
    }

    if (!data.user) {
      alert('Usuário não encontrado.');
      return;
    }

    const { data: profile, error: profileError } =
      await supabase
        .from('profiles')
        .select('nome, email, role')
        .eq('id', data.user.id)
        .single();

    if (profileError) {
      alert(
        `Usuário autenticado, mas o perfil não foi encontrado: ${profileError.message}`
      );
      return;
    }

    const role: UserRole =
      profile.role === 'teacher'
        ? 'teacher'
        : 'student';

    setUser({
      name: profile.nome,
      email: profile.email,
      role,
      bio: 'Desenvolvedor em formação apaixonado por tecnologia e design.',
    });

    if (role === 'teacher') {
      setCurrentScreen('teacher_dashboard');
    } else {
      setCurrentScreen('student_dashboard');
    }
  };

  // ==========================================
  // CADASTRO
  // ==========================================

  const handleRegister = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
) => {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nome: name,
          role: role,
        },
      },
    });

  if (error) {
    alert(`Erro ao criar conta: ${error.message}`);
    return;
  }

  if (!data.user) {
    alert('Não foi possível criar o usuário.');
    return;
  }

  setUser({
    name,
    email,
    role,
    bio: 'Desenvolvedor em formação apaixonado por tecnologia e design.',
  });

  if (role === 'teacher') {
    setCurrentScreen('teacher_dashboard');
  } else {
    setCurrentScreen('student_dashboard');
  }
};
  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      alert(`Erro ao sair: ${error.message}`);
      return;
    }

    setUser({
      name: '',
      email: '',
      role: 'student',
      bio: '',
    });

    setCurrentScreen('login');
  };

  // ==========================================
  // PERFIL
  // ==========================================

  const handleSaveProfile = (
    name: string,
    bio: string
  ) => {
    setUser((previousUser) => ({
      ...previousUser,
      name,
      bio,
    }));
  };

  // ==========================================
  // NAVEGAÇÃO
  // ==========================================

  const handleSelectCourse = (
    courseTitle: string
  ) => {
    setSelectedCourseTitle(courseTitle);
    setCurrentScreen('course_details');
  };

  // ==========================================
  // LOGIN
  // ==========================================

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onNavigateToRegister={() =>
          setCurrentScreen('register')
        }
      />
    );
  }

  // ==========================================
  // CADASTRO
  // ==========================================

  if (currentScreen === 'register') {
    return (
      <RegisterScreen
        onRegister={handleRegister}
        onNavigateToLogin={() =>
          setCurrentScreen('login')
        }
      />
    );
  }

  // ==========================================
  // DASHBOARD DO ALUNO
  // ==========================================

  if (currentScreen === 'student_dashboard') {
    return (
      <StudentDashboardScreen
        userName={user.name}
        onSelectCourse={handleSelectCourse}
        onNavigateToProfile={() =>
          setCurrentScreen('profile')
        }
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // DETALHES DO CURSO
  // ==========================================

  if (currentScreen === 'course_details') {
    return (
      <CourseDetailsScreen
        courseTitle={selectedCourseTitle}
        onBack={() =>
          setCurrentScreen('student_dashboard')
        }
        onStartLesson={() =>
          setCurrentScreen('lesson')
        }
      />
    );
  }

  // ==========================================
  // AULA
  // ==========================================

  if (currentScreen === 'lesson') {
    return (
      <LessonPlayerScreen
        courseTitle={selectedCourseTitle}
        onBack={() =>
          setCurrentScreen('course_details')
        }
        onQuiz={() =>
          setCurrentScreen('quiz')
        }
      />
    );
  }

  // ==========================================
  // QUIZ
  // ==========================================

  if (currentScreen === 'quiz') {
    return (
      <QuizScreen
        onBack={() =>
          setCurrentScreen('lesson')
        }
      />
    );
  }

  // ==========================================
  // DASHBOARD DO PROFESSOR
  // ==========================================

  if (currentScreen === 'teacher_dashboard') {
    return (
      <TeacherDashboardScreen
        userName={user.name}
        onCreateCourse={() =>
          setCurrentScreen('create_course')
        }
        onManageModules={() =>
          setCurrentScreen('manage_modules')
        }
        onNavigateToProfile={() =>
          setCurrentScreen('profile')
        }
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // CRIAR CURSO
  // ==========================================

  if (currentScreen === 'create_course') {
    return (
      <CreateCourseScreen
        onBack={() =>
          setCurrentScreen('teacher_dashboard')
        }
      />
    );
  }

  // ==========================================
  // GERENCIAR MÓDULOS
  // ==========================================

  if (currentScreen === 'manage_modules') {
    return (
      <ManageModulesScreen
        onBack={() =>
          setCurrentScreen('teacher_dashboard')
        }
      />
    );
  }

  // ==========================================
  // PERFIL
  // ==========================================

  if (currentScreen === 'profile') {
    return (
      <ProfileScreen
        user={user}
        onSave={handleSaveProfile}
        onBack={() => {
          if (user.role === 'teacher') {
            setCurrentScreen('teacher_dashboard');
          } else {
            setCurrentScreen('student_dashboard');
          }
        }}
      />
    );
  }

  return null;
}

export default App;