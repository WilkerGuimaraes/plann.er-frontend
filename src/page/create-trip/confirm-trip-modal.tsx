import { X, User, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../components/button";

const confirmTripFormSchema = z.object({
  name: z.string().min(1, { message: "O nome completo é obrigatório." }),
  email: z.string().email("O e-mail é obrigatório."),
});

type ConfirmTripFormSchema = z.infer<typeof confirmTripFormSchema>;

interface ConfirmTripModalProps {
  closeConfirmTripModal: () => void;
  createTrip: (data: ConfirmTripFormSchema) => void;
}

export function ConfirmTripModal({
  closeConfirmTripModal,
  createTrip,
}: ConfirmTripModalProps) {
  const { register, handleSubmit, formState } = useForm<ConfirmTripFormSchema>({
    resolver: zodResolver(confirmTripFormSchema),
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              Confirmar criação de viagem
            </h2>

            <button type="button" onClick={closeConfirmTripModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Para concluir a criação da viagem para{" "}
            <span className="font-semibold text-zinc-100">
              Florianópolis, Brasil
            </span>{" "}
            nas datas de{" "}
            <span className="font-semibold text-zinc-100">
              16 a 27 de Agosto de 2024
            </span>{" "}
            preencha seus dados abaixo:
          </p>
        </div>

        <form onSubmit={handleSubmit(createTrip)} className="space-y-3">
          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <User className="size-5 text-zinc-400" />
            <input
              type="text"
              {...register("name")}
              placeholder="Seu nome completo"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          {formState.errors.name && (
            <span className="text-sm text-red-500">
              {formState.errors.name.message}
            </span>
          )}

          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <User className="size-5 text-zinc-400" />
            <input
              type="email"
              {...register("email")}
              placeholder="Seu e-mail pessoal"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          {formState.errors.email && (
            <span className="text-sm text-red-500">
              {formState.errors.email.message}
            </span>
          )}

          <Button type="submit" variant="primary" size="full">
            {formState.isSubmitting ? (
              <span className="inline-flex items-center gap-2 font-medium">
                <Loader2 className="size-5 animate-spin" />
                Confirmando a criação da viagem...
              </span>
            ) : (
              "Confirmar criação da viagem"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
