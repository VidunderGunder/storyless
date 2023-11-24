import Head from "next/head";
import { padNavTW } from "~/components/Navigation";
import { cn } from "~/styles/utils";
import { useAuth } from "@clerk/nextjs";
import { useState, type ComponentPropsWithoutRef } from "react";
import { api } from "~/utils/api";
import { Toggle } from "~/components/Toggle";

export default function Home() {
  const { isSignedIn } = useAuth();

  const [name, setName] = useState("");

  const { status: createStatus, mutateAsync: create } =
    api.toggle.create.useMutation({
      onSuccess: () => {
        setName("");
        void refetch();
      },
    });
  const { status: deleteStatus, mutateAsync: deleteToggle } =
    api.toggle.delete.useMutation({
      onSuccess: () => void refetch(),
    });
  const { mutateAsync: updateToggle } = api.toggle.update.useMutation({
    onSuccess: () => void refetch(),
  });
  const { data: toggles, refetch } = api.toggle.get.useQuery({});

  function createToggle() {
    if (name === "") return;
    void create({ name });
  }

  const disableCreate =
    createStatus === "pending" ||
    name === "" ||
    !isSignedIn ||
    toggles?.some((t) => t.name === name);

  return (
    <>
      <Head>
        <title>Feasy</title>
        <meta name="description" content="Heckin' Easy Feature Toggles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={cn(
          "flex min-h-screen flex-col items-center justify-center",
          padNavTW,
        )}
      >
        {isSignedIn ? (
          <div className="flex flex-col items-center justify-center gap-10">
            <div className="flex flex-col gap-5">
              <div className="flex w-full max-w-xs items-center justify-between gap-2">
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createToggle();
                  }}
                  type="text"
                  placeholder="Feature Name..."
                  className="input input-bordered w-full max-w-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  disabled={disableCreate}
                  onClick={createToggle}
                >
                  Create
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {toggles?.map((toggle) => {
                  const { id, name, enabled } = toggle;
                  return (
                    <div key={toggle.id}>
                      <Toggle
                        toggleId={id}
                        label={name}
                        checked={enabled}
                        onChange={() => {
                          void updateToggle({
                            id,
                            enabled: !enabled,
                          });
                        }}
                        onDelete={() => {
                          if (confirm("Are you sure? This can't be reverted."))
                            void deleteToggle({ id });
                        }}
                        disabled={deleteStatus === "pending"}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-10">
            <article className="prose text-center">
              <h2>{`👮‍♂️ Hmm... Your not signed in`}</h2>

              <p>
                {`So we can't find your dashboard,`}
                <br />
                {`but you can play with this:`}
              </p>
            </article>
            <PretendDashboard />
          </div>
        )}
      </main>
    </>
  );
}

type PretendDashboardProps = {
  // props
} & ComponentPropsWithoutRef<"div">;
function PretendDashboard({ className, ...props }: PretendDashboardProps) {
  return (
    <div className={cn("items-left w-fit gap-2", className)} {...props}>
      <label className="label flex w-fit cursor-pointer justify-start gap-2">
        <input type="checkbox" className="toggle toggle-success" />
        <span className="label-text">World Peace 🕊️</span>
      </label>

      <label className="label flex w-fit cursor-pointer justify-start gap-2">
        <input type="checkbox" className="toggle toggle-warning" />
        <span className="label-text">Free Tacos 🌮</span>
      </label>

      <label className="label flex w-fit cursor-pointer justify-start gap-2">
        <input type="checkbox" className="toggle toggle-info" />
        <span className="label-text">Surprise 🎉</span>
      </label>

      <label className="label flex w-fit cursor-pointer justify-start gap-2">
        <input type="checkbox" className="toggle toggle-error" />
        <span className="label-text">Literally Nothing</span>
      </label>
    </div>
  );
}
