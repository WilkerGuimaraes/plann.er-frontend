import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DateRange } from "react-day-picker";

import { InviteGuestsModal } from "./invite-guests-modal";
import { ConfirmTripModal } from "./confirm-trip-modal";
import { DestinationAndDateStep } from "./steps/destination-and-date-step";
import { InviteGuestsSteps } from "./steps/invite-guests-step";
import { api } from "../../lib/axios";

type ConfirmTripModalProps = {
  name: string;
  email: string;
};

export function CreateTripPage() {
  const navigate = useNavigate();

  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

  const [destination, setDestination] = useState("");
  const [eventStartAndEndDates, setEventStartAndEndDates] = useState<
    DateRange | undefined
  >();
  const [dateErrors, setDatesErrors] = useState<string | null>(null);
  const [destinationError, setDestinationError] = useState(false);

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);

  function validateDates() {
    if (!eventStartAndEndDates?.from || !eventStartAndEndDates.to) {
      return "Informe o período da viagem.";
    }
    if (eventStartAndEndDates.from <= new Date()) {
      return "A data de início deve ser após o dia atual.";
    }
    return null;
  }

  function openGuestsInput() {
    if (!destination) {
      return setDestinationError(true);
    }

    setDestinationError(false);

    const validationError = validateDates();
    if (validationError) {
      return setDatesErrors(validationError);
    }

    setDatesErrors(null);
    setIsGuestsInputOpen(true);
  }

  function closeGuestsInput() {
    setIsGuestsInputOpen(false);
  }

  function openGuestsModal() {
    setIsGuestsModalOpen(true);
  }

  function closeGuestsModal() {
    setIsGuestsModalOpen(false);
  }

  function openConfirmTripModal() {
    setIsConfirmTripModalOpen(true);
  }

  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false);
  }

  function addNewEmailToInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const email = data.get("email")?.toString();

    if (!email) return;

    if (emailsToInvite.includes(email)) return;

    setEmailsToInvite([...emailsToInvite, email]);

    event.currentTarget.reset();
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(
      (email) => email !== emailToRemove,
    );

    setEmailsToInvite(newEmailList);
  }

  async function createTrip(data: ConfirmTripModalProps) {
    if (!destination) return;
    if (!eventStartAndEndDates?.from || !eventStartAndEndDates.to) return;
    if (emailsToInvite.length === 0) return;

    const response = await api.post("/trips", {
      destination,
      starts_at: eventStartAndEndDates?.from,
      ends_at: eventStartAndEndDates.to,
      emails_to_invite: emailsToInvite,
      owner_name: data.name,
      owner_email: data.email,
    });

    const { tripId } = response.data;

    navigate(`/trips/${tripId}`);
  }

  return (
    <div className="flex h-screen items-center justify-center bg-pattern bg-center bg-no-repeat">
      <div className="w-full max-w-3xl space-y-10 px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-lg text-zinc-300">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="space-y-4">
          <DestinationAndDateStep
            isGuestsInputOpen={isGuestsInputOpen}
            closeGuestsInput={closeGuestsInput}
            openGuestsInput={openGuestsInput}
            setDestination={setDestination}
            eventStartAndEndDates={eventStartAndEndDates}
            setEventStartAndEndDates={setEventStartAndEndDates}
            dateErrors={dateErrors}
            destinationError={destinationError}
          />

          {isGuestsInputOpen && (
            <InviteGuestsSteps
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
            />
          )}
        </div>

        <p className="text-sm text-zinc-500">
          Ao planejar sua viagem pela plann.er você automaticamente concorda
          <br /> com nossos{" "}
          <a href="#" className="text-zinc-300 underline">
            termos de uso
          </a>{" "}
          e{" "}
          <a href="#" className="text-zinc-300 underline">
            políticas de privacidade
          </a>
          .
        </p>
      </div>

      {isGuestsModalOpen && (
        <InviteGuestsModal
          emailsToInvite={emailsToInvite}
          closeGuestsModal={closeGuestsModal}
          addNewEmailToInvite={addNewEmailToInvite}
          removeEmailFromInvites={removeEmailFromInvites}
        />
      )}

      {isConfirmTripModalOpen && (
        <ConfirmTripModal
          closeConfirmTripModal={closeConfirmTripModal}
          createTrip={createTrip}
        />
      )}
    </div>
  );
}
