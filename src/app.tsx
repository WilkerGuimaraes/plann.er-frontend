import {
  ArrowRight,
  AtSign,
  Calendar,
  MapPin,
  Plus,
  Settings2,
  User,
  UserRoundPlus,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";

export function App() {
  const [isGuestsInputOpen, setIsGuestsInputOpen] = useState(false);
  const [isGuestsModalOpen, setIsGuestsModalOpen] = useState(false);
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false);

  const [emailsToInvite, setEmailsToInvite] = useState([
    "wilkerguimaraes.07@gmail.com",
    "john@acme.com",
  ]);

  function openGuestsInput() {
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

  return (
    <div className="bg-pattern flex h-screen items-center justify-center bg-center bg-no-repeat">
      <div className="w-full max-w-3xl space-y-10 px-6 text-center">
        <div className="flex flex-col items-center gap-3">
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-lg text-zinc-300">
            Convide seus amigos e planeje sua próxima viagem!
          </p>
        </div>

        <div className="space-y-4">
          <div className="shadow-shape flex h-16 items-center gap-3 rounded-lg bg-zinc-900 px-4">
            <div className="flex flex-1 items-center gap-2">
              <MapPin className="size-5 text-zinc-400" />
              <input
                type="text"
                disabled={isGuestsInputOpen}
                placeholder="Para onde você vai?"
                className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="size-5 text-zinc-400" />
              <input
                type="text"
                disabled={isGuestsInputOpen}
                placeholder="Quando?"
                className="w-40 bg-transparent text-lg placeholder-zinc-400 outline-none"
              />
            </div>

            <div className="h-6 w-px bg-zinc-800" />

            {isGuestsInputOpen ? (
              <button
                onClick={closeGuestsInput}
                className="text-zinc-250 flex items-center gap-2 rounded-lg bg-zinc-800 px-5 py-2 font-medium hover:bg-zinc-700"
              >
                Alterar local/data
                <Settings2 className="size-5" />
              </button>
            ) : (
              <button
                onClick={openGuestsInput}
                className="flex items-center gap-2 rounded-lg bg-lime-300 px-5 py-2 font-medium text-lime-950 hover:bg-lime-400"
              >
                Continuar
                <ArrowRight className="size-5" />
              </button>
            )}
          </div>

          {isGuestsInputOpen && (
            <div className="shadow-shape flex h-16 items-center gap-3 rounded-lg bg-zinc-900 px-4">
              <button
                type="button"
                onClick={openGuestsModal}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <UserRoundPlus className="size-5 text-zinc-400" />
                {emailsToInvite.length > 0 ? (
                  <span className="text-zinc-100">
                    {emailsToInvite.length} pessoa(s) convidada(s)
                  </span>
                ) : (
                  <span className="flex-1 text-lg text-zinc-400">
                    Quem estará na viagem?
                  </span>
                )}
              </button>

              <div className="h-6 w-px bg-zinc-800" />

              <button
                onClick={openConfirmTripModal}
                className="flex items-center gap-2 rounded-lg bg-lime-300 px-5 py-2 font-medium text-lime-950 hover:bg-lime-400"
              >
                Confirmar viagem
                <ArrowRight className="size-5" />
              </button>
            </div>
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
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="shadow-shape w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Selecionar convidados</h2>

                <button type="button" onClick={closeGuestsModal}>
                  <X className="size-5 text-zinc-400" />
                </button>
              </div>

              <p className="text-sm text-zinc-400">
                Os convidados irão receber e-mails para confirmar a participação
                na viagem.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {emailsToInvite.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 rounded-md bg-zinc-800 px-2.5 py-1.5"
                >
                  <span className="text-zinc-300">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeEmailFromInvites(email)}
                  >
                    <X className="size-4 text-zinc-400" />
                  </button>
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-zinc-900" />

            <form
              onSubmit={addNewEmailToInvite}
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5"
            >
              <div className="flex flex-1 items-center gap-2 px-2">
                <AtSign className="size-5 text-zinc-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="Digite o e-mail do convidado"
                  className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                />
              </div>

              <button
                type="submit"
                onClick={openGuestsInput}
                className="flex items-center gap-2 rounded-lg bg-lime-300 px-5 py-2 font-medium text-lime-950 hover:bg-lime-400"
              >
                Convidar
                <Plus className="size-5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {isConfirmTripModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60">
          <div className="shadow-shape w-[640px] space-y-5 rounded-xl bg-zinc-900 px-6 py-5">
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

            <form onSubmit={addNewEmailToInvite} className="space-y-3">
              <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
                <User className="size-5 text-zinc-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Seu nome completo"
                  className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                />
              </div>

              <div className="flex h-14 items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4">
                <User className="size-5 text-zinc-400" />
                <input
                  type="text"
                  name="name"
                  placeholder="Seu e-mail pessoal"
                  className="flex-1 bg-transparent text-lg placeholder-zinc-400 outline-none"
                />
              </div>

              <button
                type="submit"
                onClick={openGuestsInput}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-lime-300 px-5 font-medium text-lime-950 hover:bg-lime-400"
              >
                Confirmar criação da viagem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
