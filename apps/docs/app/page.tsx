import styles from "./page.module.css";

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <h1>Storyless</h1>
        <div className={styles.main}>
          <div>Where Your App is the Canvas</div>
          {/* <div>Focus on Features, Not Fluff</div> */}
        </div>
      </div>
    </main>
  );
}
