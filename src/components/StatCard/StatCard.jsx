import { useNavigate } from 'react-router-dom'
import styles from './StatCard.module.css'

export default function StatCard({ icon, number, label, badge, badgeVariant = 'blue', linkTo }) {
  const navigate = useNavigate()
  return (
    <div className={styles.card} onClick={linkTo ? () => navigate(linkTo) : undefined} style={linkTo ? { cursor: 'pointer' } : {}}>
      <div className={styles.top}>
        <span className={styles.icon}>{icon}</span>
        {badge && <span className={`${styles.badge} ${styles[badgeVariant]}`}>{badge}</span>}
      </div>
      <div className={styles.num}>{number}</div>
      <div className={styles.label}>{label}</div>
      <div className={styles.divider} />
      <div className={styles.link}>View all <span>›</span></div>
    </div>
  )
}
