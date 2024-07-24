import { MapPin, Calendar, Settings2, ArrowRight, X } from "lucide-react";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "../../../components/button";

interface DestinationAndDateStepProps {
  isGuestsInputOpen: boolean;
  eventStartAndEndDates: DateRange | undefined;
  dateErrors: string | null;
  destinationError: boolean;
  closeGuestsInput: () => void;
  openGuestsInput: () => void;
  setDestination: (destination: string) => void;
  setEventStartAndEndDates: (dates: DateRange | undefined) => void;
}

export function DestinationAndDateStep({
  isGuestsInputOpen,
  eventStartAndEndDates,
  closeGuestsInput,
  openGuestsInput,
  setDestination,
  setEventStartAndEndDates,
  dateErrors,
  destinationError,
}: DestinationAndDateStepProps) {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  function openDatePicker() {
    return setIsDatePickerOpen(true);
  }

  function closeDatePicker() {
    return setIsDatePickerOpen(false);
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
    <div className="flex items-center gap-3 rounded-lg bg-zinc-900 px-4 py-3 shadow-shape">
      <div className="flex-1 text-left">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-zinc-400" />
          <input
            type="text"
            disabled={isGuestsInputOpen}
            placeholder="Para onde você vai?"
            className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
            onChange={(event) => setDestination(event.target.value)}
          />
        </div>
        {destinationError && (
          <span className="pl-7 text-sm text-red-500">
            Informe o local da viagem.
          </span>
        )}
      </div>

      <div className="text-left">
        <button
          disabled={isGuestsInputOpen}
          onClick={openDatePicker}
          className="flex w-[240px] items-center gap-2 text-left"
        >
          <Calendar className="size-5 text-zinc-400" />
          <span className="w-40 flex-1 text-lg text-zinc-400">
            {displayedDate || "Quando?"}
          </span>
        </button>

        {dateErrors && (
          <span className="text-sm text-red-500">{dateErrors}</span>
        )}
      </div>

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

      <div className="h-6 w-px bg-zinc-800" />

      {isGuestsInputOpen ? (
        <Button onClick={closeGuestsInput} variant="secondary">
          <Settings2 className="size-5" />
          Alterar local/data
        </Button>
      ) : (
        <Button onClick={openGuestsInput} variant="primary">
          <ArrowRight className="size-5" />
          Continuar
        </Button>
      )}
    </div>
  );
}
