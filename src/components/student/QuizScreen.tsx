import { useState, useEffect } from 'react';

interface QuizScreenProps {
  courseTitle?: string;
  theme?: 'dark' | 'light';
  onBack: () => void;
  onNextModule?: () => void;
}

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

export function QuizScreen({
  courseTitle = 'JavaScript',
  theme = 'dark',
  onBack,
  onNextModule,
}: QuizScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  // Reseta o estado do quiz sempre que o curso selecionado mudar
  useEffect(() => {
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setIsSubmitted(false);
    setScore(0);
    setShowSummary(false);
  }, [courseTitle]);

  // Retorna um array de perguntas específicas com base no curso selecionado
  const getQuizzesForCourse = (title: string): Question[] => {
    const t = title.toLowerCase();

    if (t.includes('html') || t.includes('css')) {
      return [
        {
          question: 'O que significa a sigla HTML?',
          options: [
            'HyperText Markup Language',
            'HighText Machine Language',
            'HyperTool Multi Language',
            'Home Tool Markup Language',
          ],
          correctAnswer: 'HyperText Markup Language',
        },
        {
          question: 'Qual tag HTML é utilizada para inserir uma imagem?',
          options: ['<img>', '<image>', '<src>', '<pic>'],
          correctAnswer: '<img>',
        },
        {
          question: 'Em CSS, qual propriedade define a cor do texto de um elemento?',
          options: ['text-color', 'font-color', 'color', 'background-color'],
          correctAnswer: 'color',
        },
      ];
    } else if (t.includes('react')) {
      return [
        {
          question: 'Qual é o principal conceito por trás da biblioteca React.js?',
          options: [
            'Manipulação direta e manual do DOM',
            'Arquitetura baseada em Componentes reativos',
            'Compilação exclusiva para servidores C++',
            'Estilização avançada com tabelas CSS',
          ],
          correctAnswer: 'Arquitetura baseada em Componentes reativos',
        },
        {
          question: 'Qual hook é utilizado para gerir estados em componentes funcionais?',
          options: ['useEffect', 'useState', 'useContext', 'useRef'],
          correctAnswer: 'useState',
        },
        {
          question: 'Como chamamos a sintaxe que permite escrever HTML dentro do JavaScript no React?',
          options: ['HTML-JS', 'JSX', 'Vite', 'NodeJS'],
          correctAnswer: 'JSX',
        },
      ];
    } else if (t.includes('ux') || t.includes('design')) {
      return [
        {
          question: 'Qual é o principal objetivo da fase de Pesquisa (User Research) em UX?',
          options: [
            'Definir as cores finais e logótipo da marca',
            'Compreender as necessidades, dores e comportamentos dos utilizadores',
            'Escrever o código fonte em React',
            'Configurar servidores de banco de dados',
          ],
          correctAnswer: 'Compreender as necessidades, dores e comportamentos dos utilizadores',
        },
        {
          question: 'O que significa a sigla UI?',
          options: ['User Interaction', 'User Interface', 'Unified Integration', 'Useful Information'],
          correctAnswer: 'User Interface',
        },
        {
          question: 'Qual ferramenta é amplamente utilizada para criar protótipos interativos e wireframes?',
          options: ['Figma', 'Photoshop', 'Notepad++', 'Docker'],
          correctAnswer: 'Figma',
        },
      ];
    } else {
      // JavaScript / Padrão
      return [
        {
          question: 'Como declaramos uma variável de escopo de bloco que não pode ser reatribuída em JavaScript moderno?',
          options: ['var', 'let', 'const', 'static'],
          correctAnswer: 'const',
        },
        {
          question: 'Qual método de array é usado para adicionar um elemento ao final do array?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correctAnswer: 'push()',
        },
        {
          question: 'O que o método Array.prototype.map() retorna?',
          options: [
            'Um único valor acumulado',
            'Um novo array transformado com base no retorno da função',
            'Um booleano indicando se encontrou o item',
            'O array original modificado',
          ],
          correctAnswer: 'Um novo array transformado com base no retorno da função',
        },
      ];
    }
  };

  const questions = getQuizzesForCourse(courseTitle);
  const currentQuiz = questions[currentQuestionIndex];
  const isCorrect = selectedOption === currentQuiz.correctAnswer;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleFinish = () => {
    if (!selectedOption) {
      alert('Selecione uma resposta antes de finalizar.');
      return;
    }

    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    setIsSubmitted(true);
  };

  const handleNextStep = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption('');
      setIsSubmitted(false);
    } else {
      // Chegou ao fim das perguntas, mostra o resumo de acertos
      setShowSummary(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setIsSubmitted(false);
    setScore(0);
    setShowSummary(false);
  };

  // Tratamento de temas (Dark / Light)
  const isDark = theme === 'dark';
  const bgMain = isDark ? 'bg-[#0b0e13] text-white' : 'bg-gray-50 text-gray-900';
  const cardBg = isDark ? 'bg-[#212127] border-gray-800' : 'bg-white border-gray-200 shadow-xl';
  const optionDefault = isDark 
    ? 'border-gray-700 bg-[#0b0e13] text-gray-300 hover:bg-gray-800' 
    : 'border-gray-300 bg-gray-50 text-gray-800 hover:bg-gray-100';

  return (
    <div className={`min-h-screen transition-colors duration-200 ${bgMain}`}>
      <main className="max-w-3xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-1 font-medium transition"
        >
          ← Voltar à aula
        </button>

        <div className={`rounded-2xl p-8 border ${cardBg} transition-colors duration-200 shadow-xl`}>
          {!showSummary ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Avaliação: {courseTitle}</p>
                  <h1 className="text-3xl font-bold">
                    Quiz do Módulo ({currentQuestionIndex + 1}/{questions.length})
                  </h1>
                </div>
                <span className="text-xs bg-blue-600/20 text-blue-400 border border-blue-500/30 px-3 py-1.5 rounded-full font-medium">
                  Pontuação: {score}
                </span>
              </div>

              <h2 className="text-xl font-semibold mb-6 text-gray-200">
                {currentQuiz.question}
              </h2>

              <div className="space-y-3 mb-8">
                {currentQuiz.options.map((option) => {
                  let optionStyle = optionDefault;

                  if (isSubmitted) {
                    if (option === currentQuiz.correctAnswer) {
                      optionStyle = 'border-green-500 bg-green-500/10 text-green-300 font-medium';
                    } else if (option === selectedOption && !isCorrect) {
                      optionStyle = 'border-red-500 bg-red-500/10 text-red-300 font-medium';
                    }
                  } else if (selectedOption === option) {
                    optionStyle = 'border-blue-500 bg-blue-500/10 text-blue-400 font-medium';
                  }

                  return (
                    <button
                      key={option}
                      disabled={isSubmitted}
                      onClick={() => setSelectedOption(option)}
                      className={`w-full text-left p-4 rounded-xl border transition ${optionStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className={`p-4 rounded-xl mb-6 border ${isCorrect ? 'bg-green-500/10 border-green-500/30 text-green-300' : 'bg-red-500/10 border-red-500/30 text-red-300'}`}>
                  <p className="font-bold text-lg mb-1">
                    {isCorrect ? '🎉 Resposta Correta!' : '❌ Resposta Incorreta.'}
                  </p>
                  <p className="text-sm opacity-90">
                    {isCorrect ? 'Parabéns! Acertaste este conceito.' : `A resposta correta era: ${currentQuiz.correctAnswer}`}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-800">
                {isSubmitted ? (
                  <button
                    onClick={handleReset}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-5 py-3 rounded-xl font-semibold transition shadow-lg text-sm"
                  >
                    Recomeçar quiz
                  </button>
                ) : (
                  <div />
                )}

                {isSubmitted ? (
                  <button
                    onClick={handleNextStep}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg ml-auto"
                  >
                    {isLastQuestion ? 'Ver resultado final →' : 'Próxima pergunta →'}
                  </button>
                ) : (
                  <button
                    onClick={handleFinish}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg ml-auto"
                  >
                    Responder
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Ecrã de Resumo Final de Acertos */
            <div className="text-center py-8">
              <span className="text-5xl mb-4 block">🏆</span>
              <h2 className="text-3xl font-bold mb-2">Resultado da Avaliação</h2>
              <p className="text-gray-400 mb-6">Concluíste todas as perguntas do módulo de {courseTitle}.</p>

              <div className="bg-[#0b0e13] border border-gray-800 rounded-2xl p-6 max-w-sm mx-auto mb-8 shadow-inner">
                <p className="text-sm text-gray-400 mb-1">Total de acertos:</p>
                <p className="text-4xl font-extrabold text-blue-400">
                  {score} / {questions.length}
                </p>
                <p className="text-sm text-gray-300 mt-3 font-medium">
                  {score === questions.length
                    ? '✨ Excelente! Desempenho perfeito!'
                    : score >= Math.ceil(questions.length / 2)
                    ? '👍 Bom trabalho! Passaste com sucesso.'
                    : '📖 Recomendamos rever os conceitos e tentar novamente.'}
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <button
                  onClick={handleReset}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                >
                  Tentar novamente
                </button>

                <button
                  onClick={onNextModule || onBack}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                >
                  Ir para o próximo módulo →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}