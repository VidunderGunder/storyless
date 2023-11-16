import Image from "next/image";

export default function Page(): JSX.Element {
  return (
    <main className="flex h-full min-h-full flex-col items-center justify-center">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <Image alt="Storyless Logo" height={150} src="/logo.svg" width={150} />
        <h1 className="text-[min(max(3rem,12vw),7rem)] font-bold leading-none">
          Storyless
        </h1>
      </div>
    </main>
  );
}
