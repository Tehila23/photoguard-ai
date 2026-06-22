import { Accordion, Badge, Button, Card } from '@mantine/core'
import { motion } from 'framer-motion'
import { ArrowLeft, CalendarDays, ChevronRight, Heart, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import styles from './MemoriesPage.module.css'

const TIMELINE = [
  { year: '2025', memories: ['Wedding photos', 'Summer vacation', 'Family moments'] },
  { year: '2024', memories: ['Pet memories', 'Travel photos', 'Celebrations'] },
  { year: '2023', memories: ['Family archive', 'Important memories'] },
]

const ARCHIVE = [
  { title: 'Family', count: 124, tone: 'blue' },
  { title: 'Travel', count: 68, tone: 'cyan' },
  { title: 'Pets', count: 42, tone: 'green' },
]

export default function MemoriesPage() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <main className={styles.page}>
        <header className={styles.header}>
          <Button className={styles.backButton} variant="subtle" radius="xl" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={17} />
          </Button>
          <div>
            <h1>Memories</h1>
            <p>Preserved moments, organized gently.</p>
          </div>
        </header>

        <motion.section className={styles.memoryHero} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.heroVisual}>
            <Badge className={styles.heroBadge} leftSection={<ShieldCheck size={12} />} radius="xl">
              Memory of the Day
            </Badge>
          </div>
          <div className={styles.heroCopy}>
            <h2>Family Trip to Eilat</h2>
            <p>2 years ago today</p>
            <span>Protected by Memory Shield</span>
          </div>
        </motion.section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Timeline</span>
              <h2>Memory Timeline</h2>
            </div>
            <CalendarDays size={18} />
          </div>
          <Accordion
            defaultValue="2025"
            variant="separated"
            radius="lg"
            classNames={{
              root: styles.accordion,
              item: styles.accordionItem,
              control: styles.accordionControl,
              panel: styles.accordionPanel,
              content: styles.accordionContent,
              chevron: styles.accordionChevron,
            }}
          >
            {TIMELINE.map(group => (
              <Accordion.Item key={group.year} value={group.year}>
                <Accordion.Control>{group.year}</Accordion.Control>
                <Accordion.Panel>
                  <div className={styles.memoryList}>
                    {group.memories.map(memory => (
                      <button
                        key={memory}
                        type="button"
                        className={styles.memoryRow}
                        onClick={() => navigate('/insights')}
                        aria-label={`Open insights for ${memory}`}
                      >
                        <Heart size={15} />
                        <span>{memory}</span>
                        <ChevronRight size={14} />
                      </button>
                    ))}
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Archive</span>
              <h2>Memory Archive</h2>
            </div>
          </div>
          <div className={styles.archiveGrid}>
            {ARCHIVE.map(item => (
              <Card key={item.title} className={`${styles.archiveCard} ${styles[item.tone]}`} radius="xl" shadow="none">
                <strong>{item.count}</strong>
                <span>{item.title}</span>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}
