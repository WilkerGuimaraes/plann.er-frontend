import { X, Mail } from "lucide-react";
import { useParams } from "react-router-dom";
import { FormEvent } from "react";

import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface InviteGuestsModalModalProps {
  closeInviteGuestsModalModal: () => void;
}

export function InviteGuestsModalModal({
  closeInviteGuestsModalModal,
}: InviteGuestsModalModalProps) {
  const { tripId } = useParams();

  async function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const email = data.get("email")?.toString();

    await api.post(`/trips/${tripId}/invites`, {
      email,
    });

    window.document.location.reload();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar Novo Convidado</h2>

            <button type="button" onClick={closeInviteGuestsModalModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Informe o e-mail do novo convidado(a).
          </p>
        </div>

        <form onSubmit={createLink} className="space-y-3">
          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Mail className="size-5 text-zinc-400" />
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          <Button variant="primary" size="full">
            Enviar convite
          </Button>
        </form>
      </div>
    </div>
  );
}
