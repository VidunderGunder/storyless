import { Icon } from "@storyless/react";
import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <div className={styles.banner}>
        <Icon className={styles.icon} />
        <h1 className={styles.h1}>Storyless</h1>
      </div>
    </main>
  );
}
