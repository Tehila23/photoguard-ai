import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar              from '../components/Navbar/Navbar.jsx'
import BottomNav           from '../components/BottomNav/BottomNav.jsx'
import ConfirmationModal   from '../components/ConfirmationModal/ConfirmationModal.jsx'
import styles              from './ReviewPage.module.css'

const PHOTOS = [
  { filename:'IMG_4821.jpg', date:'Aug 12, 2024', size:'4.2 MB', reason:'Duplicate',  score:92, bg:'linear-gradient(135deg,#dbeafe,#93c5fd)' },
  { filename:'IMG_3302.jpg', date:'Jul 4, 2024',  size:'2.8 MB', reason:'Blurry',     score:85, bg:'linear-gradient(135deg,#fef9c3,#fcd34d)' },
  { filename:'Screenshot_0812.png', date:'Aug 8, 2024', size:'1.1 MB', reason:'Screenshot', score:71, bg:'linear-gradient(135deg,#ede9fe,#c4b5fd)' },
]

export default function ReviewPage() {
  const navigate = useNavigate()
  const [index,   setIndex]   = useState(0)
  const [showModal, setShowModal] = useState(false)

  const photo = PHOTOS[index]
  const isLast = index === PHOTOS.length - 1

  const handleKeep = () => {
    if (isLast) navigate('/dashboard')
    else setIndex(i => i + 1)
  }
  const handleDelete = () => setShowModal(true)
  const handleConfirm = () => {
    setShowModal(false)
    if (isLast) navigate('/dashboard')
    else setIndex(i => i + 1)
  }

  return (
    <div className="app-shell">
      <Navbar
        title="Review"
        showBack
        onBack={() => navigate('/analysis')}
        rightContent={<span className={styles.counter}>{index + 1} of {PHOTOS.length}</span>}
      />

      <main className="page-content" style={{ paddingBottom: 'calc(80px + 100px)' }}>
        {/* Preview */}
        <div className={styles.previewWrap}>
          <div className={styles.previewImg} style={{ background: photo.bg }}>
            <span className={styles.previewLbl}>[ Photo Preview ]</span>
          </div>
          <div className={styles.previewOverlay}>
            <div className={styles.previewFilename}>{photo.filename}</div>
            <div className={styles.previewMeta}>{photo.date} · {photo.size}</div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className={styles.recPanel}>
          <div className={styles.recIcon}>
            {photo.reason === 'Duplicate' ? '🔁' : photo.reason === 'Blurry' ? '💤' : '📱'}
          </div>
          <div className={styles.recBody}>
            <div className={styles.recTitle}>{photo.reason} Detected</div>
            <div className={styles.recReason}>
              {photo.reason === 'Duplicate' ? 'An identical copy of this photo already exists in your library.'
               : photo.reason === 'Blurry' ? 'Significant motion blur was detected in this photo.'
               : 'This appears to be an app screenshot that may no longer be needed.'}
            </div>
            <div className={styles.recScore}>AI confidence: {photo.score}% · Suggested: Delete</div>
          </div>
        </div>

        {/* Dots */}
        <div className={styles.dots}>
          {PHOTOS.map((_, i) => (
            <div key={i} className={`${styles.dot} ${i === index ? styles.dotActive : ''}`} />
          ))}
        </div>

        {/* Safe note */}
        <p className={styles.safeNote}>🔒 Photo will not be deleted without your confirmation</p>
      </main>

      {/* Action Buttons */}
      <div className={styles.actionBar}>
        <button className={styles.btnKeep} onClick={handleKeep}>✓ Keep</button>
        <button className={styles.btnDelete} onClick={handleDelete}>✕ Delete</button>
      </div>

      {showModal && (
        <ConfirmationModal
          filename={photo.filename}
          onConfirm={handleConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}

      <BottomNav />
    </div>
  )
}
