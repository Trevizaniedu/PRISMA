interface ManageModulesScreenProps {
  onBack: () => void;
}

export function ManageModulesScreen({
  onBack,
}: ManageModulesScreenProps) {
  const modules = [
    'Módulo 1 — Introdução',
    'Módulo 2 — Fundamentos',
    'Módulo 3 — Prática',
  ];

  return (
    <div className="min-h-screen bg-[#0b0e13] text-white">
      <main className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6"
        >
          ← Voltar
        </button>

        <div className="bg-[#212127] rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">
              Gerenciar módulos
            </h1>

            <button
              onClick={() => alert('Módulo criado!')}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
            >
              Novo módulo
            </button>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <div
                key={module}
                className="bg-[#0b0e13] border border-gray-800 rounded-lg p-5 flex items-center justify-between"
              >
                <span>{module}</span>

                <button
                  onClick={() => alert(`Editando ${module}`)}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Editar
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}