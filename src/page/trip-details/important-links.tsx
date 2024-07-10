import { Link2, Plus } from "lucide-react";

export function ImportantLinks() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Links importantes</h2>

      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="block font-medium">Reserva do AriBnb</span>
            <a
              href="#"
              className="block truncate text-xs text-zinc-400 hover:text-zinc-200"
            >
              http://www.airbnb.com.br/rooms/10470011012679068075097898775765543
            </a>
          </div>
          <Link2 className="size-5 shrink-0 text-zinc-400" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="block font-medium">Reserva do AriBnb</span>
            <a
              href="#"
              className="block truncate text-xs text-zinc-400 hover:text-zinc-200"
            >
              http://www.airbnb.com.br/rooms/10470011012679068075097898775765543
            </a>
          </div>
          <Link2 className="size-5 shrink-0 text-zinc-400" />
        </div>
      </div>

      <button className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-800 px-5 font-medium text-zinc-200 hover:bg-zinc-700">
        <Plus className="size-5" />
        Cadastrar novo link
      </button>
    </div>
  );
}
