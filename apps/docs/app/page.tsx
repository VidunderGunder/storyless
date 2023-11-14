import Image from "next/image";
import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <div className={styles.banner}>
        <Image alt="Storyless Logo" height={150} src="/logo.svg" width={150} />
        <h1 className={styles.h1}>Storyless</h1>
      </div>
    </main>
  );
}
