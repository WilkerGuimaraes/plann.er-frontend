import { X, Tag, Calendar, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface CreateActivityModalProps {
  closeCreateActivityModal: () => void;
}

const activityFormSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório." }),
  occurs_at: z.string().min(1, { message: "Informe a data e a hora." }),
});

type ActivityFormSchema = z.infer<typeof activityFormSchema>;

export function CreateActivityModal({
  closeCreateActivityModal,
}: CreateActivityModalProps) {
  const { tripId } = useParams();

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState } = useForm<ActivityFormSchema>({
    resolver: zodResolver(activityFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title, occurs_at }: ActivityFormSchema) => {
      await api.post(`/trips/${tripId}/activities`, {
        title,
        occurs_at,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-activities", tripId],
      });
      closeCreateActivityModal();
    },
  });

  async function createActivity({ title, occurs_at }: ActivityFormSchema) {
    await mutateAsync({ title, occurs_at });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar atividade</h2>

            <button type="button" onClick={closeCreateActivityModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem visualizar as atividades.
          </p>
        </div>

        <form onSubmit={handleSubmit(createActivity)} className="space-y-3">
          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Tag className="size-5 text-zinc-400" />
            <input
              type="text"
              {...register("title")}
              placeholder="Qual a atividade?"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          {formState.errors.title && (
            <span className="text-sm text-red-500">
              {formState.errors.title.message}
            </span>
          )}

          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Calendar className="size-5 text-zinc-400" />
            <input
              type="datetime-local"
              {...register("occurs_at")}
              placeholder="Data e horário da atividade"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          {formState.errors.occurs_at && (
            <span className="text-sm text-red-500">
              {formState.errors.occurs_at.message}
            </span>
          )}

          <Button variant="primary" size="full">
            {formState.isSubmitting ? (
              <span className="inline-flex items-center gap-2 font-medium">
                <Loader2 className="size-5 animate-spin" />
                Salvando atividade...
              </span>
            ) : (
              "Salvar atividade"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
