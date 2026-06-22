import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ActionIcon, Badge, Button, Card, Group, Stack } from '@mantine/core'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, ShieldCheck, ScanSearch, Sparkles, Images, Lock, WandSparkles } from 'lucide-react'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import '../styles/globals.css'
import styles from './SelectPhotosPage.module.css'

const PHOTOS = [
  { id: 1, month: 'aug', type: 'Family',     bg: 'linear-gradient(145deg,#6C47FF,#A78BFF)' },
  { id: 2, month: 'aug', type: 'Travel',     bg: 'linear-gradient(145deg,#B83A50,#F4899A)' },
  { id: 3, month: 'aug', type: 'Pet',        bg: 'linear-gradient(145deg,#00897B,#5DE8D5)' },
  { id: 4, month: 'aug', type: 'Screenshot', bg: 'linear-gradient(145deg,#C27A05,#FCD34D)' },
  { id: 5, month: 'jul', type: 'Similar',    bg: 'linear-gradient(145deg,#0D0D1A,#2D2D5E)' },
  { id: 6, month: 'jul', type: 'Memory',     bg: 'linear-gradient(145deg,#DB2777,#F472B6)' },
  { id: 7, month: 'jul', type: 'Event',      bg: 'linear-gradient(145deg,#0284C7,#7DD3FC)' },
  { id: 8, month: 'jul', type: 'Low light',  bg: 'linear-gradient(145deg,#374151,#9CA3AF)' },
]

export default function SelectPhotosPage() {
  const nav = useNavigate()
  const [sel, setSel] = useState(new Set([1, 3, 6]))

  const toggle = id => setSel(prev => {
    const n = new Set(prev)
    n.has(id) ? n.delete(id) : n.add(id)
    return n
  })

  const allSel = sel.size === PHOTOS.length
  const toggleAll = () => setSel(allSel ? new Set() : new Set(PHOTOS.map(p => p.id)))
  const count = sel.size

  const PhotoTile = ({ p, i }) => {
    const active = sel.has(p.id)

    return (
      <motion.button
        type="button"
        onClick={() => toggle(p.id)}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`${styles.photoTile} ${active ? styles.photoTileSelected : ''}`}
        aria-pressed={active}
      >
        <div className={styles.photoGradient} style={{ background: p.bg }} />
        <div className={styles.photoOverlay} />
        <div className={styles.checkControl}>
          {active && <Check size={15} color="white" strokeWidth={3} />}
        </div>
        <Badge className={styles.typeBadge} radius="xl" variant="light">
          {p.type}
        </Badge>
        <div className={styles.tileCaption}>
          <span>{p.type}</span>
          <small>{active ? 'Selected for scan' : 'Tap to include'}</small>
        </div>
      </motion.button>
    )
  }

  const aug = PHOTOS.filter(p => p.month === 'aug')
  const jul = PHOTOS.filter(p => p.month === 'jul')

  return (
    <div className="app-shell">
      <main className={styles.page}>
        <header className={styles.topbar}>
          <ActionIcon
            className={styles.backBtn}
            variant="subtle"
            radius="xl"
            size={42}
            aria-label="Back to dashboard"
            onClick={() => nav('/dashboard')}
          >
            <ArrowLeft size={18} />
          </ActionIcon>

          <div className={styles.titleBlock}>
            <h1 className={styles.pageTitle}>Photo Library</h1>
            <p className={styles.pageSubtitle}>Choose photos for smart scan</p>
          </div>

          <Button className={styles.allBtn} variant="subtle" radius="xl" size="xs" onClick={toggleAll}>
            {allSel ? 'Clear' : 'All'}
          </Button>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className={styles.heroWrap}
        >
          <Card className={styles.heroCard} radius="xl" shadow="none">
            <Stack gap={16}>
              <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
                <Stack gap={10} className={styles.heroCopy}>
                  <Badge className={styles.heroBadge} leftSection={<Sparkles size={12} />} radius="xl" variant="light">
                    Smart selection
                  </Badge>
                  <div>
                    <h2 className={styles.heroTitle}>Select memories for PhotoGuard to analyze.</h2>
                    <p className={styles.heroText}>
                      PhotoGuard protects meaningful moments while finding cleanup opportunities you can safely review.
                    </p>
                  </div>
                </Stack>
                <div className={styles.heroIcon}>
                  <Images size={28} strokeWidth={1.8} />
                </div>
              </Group>

              <Card className={styles.counterCard} radius="lg" shadow="none">
                <Group justify="space-between" align="center" wrap="nowrap">
                  <Group gap={10} wrap="nowrap">
                    <span className={styles.counterDot} />
                    <div>
                      <div className={styles.counterText}>{count} selected</div>
                      <div className={styles.counterSub}>Ready for protected AI scan</div>
                    </div>
                  </Group>
                  <Badge className={styles.counterTotal} radius="xl" variant="white">
                    {PHOTOS.length} photos
                  </Badge>
                </Group>
              </Card>
            </Stack>
          </Card>
        </motion.section>

        <Card className={styles.shieldCard} radius="xl" shadow="none">
          <Group gap={12} wrap="nowrap">
            <div className={styles.shieldIcon}>
              <ShieldCheck size={19} />
            </div>
            <div className={styles.shieldCopy}>
              <div className={styles.shieldTitle}>Memory Shield is active</div>
              <div className={styles.shieldText}>Protected categories stay out of cleanup suggestions.</div>
            </div>
          </Group>
        </Card>

        <section className={styles.section}>
          <Group justify="space-between" align="center" className={styles.sectionHeader}>
            <h2 className={styles.sectionLabel}>August 2024</h2>
            <Badge className={styles.monthBadge} variant="light" radius="xl">4 photos</Badge>
          </Group>
          <div className={styles.grid}>
            {aug.map((p, i) => <PhotoTile key={p.id} p={p} i={i} />)}
          </div>
        </section>

        <section className={styles.section}>
          <Group justify="space-between" align="center" className={styles.sectionHeader}>
            <h2 className={styles.sectionLabel}>July 2024</h2>
            <Badge className={styles.monthBadge} variant="light" radius="xl">4 photos</Badge>
          </Group>
          <div className={styles.grid}>
            {jul.map((p, i) => <PhotoTile key={p.id} p={p} i={i + aug.length} />)}
          </div>
        </section>
      </main>

      <Card className={styles.bottomBar} radius="xl" shadow="none">
        <Button
          className={styles.scanButton}
          leftSection={<ScanSearch size={18} />}
          rightSection={count > 0 ? <WandSparkles size={16} /> : null}
          radius="lg"
          size="md"
          disabled={count === 0}
          onClick={() => count > 0 && nav('/analysis')}
        >
          Analyze {count > 0 ? `${count} photo${count > 1 ? 's' : ''}` : 'photos'}
        </Button>
        <p className={styles.safeNote}>
          <Lock size={12} /> No photo is removed during this step
        </p>
      </Card>

      <BottomNav />
    </div>
  )
}