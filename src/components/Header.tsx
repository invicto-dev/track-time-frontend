import { Bell, Search } from "lucide-react";

export function Header() {
  return (
    <header className=" flex items-center justify-between px-6 bg-white h-24 shadow-sm border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-semibold text-gray-900">
          {new Date().toLocaleDateString("pt-BR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h2>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
      </div>
    </header>
  );
}
