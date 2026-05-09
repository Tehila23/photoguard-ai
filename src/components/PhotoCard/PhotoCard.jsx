import styles from './PhotoCard.module.css'

const PATTERNS = [
  'linear-gradient(160deg, #F8FAFC 0%, #E2E8F0 100%)',
  'linear-gradient(145deg, #F1F5F9 0%, #DDE5F0 100%)',
  'linear-gradient(155deg, #F5F7FA 0%, #E4EAF2 100%)',
  'linear-gradient(140deg, #EEF2F7 0%, #D8E2EE 100%)',
  'linear-gradient(150deg, #F4F6F9 0%, #E0E8F1 100%)',
  'linear-gradient(160deg, #F0F4F8 0%, #D9E3ED 100%)',
  'linear-gradient(145deg, #F6F8FB 0%, #DDE5EF 100%)',
  'linear-gradient(135deg, #F2F5F9 0%, #DBE3EE 100%)',
  'linear-gradient(155deg, #EDF1F6 0%, #D5DFEC 100%)',
]

function ImageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
      stroke="#C4CDDA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  )
}

export default function PhotoCard({ id, selected, onToggle }) {
  const bg = PATTERNS[id % PATTERNS.length]
  return (
    <div
      className={`${styles.cell} ${selected ? styles.selected : ''}`}
      onClick={() => onToggle(id)}
    >
      <div className={styles.bg} style={{ background: bg }} />
      <div className={styles.imgIcon}><ImageIcon /></div>
      <div className={`${styles.check} ${selected ? styles.checkOn : ''}`}>
        {selected && (
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>
    </div>
  )
}
