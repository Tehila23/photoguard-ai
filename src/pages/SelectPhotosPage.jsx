import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar        from '../components/Navbar/Navbar.jsx'
import BottomNav     from '../components/BottomNav/BottomNav.jsx'
import PhotoCard     from '../components/PhotoCard/PhotoCard.jsx'
import PrimaryButton from '../components/PrimaryButton/PrimaryButton.jsx'
import styles        from './SelectPhotosPage.module.css'

const MONTHS = [
  { label: 'August 2024', ids: [0,1,2,3,4,5] },
  { label: 'July 2024',   ids: [6,7,8,9,10,11] },
  { label: 'June 2024',   ids: [12,13,14] },
]
const TOTAL = 46

export default function SelectPhotosPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(new Set([0,2,3,7]))

  const toggle = (id) => setSelected(prev => {
    const next = new Set(prev)
    next.has(id) ? next.delete(id) : next.add(id)
    return next
  })

  const count = selected.size

  return (
    <div className="app-shell">
      <Navbar
        title="Select Photos"
        showBack
        onBack={() => navigate('/dashboard')}
        rightContent={
          <button className={styles.allBtn}
            onClick={() => setSelected(new Set(MONTHS.flatMap(m => m.ids)))}>
            All
          </button>
        }
      />

      <main className="page-content" style={{ paddingBottom: 'calc(64px + 96px)' }}>
        {/* Counter */}
        <div className={styles.counterBar}>
          <div className={styles.counterLeft}>
            <div className={styles.counterDot} />
            <span className={styles.counterText}>{count} photos selected</span>
          </div>
          <span className={styles.counterTotal}>of {TOTAL}</span>
        </div>

        {/* Month sections */}
        {MONTHS.map(month => (
          <div key={month.label} className={styles.section}>
            <div className={styles.sectionLabel}>{month.label}</div>
            <div className={styles.grid}>
              {month.ids.map(id => (
                <PhotoCard key={id} id={id} selected={selected.has(id)} onToggle={toggle} />
              ))}
            </div>
          </div>
        ))}
      </main>

      {/* Bottom bar */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomRow}>
          <span className={styles.bottomCount}>
            {count === 0 ? 'No photos selected' : `${count} photos selected`}
          </span>
          {count > 0 && (
            <button className={styles.clearBtn} onClick={() => setSelected(new Set())}>
              Clear
            </button>
          )}
        </div>
        <PrimaryButton onClick={() => navigate('/analysis')} disabled={count === 0}>
          Confirm Selection{count > 0 ? ` (${count})` : ''}
        </PrimaryButton>
      </div>

      <BottomNav />
    </div>
  )
}
