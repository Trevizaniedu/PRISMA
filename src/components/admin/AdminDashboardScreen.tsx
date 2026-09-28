import { useState } from 'react';

interface AdminDashboardScreenProps {
  userName: string;
  onNavigateToProfile: () => void;
  onLogout: () => void;
}

export function AdminDashboardScreen({
  userName,
  onNavigateToProfile,
  onLogout,
}: AdminDashboardScreenProps) {
  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <header className="bg-[#212127] border-b border-gray-800 px-8 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">PRISMA APRENDIZADO - Admin</h1>
        <div className="flex items-center gap-6">
          <button onClick={onNavigateToProfile} className="text-sm text-gray-300 hover:text-white">
            Meu perfil ({userName || 'Admin'})
          </button>
          <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-10">
        <h2 className="text-3xl font-bold mb-8">GERENCIAR</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg">
            <p className="text-sm font-medium opacity-90">Total de Usuários</p>
            <p className="text-2xl font-bold mt-1">1.240</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg">
            <p className="text-sm font-medium opacity-90">Cursos Aprovados</p>
            <p className="text-2xl font-bold mt-1">38</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-2xl shadow-lg">
            <p className="text-sm font-medium opacity-90">Suporte</p>
            <p className="text-2xl font-bold mt-1">2</p>
          </div>
        </div>
      </main>
    </div>
  );
}