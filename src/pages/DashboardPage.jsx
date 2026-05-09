import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import styles    from './DashboardPage.module.css'

export default function DashboardPage() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">

      {/* ── NAVBAR ── */}
      <header className={styles.navbar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          </div>
          <span className={styles.brandName}>PhotoGuard AI</span>
        </div>
        <div className={styles.avatar}>S</div>
      </header>

      <main className={styles.body}>

        {/* ── HERO STATUS CARD ── */}
        <div className={styles.heroCard}>
          <div className={styles.heroGlow} />
          <div className={styles.heroTop}>
            <div className={styles.heroPill}>
              <span className={styles.heroPillDot} />
              Cleanup needed
            </div>
            <div className={styles.heroRight}>
              <span className={styles.heroPct}>38%</span>
              <span className={styles.heroPctLbl}>cleaned</span>
            </div>
          </div>
          <div className={styles.heroTitle}>3,812 photos</div>
          <div className={styles.heroMeta}>Last scan · 2 days ago</div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} />
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className={styles.statRow}>
          <div className={styles.statCard} onClick={() => navigate('/analysis')}>
            <div className={styles.statTop}>
              <div className={`${styles.statIconWrap} ${styles.iconBlue}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14"/>
                  <path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
                </svg>
              </div>
              <span className={`${styles.statBadge} ${styles.badgeBlue}`}>Review</span>
            </div>
            <div className={styles.statNum}>89</div>
            <div className={styles.statLbl}>Duplicates</div>
            <div className={styles.statDivider}/>
            <div className={styles.statLink}>View all <span>›</span></div>
          </div>

          <div className={styles.statCard} onClick={() => navigate('/review')}>
            <div className={styles.statTop}>
              <div className={`${styles.statIconWrap} ${styles.iconRed}`}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="var(--color-red)" strokeWidth="2" strokeLinecap="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/>
                  <path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </div>
              <span className={`${styles.statBadge} ${styles.badgeRed}`}>Approve</span>
            </div>
            <div className={styles.statNum}>273</div>
            <div className={styles.statLbl}>To delete</div>
            <div className={styles.statDivider}/>
            <div className={styles.statLink}>View all <span>›</span></div>
          </div>
        </div>

        {/* ── FLAGGED PREVIEW ── */}
        <div className={styles.flaggedSection}>
          <div className={styles.flaggedHeader}>
            <span className={styles.sectionEyebrow}>Flagged photos</span>
            <button className={styles.sectionLink} onClick={() => navigate('/select-photos')}>
              362 total →
            </button>
          </div>
          <div className={styles.thumbRow}>
            {[
              { tag:'DUP',  label:'Duplicate' },
              { tag:'BLUR', label:'Blurry' },
              { tag:'SCRN', label:'Screenshot' },
              { tag:'LOW',  label:'Low quality' },
            ].map(({ tag, label }) => (
              <div key={tag} className={styles.thumbCard}>
                <div className={styles.thumbImg} />
                <div className={styles.thumbMeta}>
                  <span className={styles.thumbTag}>{tag}</span>
                  <span className={styles.thumbLbl}>{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div className={styles.ctaWrap}>
          <button className={styles.cta} onClick={() => navigate('/select-photos')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="white" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            Start New Scan
          </button>
          <p className={styles.ctaNote}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke="var(--color-text-tertiary)" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
            Nothing deleted without your approval
          </p>
        </div>

      </main>

      <BottomNav />
    </div>
  )
}
