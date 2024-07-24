import { X, MapPin, Calendar, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DateRange, DayPicker } from "react-day-picker";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface UpdateDestinationAndDateModalProps {
  closeUpdateDestinationAndDateModal: () => void;
}

const updateTripFormSchema = z.object({
  destination: z.string().min(1, { message: "Informe qual é o destino." }),
});

type UpdateTripFormSchema = z.infer<typeof updateTripFormSchema>;

export function UpdateDestinationAndDateModal({
  closeUpdateDestinationAndDateModal,
}: UpdateDestinationAndDateModalProps) {
  const { tripId } = useParams();

  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();
  const [error, setError] = useState<string | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  function openDatePicker() {
    return setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false);
  }

  const queryClient = useQueryClient();

  const { register, handleSubmit, formState } = useForm<UpdateTripFormSchema>({
    resolver: zodResolver(updateTripFormSchema),
  });

  const { mutateAsync } = useMutation({
    mutationFn: async (data: {
      destination: string;
      starts_at: Date;
      ends_at: Date;
    }) => {
      await api.put(`/trips/${tripId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-updatedTrip", tripId],
      });
      queryClient.invalidateQueries({
        queryKey: ["get-activities", tripId],
      });
      closeUpdateDestinationAndDateModal();
    },
  });

  function validateDates() {
    if (!eventStartAndEndDates?.from || !eventStartAndEndDates.to) {
      return "Informe a data e a hora.";
    }
    if (eventStartAndEndDates.from <= new Date()) {
      return "A data de início deve ser após o dia atual.";
    }
    return null;
  }

  async function updateTrip(data: UpdateTripFormSchema) {
    const validationError = validateDates();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!eventStartAndEndDates) return;

    await mutateAsync({
      destination: data.destination,
      starts_at: eventStartAndEndDates.from!,
      ends_at: eventStartAndEndDates.to!,
    });
  }

  const displayedDate =
    eventStartAndEndDates &&
    eventStartAndEndDates.from &&
    eventStartAndEndDates.to
      ? format(eventStartAndEndDates.from, "d' de 'LLL", { locale: ptBR })
          .concat(" até ")
          .concat(
            format(eventStartAndEndDates.to, "d' de 'LLL", { locale: ptBR }),
          )
      : null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60">
      <div className="w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Alterar local/data</h2>

            <button type="button" onClick={closeUpdateDestinationAndDateModal}>
              <X className="size-5 text-zinc-400" />
            </button>
          </div>

          <p className="text-sm text-zinc-400">
            Informe o novo destino e as novas datas.
          </p>
        </div>

        <form onSubmit={handleSubmit(updateTrip)} className="space-y-3">
          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <MapPin className="size-5 text-zinc-400" />
            <input
              type="text"
              {...register("destination")}
              placeholder="Para onde você vai?"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          {formState.errors.destination && (
            <span className="text-sm text-red-500">
              {formState.errors.destination.message}
            </span>
          )}

          <button
            onClick={openDatePicker}
            className="flex h-14 w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 text-left"
          >
            <Calendar className="size-5 text-zinc-400" />
            <span className="w-40 flex-1 text-lg text-zinc-400">
              {displayedDate || "Quando?"}
            </span>
          </button>

          {error && <span className="text-sm text-red-500">{error}</span>}

          {isDatePickerOpen && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/60">
              <div className="space-y-5 rounded-xl bg-zinc-900 px-6 py-5 shadow-shape">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Selecione a data</h2>

                    <button type="button" onClick={closeDatePicker}>
                      <X className="size-5 text-zinc-400" />
                    </button>
                  </div>

                  <DayPicker
                    mode="range"
                    selected={eventStartAndEndDates}
                    onSelect={setEventStartAndEndDates}
                    classNames={{
                      day_selected: "bg-lime-300",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          <Button variant="primary" size="full">
            {formState.isSubmitting ? (
              <span className="inline-flex items-center gap-2 font-medium">
                <Loader2 className="size-5 animate-spin" />
                Salvando alterações...
              </span>
            ) : (
              "Salvar alterações"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
