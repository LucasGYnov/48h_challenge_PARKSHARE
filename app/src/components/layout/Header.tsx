import Image from "next/image";

export function Header() {
  return (
    <header className="h-16 bg-[#0a0a0a] flex items-center px-8 justify-between shrink-0 shadow-xl">
      <div className="flex items-center gap-4">
        <Image 
          src="/logomark.png" 
          alt="Logo Parkshare"
          width={35} 
          height={35}
          className="object-contain"
        />
        <div className="flex flex-col leading-tight">
          <span className="text-white font-bold text-lg tracking-tight">
            Parkshare <span className="text-brand">Analytics</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-400">
          <span className="text-white cursor-pointer">Dashboard</span>
          <span className="hover:text-white cursor-pointer transition-colors">Market Map</span>
          <span className="hover:text-white cursor-pointer transition-colors">Reports</span>
        </nav>
        <button className="bg-brand hover:bg-brand-dark text-black px-4 py-1.5 rounded-lg text-sm font-bold transition-all transform hover:scale-105">
          Mode Admin
        </button>
      </div>
    </header>
  );
}