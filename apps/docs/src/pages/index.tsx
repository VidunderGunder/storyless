import Image from "next/image";

export default function Page(): JSX.Element {
  return (
    <main className="relative flex h-full min-h-full flex-col items-center justify-center">
      <div
        style={{
          zIndex: 0,
          position: "absolute",
          display: "grid",
          placeItems: "center",
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <Image
          priority
          alt="Storyless Background"
          src="/wallpaper.jpg"
          width={1683}
          height={3003}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: -1,
          }}
        />
      </div>
      <div className="flex w-full flex-col items-center justify-center gap-6 bg-slate-900 bg-opacity-50 px-16 py-12 drop-shadow ">
        <Image alt="Storyless Logo" height={150} src="/logo.svg" width={150} />
        <h1 className="text-[min(max(3rem,12vw),7rem)] font-black leading-none text-white drop-shadow-sm">
          Storyless
        </h1>
        <h2 className="text-[min(max(0.75rem,2vw),1.5rem)] leading-none text-white drop-shadow-sm">
          👇 Press the button
        </h2>
      </div>
    </main>
  );
}
