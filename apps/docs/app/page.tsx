import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1>Storyless</h1>
        <div>
          <span>Where Your App is the Canvas</span>
          <span>Focus on Features – Not Fluff</span>
        </div>
      </div>
    </main>
  );
}
