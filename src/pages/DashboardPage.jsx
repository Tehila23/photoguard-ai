import { useNavigate } from 'react-router-dom'
import { Badge, Button } from '@mantine/core'
import { motion } from 'framer-motion'
import {
  Archive,
  BarChart3,
  ChevronRight,
  Eye,
  Heart,
  ScanSearch,
  Settings,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import { useMemoryShieldPreferences } from '../hooks/useMemoryShieldPreferences'
import '../styles/globals.css'
import styles from './DashboardPage.module.css'

const PROTECTED_LABELS = {
  family: 'Family photos',
  wedding: 'Wedding photos',
  pets: 'Pet memories',
  travel: 'Travel memories',
  documents: 'Documents',
  favorites: 'Favorites',
}

const STATS = [
  { label: 'Protected', value: 124, Icon: ShieldCheck, color: '#12A594', path: '/shield' },
  { label: 'Review', value: 89, Icon: Eye, color: '#6472E8', path: '/analysis' },
  { label: 'Safe', value: 273, Icon: Archive, color: '#C98A19', path: '/review' },
]

const SHORTCUTS = [
  { label: 'Memories', path: '/memories', Icon: Heart },
  { label: 'Insights', path: '/insights', Icon: BarChart3 },
  { label: 'Settings', path: '/settings', Icon: Settings },
]

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] },
})

export default function DashboardPage() {
  const navigate = useNavigate()
  const { preferences } = useMemoryShieldPreferences()
  const protectedCategories = preferences
      .map(id => PROTECTED_LABELS[id])
      .filter(Boolean)
      .slice(0, 4)

  return (
    <div className="app-shell">
      <main className={styles.page}>
        <header className={styles.header}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <Sparkles size={19} />
            </div>
            <div>
              <h1>PhotoGuard AI</h1>
              <p>Protect meaningful photos before cleanup.</p>
            </div>
          </div>
          <div className={styles.avatar}>T</div>
        </header>

        <motion.section {...up()} className={styles.hero}>
          <div className={styles.heroVisual}>
            <div className={styles.heroTileLarge} />
            <div className={styles.heroTileWarm} />
            <div className={styles.heroTileCool} />
          </div>

          <div className={styles.heroContent}>
            <Badge className={styles.heroBadge} leftSection={<ShieldCheck size={12} />} radius="xl">
              Memory Shield active
            </Badge>
            <h2>Clean your gallery. Keep every memory.</h2>
            <p>PhotoGuard protects meaningful photos before suggesting cleanup.</p>
            <Button
              className={styles.heroCta}
              leftSection={<ScanSearch size={18} />}
              radius="lg"
              onClick={() => navigate('/select-photos')}
            >
              Run Smart Scan
            </Button>
          </div>
        </motion.section>

        <motion.section {...up(0.05)} className={styles.statsGrid} aria-label="Key stats">
          {STATS.map(({ label, value, Icon, color, path }) => (
            <button
              key={label}
              type="button"
              className={styles.statCard}
              style={{ '--stat-color': color }}
              onClick={() => navigate(path)}
              aria-label={`Open ${label}`}
            >
              <Icon size={17} />
              <strong>{value}</strong>
              <span>{label}</span>
            </button>
          ))}
        </motion.section>

        <motion.section {...up(0.09)} className={styles.shieldPreview}>
          <div className={styles.sectionTop}>
            <div>
              <span>Smart Memory Shield</span>
              <h2>Protected categories</h2>
            </div>
            <Badge className={styles.softBadge} radius="xl">
              {protectedCategories.length} active
            </Badge>
          </div>

          {protectedCategories.length > 0 ? (
            <div className={styles.chipRow}>
              {protectedCategories.map(label => (
                <span key={label} className={styles.memoryChip}>
                  <ShieldCheck size={13} />
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>No protected categories yet.</p>
          )}

          <Button
            className={styles.secondaryButton}
            radius="lg"
            rightSection={<ChevronRight size={15} />}
            onClick={() => navigate('/shield')}
          >
            Customize protection
          </Button>
        </motion.section>

        <motion.section {...up(0.12)} className={styles.explore}>
          <div className={styles.exploreLabel}>Explore more</div>
          <div className={styles.exploreRow}>
            {SHORTCUTS.map(({ label, path, Icon }) => (
              <button
                key={path}
                type="button"
                className={styles.exploreButton}
                onClick={() => navigate(path)}
                aria-label={`Open ${label}`}
              >
                <Icon size={17} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  )
}
