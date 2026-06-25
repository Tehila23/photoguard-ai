import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionIcon, Alert, Badge, Button, Card, Group, Modal, Stack } from '@mantine/core'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, Trash2, ShieldCheck, MinusCircle, Image as ImageIcon, RotateCcw, ClipboardCheck, Gauge } from 'lucide-react'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import { useReviewDecisions } from '../hooks/useReviewDecisions'
import styles from './ReviewPage.module.css'

const PHOTOS = [
  {
    filename: 'IMG_4821.jpg',
    date: 'Aug 12, 2024',
    size: '4.2 MB',
    reason: 'Duplicate detected',
    score: 92,
    protectionScore: 68,
    finalRecommendation: 'Safe to review for cleanup',
    explanation: 'This looks like a low-risk cleanup candidate.',
    reasons: ['Duplicate detected', 'Similar moment', 'Safe cleanup candidate', 'User approval required'],
    bg: 'linear-gradient(145deg,#6C47FF,#A78BFF)',
    note: 'An identical copy of this photo already exists in your library. Safe to remove.',
    accent: '#6C47FF',
    panelBg: '#F0ECFF',
    panelBorder: 'rgba(108,71,255,.14)',
    protected: false,
  },
  {
    filename: 'IMG_3302.jpg',
    date: 'Jul 4, 2024',
    size: '2.8 MB',
    reason: 'Motion blur detected',
    score: 85,
    protectionScore: 34,
    finalRecommendation: 'Safe to review for cleanup',
    explanation: 'This looks like a low-risk cleanup candidate.',
    reasons: ['Low quality capture', 'Motion blur', 'No faces detected', 'Safe cleanup candidate'],
    bg: 'linear-gradient(145deg,#E8445A,#F4899A)',
    note: 'Significant blur was detected. This photo may not be worth keeping.',
    accent: '#B83A50',
    panelBg: '#FFF2F4',
    panelBorder: 'rgba(184,58,80,.14)',
    protected: false,
  },
  {
    filename: 'IMG_5500.jpg',
    date: 'Aug 15, 2024',
    size: '5.6 MB',
    reason: 'Protected memory',
    score: 98,
    protectionScore: 96,
    finalRecommendation: 'Recommended to keep',
    explanation: 'This photo may have sentimental value.',
    reasons: ['Contains people', 'Only copy found', 'High image quality', 'Meaningful event'],
    bg: 'linear-gradient(145deg,#00BFA5,#5DE8D5)',
    note: 'PhotoGuard has identified this as a meaningful memory. Removal is disabled.',
    accent: '#00897B',
    panelBg: '#E8FAF7',
    panelBorder: 'rgba(0,137,123,.18)',
    protected: true,
  },
]

