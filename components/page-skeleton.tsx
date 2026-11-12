import styles from './page-skeleton.module.css';

/** Shared loading skeleton for public pages: hero-shaped + card-shaped
 *  pulsing placeholders in the site's colours, announced to assistive tech. */
export default function PageSkeleton({cards = 6}: {cards?: number}) {
  return <div className={styles.wrap} role="status" aria-label="তথ্য লোড হচ্ছে">
    <span className={styles.srOnly}>তথ্য লোড হচ্ছে…</span>
    <div className={styles.hero} aria-hidden="true">
      <span className={`${styles.block} ${styles.kicker}`}/>
      <span className={`${styles.block} ${styles.title}`}/>
      <span className={`${styles.block} ${styles.line}`}/>
    </div>
    <div className={styles.grid} aria-hidden="true">
      {Array.from({length: cards}).map((_, i) => <div className={styles.card} key={i}>
        <span className={`${styles.block} ${styles.image}`}/>
        <span className={`${styles.block} ${styles.cardLine}`}/>
        <span className={`${styles.block} ${styles.cardLineShort}`}/>
      </div>)}
    </div>
  </div>;
}
