import styles from './AnalysisCard.module.css'

const COLORS = [
  'linear-gradient(135deg,#dbeafe,#93c5fd)',
  'linear-gradient(135deg,#fef9c3,#fcd34d)',
  'linear-gradient(135deg,#fce7f3,#f9a8d4)',
  'linear-gradient(135deg,#dcfce7,#86efac)',
]

const TAG_STYLE = {
  Duplicate:   { bg: 'var(--color-red-pale)',     color: 'var(--color-red)',     label: '🔁 Duplicate' },
  Blurry:      { bg: 'var(--color-primary-pale)', color: 'var(--color-primary)', label: '💤 Blurry' },
  Screenshot:  { bg: 'var(--color-primary-pale)', color: 'var(--color-primary)', label: '📱 Screenshot' },
  Keep:        { bg: '#F0FDF4',                   color: '#22C55E',               label: '✅ Keep' },
}

export default function AnalysisCard({ id = 0, filename, date, size, reason = 'Duplicate', score, dimmed = false }) {
  const tag = TAG_STYLE[reason] ?? TAG_STYLE.Blurry
  const ringColor = reason === 'Keep' ? '#22C55E' : reason === 'Duplicate' ? 'var(--color-red)' : 'var(--color-primary)'
  return (
    <div className={styles.card} style={dimmed ? { opacity: .5 } : {}}>
      <div className={styles.thumb} style={{ background: COLORS[id % COLORS.length] }} />
      <div className={styles.info}>
        <div className={styles.filename}>{filename}</div>
        <div className={styles.meta}>{date} · {size}</div>
        <span className={styles.tag} style={{ background: tag.bg, color: tag.color }}>{tag.label}</span>
        <div className={styles.reason}>{reason === 'Keep' ? 'High quality, unique photo' : reason === 'Duplicate' ? 'Identical copy found' : reason === 'Blurry' ? 'Motion blur detected' : 'App screenshot, likely temp'}</div>
      </div>
      <div className={styles.scoreWrap}>
        <div className={styles.scoreRing} style={{ borderColor: ringColor, color: ringColor }}>{score}%</div>
        <span className={styles.scoreLbl}>{reason === 'Keep' ? 'Keep' : 'Delete'}</span>
      </div>
    </div>
  )
}
