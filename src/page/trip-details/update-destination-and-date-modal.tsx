import { X, MapPin, Calendar } from "lucide-react";
import { useParams } from "react-router-dom";
import { FormEvent, useState } from "react";
import { format } from "date-fns";
import { DateRange, DayPicker } from "react-day-picker";

import { Button } from "../../components/button";
import { api } from "../../lib/axios";

interface UpdateDestinationAndDateModalProps {
  closeUpdateDestinationAndDateModal: () => void;
}

export function UpdateDestinationAndDateModal({
  closeUpdateDestinationAndDateModal,
}: UpdateDestinationAndDateModalProps) {
  const { tripId } = useParams();

  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  function openDatePicker() {
    return setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false);
  }

  async function createLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const destination = data.get("destination")?.toString();

    if (!destination) return;
    if (!eventStartAndEndDates?.from || !eventStartAndEndDates.to) return;

    await api.put(`/trips/${tripId}`, {
      destination,
      starts_at: eventStartAndEndDates?.from,
      ends_at: eventStartAndEndDates.to,
    });

    window.document.location.reload();
  }

  const displayedDate =
    eventStartAndEndDates &&
    eventStartAndEndDates.from &&
    eventStartAndEndDates.to
      ? format(eventStartAndEndDates.from, "d' de 'LLL")
          .concat(" até ")
          .concat(format(eventStartAndEndDates.to, "d' de 'LLL"))
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

        <form onSubmit={createLink} className="space-y-3">
          <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
            <MapPin className="size-5 text-zinc-400" />
            <input
              type="text"
              name="destination"
              placeholder="Para onde você vai?"
              className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            />
          </div>

          <button
            onClick={openDatePicker}
            className="flex h-14 w-full items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 text-left"
          >
            <Calendar className="size-5 text-zinc-400" />
            <span className="w-40 flex-1 text-lg text-zinc-400">
              {displayedDate || "Quando?"}
            </span>
          </button>

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
                  />
                </div>
              </div>
            </div>
          )}

          <Button variant="primary" size="full">
            Salvar alterações
          </Button>
        </form>
      </div>
    </div>
  );
}
