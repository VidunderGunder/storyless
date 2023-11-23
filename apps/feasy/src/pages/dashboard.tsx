import Head from "next/head";
import { padNavTW } from "~/components/Navigation";
import { cn } from "~/styles/utils";
import { useAuth } from "@clerk/nextjs";
import { type ComponentPropsWithoutRef } from "react";

export default function Home() {
  const { isSignedIn } = useAuth();

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
            <article className="prose text-center">
              <h2>{`👩‍🔬 Not yet 👨‍🔬`}</h2>

              <p>
                {`We're hard at work cooking up some`}
                <br />
                {`quality feature toggles for you.`}
              </p>
              <p>
                {`But in the meantime,`}
                <br />
                {`you can still play with this:`}
              </p>
            </article>
            <PretendDashboard />
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
