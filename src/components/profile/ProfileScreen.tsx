import { useState } from 'react';

interface ProfileScreenProps {
  user: {
    name: string;
    email: string;
    role: 'student' | 'teacher' | 'admin';
    bio: string;
  };
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onSave: (name: string, bio: string) => void;
  onBack: () => void;
}

export function ProfileScreen({
  user,
  theme = 'dark',
  onToggleTheme,
  onSave,
  onBack,
}: ProfileScreenProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);

  const handleSave = () => {
    onSave(name, bio);
    alert('Perfil atualizado com sucesso!');
  };

  // Classes dinâmicas baseadas no tema selecionado
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0b0e13] text-white' : 'bg-gray-50 text-gray-900';
  const bgCard = isDark ? 'bg-[#212127] border-gray-800' : 'bg-white border-gray-200 shadow-xl';
  const inputBg = isDark ? 'bg-[#0b0e13] border-gray-700 text-white' : 'bg-gray-100 border-gray-300 text-gray-900';
  const labelColor = isDark ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${bgMain}`}>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 font-medium transition"
        >
          ← Voltar
        </button>

        <div className={`rounded-2xl p-8 border ${bgCard} transition-colors duration-200`}>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Meu Perfil</h1>

            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition shadow-md flex items-center gap-2 ${
                  isDark
                    ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-gray-700'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
              </button>
            )}
          </div>

          <div className="space-y-5">
            <div>
              <label className={`block mb-2 font-medium text-sm ${labelColor}`}>
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-blue-500 transition ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium text-sm ${labelColor}`}>
                Email
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className={`w-full px-4 py-3 rounded-xl border opacity-75 cursor-not-allowed ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium text-sm ${labelColor}`}>
                Tipo de usuário
              </label>
              <input
                type="text"
                value={
                  user.role === 'teacher'
                    ? 'Professor'
                    : user.role === 'admin'
                    ? 'Administrador'
                    : 'Aluno'
                }
                disabled
                className={`w-full px-4 py-3 rounded-xl border opacity-75 cursor-not-allowed ${inputBg}`}
              />
            </div>

            <div>
              <label className={`block mb-2 font-medium text-sm ${labelColor}`}>
                Biografia
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-blue-500 transition resize-none ${inputBg}`}
              />
            </div>

            <div className="pt-4">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}