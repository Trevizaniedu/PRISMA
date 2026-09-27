import { useState, type FormEvent } from 'react';

type UserRole = 'student' | 'teacher';

interface RegisterScreenProps {
  onRegister: (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => Promise<void>;

  onNavigateToLogin: () => void;
}

export function RegisterScreen({
  onRegister,
  onNavigateToLogin,
}: RegisterScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert('Preencha todos os campos.');
      return;
    }

    await onRegister(name, email, password, role);
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            PRISMA
          </h1>

          <p className="text-gray-400">
            Crie sua conta
          </p>
        </div>

        <div className="bg-[#212127] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Cadastro
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Nome
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Senha
              </label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Crie uma senha"
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Tipo de usuário
              </label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as UserRole)
                }
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white outline-none"
              >
                <option value="student">Aluno</option>
                <option value="teacher">Professor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
            >
              Criar conta
            </button>
          </form>

          <button
            onClick={onNavigateToLogin}
            className="w-full mt-6 text-blue-400 hover:text-blue-300"
          >
            Já tenho uma conta
          </button>
        </div>
      </div>
    </div>
  );
}