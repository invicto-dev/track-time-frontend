import { Bell, Menu, X } from "lucide-react";
import { useSidebar } from "../contexts/SideBarContext";

export function Header() {
  const { isOpen, toggle } = useSidebar();

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 bg-white h-16 sm:h-20 shadow-sm border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <button
          onClick={toggle}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
        
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
          <span className="hidden sm:inline">
            {new Date().toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="sm:hidden">
            {new Date().toLocaleDateString("pt-BR", {
              day: "numeric",
              weekday: "long",
              month: "short",
            })}
          </span>
        </h2>
      </div>

      {/* <div className="flex items-center space-x-2 sm:space-x-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
      </div> */}
    </header>
  );
}