import styles from './StatusSummaryCard.module.css'

export default function StatusSummaryCard({ status = 'Cleanup needed', totalPhotos = 3812, lastScan = '2 days ago', progress = 38 }) {
  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div className={styles.left}>
          <div className={styles.pill}>
            <div className={styles.pillDot} />
            <span className={styles.pillText}>{status}</span>
          </div>
          <div className={styles.title}>{totalPhotos.toLocaleString()} photos</div>
          <div className={styles.meta}>Last scan · {lastScan}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.pct}>{progress}%</div>
          <div className={styles.pctLabel}>cleaned</div>
        </div>
      </div>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
