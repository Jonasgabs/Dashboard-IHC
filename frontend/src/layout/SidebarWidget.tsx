export default function SidebarWidget() {
  return (
    <div
      className="mx-auto w-full max-w-60 rounded-2xl bg-gray-50 px-4 py-5 text-center dark:bg-white/[0.03]"
    >
      <p className="mb-1.5 text-gray-500 text-theme-sm dark:text-gray-400">
        © {new Date().getFullYear()} Leading Prospect Core
      </p>
      <p className="mb-1.5 text-gray-500 text-theme-sm dark:text-gray-400">
        Todos os direitos reservados · People Change AI Consulting
      </p>
      <p className="text-gray-500 text-theme-sm dark:text-gray-400">
        Desenvolvido por Jonas Sarmento
      </p>
    </div>
  );
}
