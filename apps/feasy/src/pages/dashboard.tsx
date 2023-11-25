import Head from "next/head";
import { padNavTW } from "~/components/Navigation";
import { cn } from "~/styles/utils";
import { useAuth } from "@clerk/nextjs";
import { useState, type ComponentPropsWithoutRef } from "react";
import { api } from "~/utils/api";
import { Toggle } from "~/components/Toggle";

type IDs = ComponentPropsWithoutRef<typeof Toggle>["ids"];

export default function Home() {
  const { isSignedIn, orgId, userId } = useAuth();

  const clerkIds: IDs =
    ([
      {
        label: "orgId",
        value: orgId,
        color: "primary",
      },
      {
        label: "userId",
        value: userId,
        color: "secondary",
      },
    ].filter((id) => typeof id.value === "string") as IDs) ?? [];

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
        <meta name="description" content="Feature Toggles Made Easy" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main
        className={cn(
          "flex min-h-screen flex-col items-center justify-center bg-cover bg-scroll bg-bottom bg-no-repeat",
          padNavTW,
        )}
        style={{
          backgroundImage: `url('/cityscape.webp')`,
        }}
      >
        <div className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full bg-gray-900 opacity-60" />

        {isSignedIn ? (
          <div className="z-10 flex flex-col items-center justify-center gap-1">
            <div className="flex flex-col gap-5">
              <div className="flex w-full items-center justify-stretch gap-2">
                <input
                  onKeyDown={(e) => {
                    if (e.key === "Enter") createToggle();
                  }}
                  type="text"
                  placeholder="Feature Name..."
                  className="input input-bordered w-full"
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
                        ids={[
                          {
                            label: "id",
                            value: id,
                            color: "success",
                          },
                          ...clerkIds,
                        ]}
                        color="success"
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
          <div className="z-10 flex flex-col items-center justify-center gap-10 rounded-2xl bg-base-200 p-10">
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
