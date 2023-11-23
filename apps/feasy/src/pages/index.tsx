import { Icon } from "@iconify/react";
import { useAtom } from "jotai";
import Head from "next/head";
import { useEffect, useState } from "react";
import { Navigation } from "~/components/Navigation";
import { transparentNavbarAtom } from "~/state";
import { cn } from "~/styles/utils";

export default function Home() {
  console.count("render");

  const [transparent, setTransparent] = useAtom(transparentNavbarAtom);

  const checked = !transparent;
  const setChecked = (checked: boolean) => setTransparent(!checked);

  return (
    <>
      <Head>
        <title>Feasy</title>
        <meta name="description" content="Heckin' Easy Feature Toggles" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen flex-col items-center">
        <div
          className={cn(
            "hero select-none bg-base-200 transition-all delay-500 duration-1000",
            checked ? "min-h-[70vh]" : "min-h-screen",
          )}
          style={{
            backgroundImage:
              "url(https://cdn.pixabay.com/photo/2023/10/10/12/36/lofi-8306349_1280.jpg)",
          }}
        >
          <div className="hero-overlay bg-opacity-60"></div>
          <div className="hero-content text-center text-neutral-content">
            <div className="flex max-w-md flex-col items-center justify-center text-white">
              <h1
                className={cn(
                  "mb-5 text-9xl font-black transition-all duration-500",
                  // flip the bird
                  checked ? "rotate-0" : "rotate-180",
                )}
              >
                <Icon icon="fluent-emoji:flamingo" />
              </h1>
              <h1 className="mb-5 text-8xl font-black">Feasy</h1>
              <p className="text-md font-bold">Feature Toggles</p>
              <p className="text-md mb-4 font-bold">made heckin&apos; easy</p>
              <div className="flex w-fit items-center justify-self-center">
                <label className="label flex cursor-pointer flex-col gap-2">
                  <span className="sr-only">get started</span>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => setChecked(!checked)}
                    className="toggle toggle-info toggle-lg"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-auto mb-48 w-fit py-16">
          {checked ? (
            <article className="prose">
              <h2>Congrats.</h2>
              <p>You just flipped a feature toggle in live production.</p>

              <p>Felt nice, right?</p>
            </article>
          ) : (
            <p>Why don&apos;t you flick that lil&apos; toggle up there, no?</p>
          )}
        </div>
      </main>
    </>
  );
}
