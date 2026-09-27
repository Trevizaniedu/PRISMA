import { useState } from 'react';

interface QuizScreenProps {
  onBack: () => void;
}

export function QuizScreen({
  onBack,
}: QuizScreenProps) {
  const [selectedOption, setSelectedOption] =
    useState<string>('');

  const options = [
    'HyperText Markup Language',
    'HighText Machine Language',
    'HyperTool Multi Language',
    'Home Tool Markup Language',
  ];

  const handleFinish = () => {
    if (!selectedOption) {
      alert('Selecione uma resposta.');
      return;
    }

    alert('Quiz finalizado!');
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
            Quiz
          </h1>

          <h2 className="text-xl font-semibold mb-6">
            O que significa HTML?
          </h2>

          <div className="space-y-3">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedOption(option)}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  selectedOption === option
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-700 bg-[#0b0e13]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <button
            onClick={handleFinish}
            className="mt-8 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
          >
            Finalizar quiz
          </button>
        </div>
      </main>
    </div>
  );
}