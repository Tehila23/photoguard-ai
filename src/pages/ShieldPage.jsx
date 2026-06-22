import { Badge, Button, Group, Stack } from '@mantine/core'
import { motion } from 'framer-motion'
import { ArrowLeft, Camera, FileText, Heart, PawPrint, Plane, ShieldCheck, Sparkles, Star, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import { useMemoryShieldPreferences } from '../hooks/useMemoryShieldPreferences'
import styles from './ShieldPage.module.css'

const OPTIONS = [
  { id: 'family', label: 'Family photos', Icon: Users },
  { id: 'wedding', label: 'Wedding photos', Icon: Camera },
  { id: 'pets', label: 'Pet memories', Icon: PawPrint },
  { id: 'travel', label: 'Travel memories', Icon: Plane },
  { id: 'documents', label: 'Documents', Icon: FileText },
  { id: 'favorites', label: 'Favorites', Icon: Star },
]

export default function ShieldPage() {
  const navigate = useNavigate()
  const {
    preferences: selected,
    loading,
    error,
    savePreferences,
    togglePreference,
    resetPreferences,
  } = useMemoryShieldPreferences()

  const selectedOptions = OPTIONS.filter(option => selected.includes(option.id))

  return (
    <div className="app-shell">
      <main className={styles.page}>
        <header className={styles.header}>
          <Button className={styles.backButton} variant="subtle" radius="xl" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={17} />
          </Button>
          <div>
            <h1>Smart Memory Shield</h1>
            <p>Choose what PhotoGuard always protects.</p>
          </div>
        </header>

        <motion.section className={styles.hero} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.heroIcon}><ShieldCheck size={24} /></div>
          <Badge className={styles.heroBadge} radius="xl">{selected.length} active</Badge>
          <h2>Protected before cleanup</h2>
          <p>PhotoGuard avoids suggesting protected categories for removal. Your choices stay saved securely with your account.</p>
        </motion.section>

        {error && (
          <section className={styles.inlineError}>
            {error}
          </section>
        )}

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Selected categories</span>
            <h2>Currently protected</h2>
          </div>
          {selectedOptions.length > 0 ? (
            <div className={styles.selectedList}>
              {selectedOptions.map(({ id, label, Icon }) => (
                <div key={id} className={styles.selectedItem}>
                  <span><Icon size={16} /></span>
                  <strong>{label}</strong>
                  <small>Protected</small>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <Heart size={20} />
              <p>No protected categories yet. Choose what matters most below.</p>
            </div>
          )}
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <span>Customize</span>
            <h2>Protection preferences</h2>
          </div>
          <div className={styles.preferenceGrid}>
            {OPTIONS.map(({ id, label, Icon }) => {
              const active = selected.includes(id)
              return (
                <button
                  key={id}
                  type="button"
                  className={`${styles.preferenceChip} ${active ? styles.preferenceChipActive : ''}`}
                  onClick={() => togglePreference(id)}
                  aria-pressed={active}
                  disabled={loading}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {active && <ShieldCheck size={14} />}
                </button>
              )
            })}
          </div>
          <Group grow gap="sm" mt="md">
            <Button className={styles.secondaryButton} variant="default" radius="lg" onClick={resetPreferences} loading={loading}>
              Clear all
            </Button>
            <Button className={styles.primaryButton} leftSection={<Sparkles size={16} />} radius="lg" onClick={async () => {
              await savePreferences(selected)
              navigate('/dashboard')
            }}>
              Save
            </Button>
          </Group>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}
