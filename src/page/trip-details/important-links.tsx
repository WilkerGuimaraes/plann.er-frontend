import { Link2, Plus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "../../components/button";
import { CreateImportantLinkModal } from "./create-important-link-modal";
import { api } from "../../lib/axios";

interface Link {
  title: string;
  url: string;
}

export function ImportantLinks() {
  const { tripId } = useParams();

  const { data: links } = useQuery<Link[]>({
    queryKey: ["get-links", tripId],
    queryFn: async () => {
      const response = await api.get(`/trips/${tripId}/links`);

      return response.data.links;
    },
  });

  const [isCreateImportantLinkModal, setIsCreateImportantLinkModal] =
    useState(false);

  function openCreateImportantLinkModal() {
    setIsCreateImportantLinkModal(true);
  }

  function closeCreateImportantLinkModal() {
    setIsCreateImportantLinkModal(false);
  }
  return (
    <div>
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Links importantes</h2>

        <div className="space-y-5">
          {links?.map((link) => (
            <div
              key={link.title}
              className="flex items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <span className="block font-medium">{link.title}</span>
                <a
                  href={link.url}
                  className="block truncate text-xs text-zinc-400 hover:text-zinc-200"
                >
                  {link.url}
                </a>
              </div>
              <Link2 className="size-5 shrink-0 text-zinc-400" />
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          size="full"
          onClick={openCreateImportantLinkModal}
        >
          <Plus className="size-5" />
          Cadastrar novo link
        </Button>
      </div>

      {isCreateImportantLinkModal && (
        <CreateImportantLinkModal
          closeCreateImportantLinkModal={closeCreateImportantLinkModal}
        />
      )}
    </div>
  );
}
