import { MapPin, Calendar, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useParams } from "react-router-dom";

import { Button } from "../../components/button";
import { api } from "../../lib/axios";
import { UpdateDestinationAndDateModal } from "./update-destination-and-date-modal";

interface Trip {
  id: string;
  destination: string;
  starts_at: string;
  ends_at: string;
  is_confirmed: boolean;
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState<Trip | undefined>();

  useEffect(() => {
    api.get(`/trips/${tripId}`).then((response) => setTrip(response.data.trip));
  }, [tripId]);

  const displayedDate = trip
    ? format(trip.starts_at, "d' de 'LLL")
        .concat(" até ")
        .concat(format(trip.ends_at, "d' de 'LLL"))
    : null;

  const [updateDestinationAndDateModal, setUpdateDestinationAndDateModal] =
    useState(false);

  function openUpdateDestinationAndDateModal() {
    setUpdateDestinationAndDateModal(true);
  }

  function closeUpdateDestinationAndDateModal() {
    setUpdateDestinationAndDateModal(false);
  }

  return (
    <div>
      <div className="flex h-16 items-center justify-between rounded-lg bg-zinc-900 px-4">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{trip?.destination}</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2">
            <Calendar className="size-5 text-zinc-400" />
            <span className="text-zinc-100">{displayedDate}</span>
          </div>

          <div className="h-6 w-px bg-zinc-800" />

          <Button
            variant="secondary"
            onClick={openUpdateDestinationAndDateModal}
          >
            Alterar local/data
            <Settings2 className="size-5" />
          </Button>
        </div>
      </div>

      {updateDestinationAndDateModal && (
        <UpdateDestinationAndDateModal
          closeUpdateDestinationAndDateModal={
            closeUpdateDestinationAndDateModal
          }
        />
      )}
    </div>
  );
}
