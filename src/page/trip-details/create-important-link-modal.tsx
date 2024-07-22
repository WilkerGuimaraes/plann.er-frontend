import { X, Tag, Link2, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface CreateImportantLinkModalProps {
  closeCreateImportantLinkModal: () => void;
}

const linkFormSchema = z.object({
  title: z.string().min(1, { message: "O título é obrigatório." }),
  url: z.string().min(1, { message: "A URL é obrigatória." }),
});

type LinkFormSchema = z.infer<typeof linkFormSchema>;

export function CreateImportantLinkModal({
  closeCreateImportantLinkModal,
}: CreateImportantLinkModalProps) {
  const { tripId } = useParams();

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState } = useForm<LinkFormSchema>({
    resolver: zodResolver(linkFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async ({ title, url }: LinkFormSchema) => {
      await api.post(`/trips/${tripId}/links`, {
        title,
        url,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-links", tripId],
      });
      closeCreateImportantLinkModal();
    },
  });

  async function createLink({ title, url }: LinkFormSchema) {
    await mutateAsync({ title, url });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Cadastrar Novo Link</h2>

            <button type="button" onClick={closeCreateImportantLinkModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Todos convidados podem acessar os links.
          </p>
        </div>

        <form onSubmit={handleSubmit(createLink)} className="space-y-3">
          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Tag className="size-5 text-zinc-400" />
            <input
              type="text"
              {...register("title")}
              placeholder="Nome do link"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          {formState.errors.title && (
            <span className="text-sm text-red-500">
              {formState.errors.title.message}
            </span>
          )}

          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <Link2 className="size-5 text-zinc-400" />
            <input
              type="text"
              {...register("url")}
              placeholder="Informe o link"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          {formState.errors.url && (
            <span className="text-sm text-red-500">
              {formState.errors.url.message}
            </span>
          )}

          <Button variant="primary" size="full">
            {formState.isSubmitting ? (
              <span className="inline-flex items-center gap-2 font-medium">
                <Loader2 className="size-5 animate-spin" />
                Salvando link...
              </span>
            ) : (
              "Salvar link"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