export default function ReviewPage() {
  const nav = useNavigate()
  const [idx, setIdx] = useState(0)
  const [modal, setModal] = useState(false)
  const [dir, setDir] = useState(1)
  const [queuedPhoto, setQueuedPhoto] = useState(null)
  const {
    cleanupQueue,
    error: reviewError,
    clearError,
    saveDecision,
  } = useReviewDecisions(PHOTOS)

  const p = PHOTOS[idx]

  const advance = (d = 1) => {
    setQueuedPhoto(null)
    setDir(d)
    if (idx < PHOTOS.length - 1) setIdx(i => i + 1)
    else nav('/dashboard')
  }

  const keepPhoto = async () => {
    const { error } = await saveDecision(p, 'keep', p.reason)
    if (!error) advance(1)
  }

  const protectPhoto = async () => {
    const { error } = await saveDecision(p, 'protected', p.reason)
    if (!error) advance(1)
  }

  const moveToCleanupQueue = async () => {
    clearError()
    setQueuedPhoto(p)
    setModal(false)

    const { error } = await saveDecision(p, 'remove', p.reason)
    if (error) setQueuedPhoto(null)
  }

  const undoCleanupQueue = async () => {
    if (!queuedPhoto) return
    const photoToRestore = queuedPhoto
    setQueuedPhoto(null)

    const { error } = await saveDecision(photoToRestore, 'undo', 'User restored this photo from the cleanup queue.')
    if (error) setQueuedPhoto(photoToRestore)
  }

  return (
    <div className="app-shell">
      <main className={styles.page}>
        <header className={styles.topbar}>
          <ActionIcon
            className={styles.backBtn}
            variant="subtle"
            radius="xl"
            size={42}
            aria-label="Back to analysis"
            onClick={() => nav('/analysis')}
          >
            <ArrowLeft size={18} />
          </ActionIcon>
          <div className={styles.titleBlock}>
            <h1 className={styles.navTitle}>Final Review</h1>
            <p className={styles.navSubtitle}>Confirm safe cleanup suggestions</p>
          </div>
          <Badge className={styles.counter} variant="light" radius="xl">
            {idx + 1} / {PHOTOS.length}
          </Badge>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: dir * 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -28 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={styles.previewWrap}
          >
            <div className={styles.previewGradient} style={{ background: p.bg }} />
            <div className={styles.previewOverlay} />

            {p.protected && (
              <Badge
                className={styles.protectedBadge}
                leftSection={<ShieldCheck size={13} />}
                radius="xl"
                variant="light"
              >
                Memory Shield
              </Badge>
            )}

            <ImageIcon className={styles.previewIcon} size={62} strokeWidth={1.15} />

            <div className={styles.previewFileInfo}>
              <span className={styles.previewFilename}>{p.filename}</span>
              <span className={styles.previewMeta}>{p.date} · {p.size}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`rec-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.08, duration: 0.28 }}
          >
            <Card
              className={styles.recPanel}
              radius="xl"
              shadow="none"
              style={{ background: p.panelBg, borderColor: p.panelBorder }}
            >
              <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
                <Stack gap={4} className={styles.recCopy}>
                  <div className={styles.recLabel} style={{ color: p.accent }}>
                    {p.reason}
                  </div>
                  <div className={styles.recNote}>{p.note}</div>
                </Stack>
                <Badge className={styles.scoreBadge} variant="white" radius="xl">
                  {p.score}%
                </Badge>
              </Group>
              <div className={styles.recScore}>
                AI confidence · {p.protected ? 'Suggested: Keep' : 'Suggested: Review removal'}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={`why-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.12, duration: 0.28 }}
          >
            <Card className={styles.explainCard} radius="xl" shadow="none">
              <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
                <div>
                  <div className={styles.explainTitle}>Why PhotoGuard suggests this</div>
                  <p>{p.explanation}</p>
                </div>
                <span className={styles.explainIcon}>
                  <Gauge size={17} />
                </span>
              </Group>

              <div className={styles.scoreGrid}>
                <div>
                  <span>Confidence score</span>
                  <strong>{p.score}%</strong>
                </div>
                <div>
                  <span>Memory Protection Score</span>
                  <strong>{p.protectionScore}%</strong>
                </div>
              </div>

              <div className={styles.reasonChips}>
                {p.reasons.map(reason => (
                  <span key={reason}>{reason}</span>
                ))}
              </div>

              <Badge
                className={styles.finalRecommendation}
                radius="xl"
                variant="light"
                style={{ color: p.accent, background: p.panelBg }}
              >
                {p.finalRecommendation}
              </Badge>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className={styles.dots} aria-label="Review progress">
          {PHOTOS.map((_, i) => (
            <div
              key={i}
              className={`${styles.dot} ${i === idx ? styles.activeDot : ''}`}
              style={{ width: i === idx ? 22 : 7 }}
            />
          ))}
        </div>

        <p className={styles.safetyLine}>
          Nothing is deleted automatically. You approve every cleanup action.
        </p>
      </main>

      <Card className={styles.actionBar} radius="xl" shadow="none">
        {reviewError && (
          <Alert className={styles.reviewError} color="red" variant="light">
            Could not save your review decision. Please try again.
          </Alert>
        )}
        {queuedPhoto ? (
          <Stack gap={11}>
            <Badge className={styles.queueCounter} radius="xl" variant="light">
              {cleanupQueue.length} item{cleanupQueue.length === 1 ? '' : 's'} in cleanup queue
            </Badge>
            <Group gap={10} wrap="nowrap" align="flex-start">
              <span className={styles.queueIcon}><ClipboardCheck size={18} /></span>
              <div className={styles.queueCopy}>
                <strong>Moved to Cleanup Queue</strong>
                <p>You can undo this before final cleanup. Nothing is deleted automatically.</p>
              </div>
            </Group>
            <Group className={styles.btnRow} grow gap="sm" wrap="nowrap">
              <Button
                className={styles.btnUndo}
                leftSection={<RotateCcw size={17} strokeWidth={2.2} />}
                radius="lg"
                size="md"
                variant="light"
                onClick={undoCleanupQueue}
              >
                Undo
              </Button>
              <Button
                className={styles.btnContinue}
                radius="lg"
                size="md"
                onClick={() => advance(1)}
              >
                Continue review
              </Button>
            </Group>
          </Stack>
        ) : (
          <Stack gap={10}>
            <p className={styles.safetyCaption}>
              Safe final review. Nothing is removed automatically.
            </p>
            <Group className={styles.btnRow} grow gap="sm" wrap="nowrap">
              <Button
                className={styles.btnKeep}
                leftSection={<Check size={17} strokeWidth={2.4} />}
                radius="lg"
                size="md"
                variant="light"
                onClick={keepPhoto}
              >
                Keep
              </Button>

              {p.protected ? (
                <Button
                  className={styles.btnRemoveDisabled}
                  leftSection={<ShieldCheck size={17} strokeWidth={2} />}
                  radius="lg"
                  size="md"
                  variant="light"
                  onClick={protectPhoto}
                >
                  Protected
                </Button>
              ) : (
                <Button
                  className={styles.btnRemove}
                  leftSection={<MinusCircle size={17} strokeWidth={2} />}
                  radius="lg"
                  size="md"
                  onClick={() => setModal(true)}
                >
                  Approve Removal
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Card>

      <Modal
        opened={modal}
        onClose={() => setModal(false)}
        centered
        radius="xl"
        size="sm"
        title="Remove this photo?"
        classNames={{
          content: styles.modalContent,
          header: styles.modalHeader,
          title: styles.modalTitle,
          body: styles.modalBodyWrap,
        }}
      >
        <Stack align="center" gap="sm">
          <div className={styles.modalIcon}>
            <Trash2 size={25} color="#B83A50" strokeWidth={1.8} />
          </div>
          <p className={styles.modalFilename}>{p.filename}</p>
          <p className={styles.modalBody}>
            This is the final checkpoint. Confirm only if this photo is not a meaningful memory.
          </p>
          <Group className={styles.modalBtns} grow gap="sm" wrap="nowrap">
            <Button className={styles.modalCancel} variant="default" radius="lg" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button
              className={styles.modalConfirm}
              radius="lg"
              onClick={moveToCleanupQueue}
            >
              Remove
            </Button>
          </Group>
        </Stack>
      </Modal>

      <BottomNav />
    </div>
  )
}
