import { useState } from 'react';

import { supabase } from './lib/supabase';

import { LoginScreen } from './components/auth/LoginScreen';
import { RegisterScreen } from './components/auth/RegisterScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';

import { AdminDashboardScreen } from './components/admin/AdminDashboardScreen';
import { StudentDashboardScreen } from './components/student/StudentDashboardScreen';
import { CourseDetailsScreen } from './components/student/CourseDetailsScreen';
import { LessonPlayerScreen } from './components/student/LessonPlayerScreen';
import { QuizScreen } from './components/student/QuizScreen';

import { TeacherDashboardScreen } from './components/teacher/TeacherDashboardScreen';
import { CreateCourseScreen } from './components/teacher/CreateCourseScreen';
import { ManageModulesScreen } from './components/teacher/ManageModulesScreen';

import { ProfileScreen } from './components/profile/ProfileScreen';
import { ManageLessonsScreen } from './components/teacher/ManageLessonsScreen';

type UserRole = 'student' | 'teacher' | 'admin';

type ScreenType =
  | 'login'
  | 'register'
  | 'recover_password'
  | 'student_dashboard'
  | 'teacher_dashboard'
  | 'admin_dashboard'
  | 'course_details'
  | 'lesson'
  | 'profile'
  | 'create_course'
  | 'manage_modules'
  | 'quiz'
  | 'manage_lessons';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bio: string;
}

function App() {
  const [currentScreen, setCurrentScreen] =
    useState<ScreenType>('login');

  const [theme, setTheme] =
    useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme((prev) =>
      prev === 'dark' ? 'light' : 'dark'
    );
  };

  const [user, setUser] = useState<User>({
    id: '',
    name: 'Administrador Teste',
    email: 'admin@prisma.com',
    role: 'admin',
    bio: 'Desenvolvedor em formação apaixonado por tecnologia e design.',
  });

  const [selectedCourseId, setSelectedCourseId] =
    useState('');

  const [selectedCourseTitle, setSelectedCourseTitle] =
    useState('UX/UI Design');

  const [selectedModuleId, setSelectedModuleId] =
    useState('');

  const [selectedModuleTitle, setSelectedModuleTitle] =
    useState('');

  const [selectedLessonId, setSelectedLessonId] =
    useState('');

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
      profile.role === 'professor'
        ? 'teacher'
        : profile.role === 'admin'
          ? 'admin'
          : 'student';

    setUser({
      id: data.user.id,
      name: profile.nome,
      email: profile.email,
      role,
      bio: 'Desenvolvedor em formação apaixonado por tecnologia e design.',
    });

    if (role === 'admin') {
      setCurrentScreen('admin_dashboard');
    } else if (role === 'teacher') {
      setCurrentScreen('teacher_dashboard');
    } else {
      setCurrentScreen('student_dashboard');
    }
  };

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
      id: data.user.id,
      name,
      email,
      role,
      bio: 'Desenvolvedor em formação apaixonado por tecnologia e design.',
    });

    if (role === 'admin') {
      setCurrentScreen('admin_dashboard');
    } else if (role === 'teacher') {
      setCurrentScreen('teacher_dashboard');
    } else {
      setCurrentScreen('student_dashboard');
    }
  };

  const handleLogout = async () => {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      alert(`Erro ao sair: ${error.message}`);
      return;
    }

    setUser({
      id: '',
      name: '',
      email: '',
      role: 'student',
      bio: '',
    });

    setSelectedCourseId('');
    setSelectedCourseTitle('');
    setSelectedModuleId('');
    setSelectedModuleTitle('');
    setSelectedLessonId('');

    setCurrentScreen('login');
  };

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

  const handleSelectCourse = (
    courseId: string,
    courseTitle: string
  ) => {
    setSelectedCourseId(courseId);
    setSelectedCourseTitle(courseTitle);
    setCurrentScreen('course_details');
  };

  const handleManageModules = (
    courseId: string,
    courseTitle: string
  ) => {
    setSelectedCourseId(courseId);
    setSelectedCourseTitle(courseTitle);
    setCurrentScreen('manage_modules');
  };

  const handleManageLessons = (
    moduleId: string,
    moduleTitle: string
  ) => {
    setSelectedModuleId(moduleId);
    setSelectedModuleTitle(moduleTitle);
    setCurrentScreen('manage_lessons');
  };

  if (currentScreen === 'login') {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onNavigateToRegister={() =>
          setCurrentScreen('register')
        }
        onNavigateToForgotPassword={() =>
          setCurrentScreen('recover_password')
        }
      />
    );
  }

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

  if (currentScreen === 'recover_password') {
    return (
      <ForgotPasswordScreen
        onNavigateToLogin={() =>
          setCurrentScreen('login')
        }
      />
    );
  }

  if (currentScreen === 'admin_dashboard') {
    return (
      <AdminDashboardScreen
        userName={user.name}
        onNavigateToProfile={() =>
          setCurrentScreen('profile')
        }
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'student_dashboard') {
    return (
      <StudentDashboardScreen
        userName={user.name}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSelectCourse={handleSelectCourse}
        onNavigateToProfile={() =>
          setCurrentScreen('profile')
        }
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'course_details') {
    return (
      <CourseDetailsScreen
        courseId={selectedCourseId}
        courseTitle={selectedCourseTitle}
        onBack={() =>
          setCurrentScreen('student_dashboard')
        }
        onStartLesson={(moduleId) => {
          setSelectedModuleId(moduleId);
          setCurrentScreen('lesson');
        }}
      />
    );
  }

  if (currentScreen === 'lesson') {
    return (
      <LessonPlayerScreen
        courseTitle={selectedCourseTitle}
        moduleId={selectedModuleId}
        theme={theme}
        onBack={() =>
          setCurrentScreen('course_details')
        }
        onQuiz={() =>
          setCurrentScreen('quiz')
        }
      />
    );
  }

  if (currentScreen === 'quiz') {
    return (
      <QuizScreen
        courseTitle={selectedCourseTitle}
        onBack={() =>
          setCurrentScreen('lesson')
        }
      />
    );
  }

  if (currentScreen === 'teacher_dashboard') {
    return (
      <TeacherDashboardScreen
        userName={user.name}
        userId={user.id}
        onCreateCourse={() =>
          setCurrentScreen('create_course')
        }
        onManageModules={handleManageModules}
        onNavigateToProfile={() =>
          setCurrentScreen('profile')
        }
        onLogout={handleLogout}
      />
    );
  }

  if (currentScreen === 'create_course') {
    return (
      <CreateCourseScreen
        userId={user.id}
        onBack={() =>
          setCurrentScreen('teacher_dashboard')
        }
      />
    );
  }

  if (currentScreen === 'manage_modules') {
    return (
      <ManageModulesScreen
        courseId={selectedCourseId}
        courseTitle={selectedCourseTitle}
        onManageLessons={handleManageLessons}
        onBack={() =>
          setCurrentScreen('teacher_dashboard')
        }
      />
    );
  }

  if (currentScreen === 'manage_lessons') {
    return (
      <ManageLessonsScreen
        moduleId={selectedModuleId}
        moduleTitle={selectedModuleTitle}
        onBack={() =>
          setCurrentScreen('manage_modules')
        }
      />
    );
  }

  if (currentScreen === 'profile') {
    return (
      <ProfileScreen
        user={user}
        theme={theme}
        onToggleTheme={toggleTheme}
        onSave={handleSaveProfile}
        onBack={() => {
          if (user.role === 'teacher') {
            setCurrentScreen('teacher_dashboard');
          } else if (user.role === 'admin') {
            setCurrentScreen('admin_dashboard');
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