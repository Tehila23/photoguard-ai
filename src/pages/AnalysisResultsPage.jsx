import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar       from '../components/Navbar/Navbar.jsx'
import BottomNav    from '../components/BottomNav/BottomNav.jsx'
import AnalysisCard from '../components/AnalysisCard/AnalysisCard.jsx'
import PrimaryButton from '../components/PrimaryButton/PrimaryButton.jsx'
import styles       from './AnalysisResultsPage.module.css'

const RESULTS = [
  { id:0, filename:'IMG_4821.jpg', date:'Aug 12, 2024', size:'4.2 MB', reason:'Duplicate',  score:92 },
  { id:1, filename:'IMG_3302.jpg', date:'Jul 4, 2024',  size:'2.8 MB', reason:'Blurry',     score:85 },
  { id:2, filename:'Screenshot_0812.png', date:'Aug 8, 2024', size:'1.1 MB', reason:'Screenshot', score:71 },
  { id:3, filename:'IMG_5500.jpg', date:'Aug 15, 2024', size:'5.6 MB', reason:'Keep',       score:98, dimmed:true },
]

export default function AnalysisResultsPage() {
  const navigate  = useNavigate()
  const [loading] = useState(false)

  if (loading) return (
    <div className="app-shell">
      <Navbar title="Analysis" showBack onBack={() => navigate('/select-photos')} />
      <main className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <div className={styles.loadingTitle}>Analyzing images…</div>
        <div className={styles.loadingSub}>Scanning 4 photos for issues</div>
        <div className={styles.progressTrack}><div className={styles.progressFill} /></div>
        <div className={styles.progressLbl}>2 of 4 done</div>
      </main>
    </div>
  )

  const toDelete = RESULTS.filter(r => r.reason !== 'Keep').length

  return (
    <div className="app-shell">
      <Navbar
        title="AI Analysis Results"
        showBack
        onBack={() => navigate('/select-photos')}
        rightContent={<span className={styles.badge}>{RESULTS.length} items</span>}
      />
      <main className="page-content" style={{ paddingBottom: 'calc(80px + 72px)' }}>
        <div className={styles.summaryStrip}>
          <div className={`${styles.sumBox} ${styles.red}`}>
            <span className={styles.sumNum}>{toDelete}</span>
            <span className={styles.sumLbl}>Delete</span>
          </div>
          <div className={`${styles.sumBox} ${styles.blue}`}>
            <span className={styles.sumNum}>1</span>
            <span className={styles.sumLbl}>Review</span>
          </div>
          <div className={`${styles.sumBox} ${styles.green}`}>
            <span className={styles.sumNum}>1</span>
            <span className={styles.sumLbl}>Keep</span>
          </div>
        </div>

        {RESULTS.map(r => <AnalysisCard key={r.id} {...r} />)}

        <div className={styles.footerRow}>
          <span className={styles.footerLbl}>{toDelete} suggested for deletion</span>
          <button className={styles.sortBtn}>Sort ↕</button>
        </div>
      </main>

      <div className={styles.bottomBar}>
        <PrimaryButton variant="danger" onClick={() => navigate('/review')}>
          Review Before Delete →
        </PrimaryButton>
        <p className={styles.safeNote}>🔒 No photos deleted without your approval</p>
      </div>

      <BottomNav />
    </div>
  )
}
