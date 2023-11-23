import Head from "next/head";
import { padNavTW } from "~/components/Navigation";
import { cn } from "~/styles/utils";
import { useAuth } from "@clerk/nextjs";
import { useState, type ComponentPropsWithoutRef } from "react";
import { api } from "~/utils/api";

export default function Home() {
  const { isSignedIn } = useAuth();

  const [name, setName] = useState("Feature");

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
  const { mutateAsync: toggle } = api.toggle.set.useMutation({
    onSuccess: () => void refetch(),
  });
  const { data: toggles, refetch } = api.toggle.get.useQuery({});

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
            <div>
              <input
                type="text"
                placeholder="Feature Name..."
                className="input input-bordered w-full max-w-xs"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div>
                <button
                  className="btn btn-primary"
                  disabled={createStatus === "pending" || name === ""}
                  onClick={() => void create({ name })}
                >
                  Create
                </button>
                <button
                  className="btn btn-secondary"
                  disabled={toggles?.[0]?.id === undefined}
                  onClick={() => {
                    if (typeof toggles?.[0]?.id !== "string") return;
                    void toggle({
                      id: toggles?.[0]?.id,
                      enabled: !toggles?.[0]?.enabled,
                    });
                  }}
                >
                  Toggle
                </button>
                <button
                  className="btn btn-error"
                  disabled={
                    deleteStatus === "pending" || toggles?.[0]?.id === undefined
                  }
                  onClick={() => {
                    if (typeof toggles?.[0]?.id !== "string") return;
                    void deleteToggle({ id: toggles?.[0]?.id });
                  }}
                >
                  Delete
                </button>
              </div>
              <pre>{JSON.stringify(toggles, null, 2)}</pre>
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
