import { useState, FormEvent } from 'react';

interface LoginProps {
  onLogin: (email: string) => void;
  onNavigateToRegister: () => void;
}

export const Login = ({ onLogin, onNavigateToRegister }: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-[#111827] mb-6">Acessar Plataforma</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-600 transition"
              required
            />  
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-blue-600 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition mt-2 shadow-sm"
          >
            Entrar
          </button>
        </form>

        <div className="mt-4 space-y-2">
          <button type="button" className="text-xs text-slate-600 hover:underline block mx-auto">
            Esqueci minha senha
          </button>
          <button 
            type="button"
            onClick={onNavigateToRegister} 
            className="text-xs text-blue-600 font-medium hover:underline block mx-auto"
          >
            Ainda não tem conta? Cadastre-se
          </button>
        </div>
      </div>
    </div>
  );
};