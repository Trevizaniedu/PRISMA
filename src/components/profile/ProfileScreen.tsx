import { useState } from 'react';

interface ProfileScreenProps {
  user: {
    name: string;
    email: string;
    role: 'student' | 'teacher';
    bio: string;
  };

  onSave: (name: string, bio: string) => void;
  onBack: () => void;
}

export function ProfileScreen({
  user,
  onSave,
  onBack,
}: ProfileScreenProps) {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);

  const handleSave = () => {
    onSave(name, bio);
    alert('Perfil atualizado!');
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Voltar
        </button>

        <div className="bg-[#212127] rounded-2xl p-8">
          <h1 className="text-3xl font-bold mb-8">
            Meu perfil
          </h1>

          <div className="space-y-5">
            <div>
              <label className="block text-gray-300 mb-2">
                Nome
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Tipo de usuário
              </label>

              <input
                type="text"
                value={
                  user.role === 'teacher'
                    ? 'Professor'
                    : 'Aluno'
                }
                disabled
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-gray-500"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Biografia
              </label>

              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 rounded-lg bg-[#0b0e13] border border-gray-700 text-white"
              />
            </div>

            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
            >
              Salvar alterações
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}