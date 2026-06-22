import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar({ title, subtitle, showBack, onBack, rightContent }) {
  const navigate = useNavigate()
  const handleBack = onBack || (() => navigate(-1))

  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        {showBack && (
          <button className={styles.backBtn} onClick={handleBack}>
            <ArrowLeft size={18} color="#0D0D1A" />
          </button>
        )}
      </div>
      <div className={styles.center}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      <div className={styles.right}>
        {rightContent}
      </div>
    </header>
  )
}