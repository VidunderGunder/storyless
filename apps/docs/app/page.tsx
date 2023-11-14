// import { Icon } from "@storyless/react";
import Image from "next/image";
import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <div className={styles.banner}>
        {/* <Icon className={styles.icon} /> */}
        <Image alt="Storyless Logo" height={150} src="/logo.svg" width={150} />
        <h1 className={styles.h1}>Storyless</h1>
      </div>
    </main>
  );
}
