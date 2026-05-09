import styles from './FlaggedPhotosPreview.module.css'

const FLAGGED = [
  { color: 'linear-gradient(150deg,#dbeafe,#93c5fd)', tag: 'DUP' },
  { color: 'linear-gradient(150deg,#e0f2fe,#7dd3fc)', tag: 'BLUR' },
  { color: 'linear-gradient(150deg,#ede9fe,#c4b5fd)', tag: 'SCRN' },
  { color: 'linear-gradient(150deg,#e0e7ff,#a5b4fc)', tag: 'LOW' },
]

export default function FlaggedPhotosPreview({ total = 362, onSeeAll }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.title}>Flagged photos</span>
        <button className={styles.link} onClick={onSeeAll}>{total} total →</button>
      </div>
      <div className={styles.grid}>
        {FLAGGED.map((f, i) => (
          <div key={i} className={styles.thumb}>
            <div className={styles.thumbBg} style={{ background: f.color }} />
            <div className={styles.tag}>{f.tag}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
