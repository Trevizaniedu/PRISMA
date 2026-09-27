interface HeaderProps {
  userName: string;
  onNavigateToProfile: () => void;
}

export function Header({
  userName,
  onNavigateToProfile,
}: HeaderProps) {
  return (
    <header className="bg-[#212127] border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={onNavigateToProfile}
          className="text-white font-bold text-xl"
        >
          PRISMA
        </button>

        <button
          onClick={onNavigateToProfile}
          className="text-gray-300 hover:text-white"
        >
          Olá, {userName}
        </button>
      </div>
    </header>
  );
}