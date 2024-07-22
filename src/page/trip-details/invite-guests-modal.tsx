import { X, Mail, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface InviteGuestsModalModalProps {
  closeInviteGuestsModalModal: () => void;
}

const inviteFormSchema = z.object({
  email: z.string().email("O e-mail é obrigatório."),
});

type InviteFormSchema = z.infer<typeof inviteFormSchema>;

export function InviteGuestsModalModal({
  closeInviteGuestsModalModal,
}: InviteGuestsModalModalProps) {
  const { tripId } = useParams();

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState } = useForm<InviteFormSchema>({
    resolver: zodResolver(inviteFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ email }: InviteFormSchema) => {
      // delay 1.5s
      await new Promise((resolve) => setTimeout(resolve, 10000));

      await api.post(`/trips/${tripId}/invites`, {
        email,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-participants", tripId],
      });
      closeInviteGuestsModalModal();
    },
  });

  async function createInvite({ email }: InviteFormSchema) {
    await mutateAsync({ email });
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

        <form onSubmit={handleSubmit(createInvite)} className="space-y-3">
          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Mail className="size-5 text-zinc-400" />
            <input
              type="email"
              {...register("email")}
              placeholder="E-mail"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          {formState.errors.email && (
            <span className="text-sm text-red-500">
              {formState.errors.email.message}
            </span>
          )}

          <Button variant="primary" size="full">
            {formState.isSubmitting ? (
              <span className="inline-flex items-center gap-2 font-medium">
                <Loader2 className="size-5 animate-spin" />
                Enviando convite...
              </span>
            ) : (
              "Enviar convite"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
