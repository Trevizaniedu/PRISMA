import { useState } from 'react';

interface ManageModulesScreenProps {
  courseTitle?: string;
  onBack: () => void;
}

export function ManageModulesScreen({
  courseTitle = 'Curso de Desenvolvimento',
  onBack,
}: ManageModulesScreenProps) {
  const [modules, setModules] = useState([
    'Módulo 1 — Início e Visão Geral',
    'Módulo 2 — Fundamentos Teóricos',
    'Módulo 3 — Prática Aplicada',
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');

  const handleAddModule = () => {
    if (!newModuleTitle.trim()) {
      alert('Digite o nome do módulo.');
      return;
    }

    setModules([...modules, newModuleTitle]);
    setNewModuleTitle('');
    setIsAdding(false);
  };

  const handleDeleteModule = (moduleName: string) => {
    if (confirm(`Deseja realmente excluir o "${moduleName}"?`)) {
      setModules(modules.filter((m) => m !== moduleName));
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 transition"
        >
          ← Voltar aos cursos
        </button>

        <div className="bg-[#212127] rounded-2xl p-8 border border-gray-800 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-gray-400 text-sm">Gerenciando Módulos</p>
              <h1 className="text-3xl font-bold">{courseTitle}</h1>
            </div>

            <button
              onClick={() => setIsAdding(!isAdding)}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-semibold transition shadow-lg flex items-center gap-2"
            >
              {isAdding ? 'Cancelar' : '+ Novo módulo'}
            </button>
          </div>

          {isAdding && (
            <div className="mb-6 p-5 bg-[#1b1b22] border border-gray-800 rounded-xl space-y-4">
              <h3 className="font-semibold text-lg">Adicionar Novo Módulo</h3>
              <input
                type="text"
                value={newModuleTitle}
                onChange={(e) => setNewModuleTitle(e.target.value)}
                placeholder="Ex: Módulo 4 — Exercícios Práticos"
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-gray-700 text-white focus:border-blue-500 focus:outline-none transition"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-sm font-semibold transition"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddModule}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold transition"
                >
                  Salvar Módulo
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {modules.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Nenhum módulo cadastrado neste curso.</p>
            ) : (
              modules.map((module) => (
                <div
                  key={module}
                  className="bg-[#0b0e13] border border-gray-800 rounded-xl p-5 flex items-center justify-between gap-4 shadow-inner"
                >
                  <span className="font-medium text-gray-200">{module}</span>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => alert(`Editando ${module}`)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module)}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold transition"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}