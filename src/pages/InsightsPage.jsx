import { Badge, Button, Card, Progress } from '@mantine/core'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Archive,
  Bot,
  ChevronRight,
  Copy,
  Database,
  Image as ImageIcon,
  LineChart,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Wrench,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import styles from './InsightsPage.module.css'

const CATEGORIES = [
  { label: 'Family', value: 42, color: '#6472e8' },
  { label: 'Travel', value: 23, color: '#48c7d9' },
  { label: 'Pets', value: 18, color: '#12a594' },
  { label: 'Events', value: 17, color: '#b84a5f' },
]

const HABITS = [
  'Duplicates are usually reviewed first',
  'Screenshots are the safest cleanup category',
  'Protected memories stay out of removal suggestions',
]

const AGENT_ACTIONS = [
  {
    action: 'Memory Shield preferences loaded',
    detail: 'Read protected categories from the user profile resources.',
    status: 'Resource',
    time: 'Just now',
    Icon: Database,
  },
  {
    action: 'Protected categories updated',
    detail: 'Saved the latest Memory Shield choices for future scans.',
    status: 'Tool',
    time: '1 min ago',
    Icon: Wrench,
  },
  {
    action: 'Photo library scanned',
    detail: 'Prepared cleanup candidates while keeping protected memories separate.',
    status: 'Tool',
    time: '2 min ago',
    Icon: ScanSearch,
  },
  {
    action: 'Analysis results prepared',
    detail: 'Grouped duplicates, screenshots, and low-risk cleanup suggestions.',
    status: 'Tool',
    time: '3 min ago',
    Icon: Sparkles,
  },
  {
    action: 'Cleanup queue updated',
    detail: 'Moved approved items into a reversible cleanup queue.',
    status: 'Tool',
    time: '4 min ago',
    Icon: Archive,
  },
  {
    action: 'User approval required before removal',
    detail: 'PhotoGuard waits for confirmation before anything feels final.',
    status: 'User Approval',
    time: 'Always on',
    Icon: UserCheck,
  },
]

export default function InsightsPage() {
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <main className={styles.page}>
        <header className={styles.header}>
          <Button className={styles.backButton} variant="subtle" radius="xl" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={17} />
          </Button>
          <div>
            <h1>Insights</h1>
            <p>Memory patterns and safe cleanup recovery.</p>
          </div>
        </header>

        <motion.section className={styles.hero} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className={styles.heroIcon}><LineChart size={24} /></div>
          <Badge className={styles.heroBadge} radius="xl">AI summary</Badge>
          <h2>Your library is mostly meaningful memories.</h2>
          <p>PhotoGuard separates protected moments from cleanup suggestions before review.</p>
        </motion.section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Overview</span>
              <h2>Memory Categories</h2>
            </div>
          </div>
          <div className={styles.categoryRows}>
            {CATEGORIES.map(category => (
              <div key={category.label} className={styles.categoryRow}>
                <div className={styles.categoryTopline}>
                  <span>{category.label}</span>
                  <strong>{category.value}%</strong>
                </div>
                <Progress value={category.value} color={category.color} radius="xl" size="sm" />
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Recovery</span>
              <h2>Storage Recovery</h2>
            </div>
            <Archive size={18} />
          </div>
          <div className={styles.recoveryGrid}>
            <Card className={styles.recoveryPrimary} radius="xl" shadow="none">
              <span>Recoverable space</span>
              <strong>1.8 GB</strong>
            </Card>
            <Card className={styles.recoveryCard} radius="xl" shadow="none">
              <Copy size={16} />
              <strong>47</strong>
              <span>Duplicates</span>
            </Card>
            <Card className={styles.recoveryCard} radius="xl" shadow="none">
              <ImageIcon size={16} />
              <strong>32</strong>
              <span>Screenshots</span>
            </Card>
          </div>
          <Button
            className={styles.primaryButton}
            leftSection={<ScanSearch size={17} />}
            rightSection={<ChevronRight size={15} />}
            radius="lg"
            onClick={() => navigate('/analysis')}
          >
            Review suggestions
          </Button>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Habits</span>
              <h2>AI cleanup habits</h2>
            </div>
            <Sparkles size={18} />
          </div>
          <div className={styles.habitList}>
            {HABITS.map(habit => (
              <div key={habit} className={styles.habitItem}>
                <span />
                <p>{habit}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div>
              <span>Agentic AI</span>
              <h2>AI Agent Activity</h2>
              <p>PhotoGuard uses tools and resources to help protect your memories.</p>
            </div>
            <Bot size={18} />
          </div>

          <div className={styles.agentTimeline}>
            {AGENT_ACTIONS.map(({ action, detail, status, time, Icon }) => (
              <div key={action} className={styles.agentItem}>
                <div className={styles.agentIcon}>
                  <Icon size={15} />
                </div>
                <div className={styles.agentCopy}>
                  <div className={styles.agentTopline}>
                    <strong>{action}</strong>
                    <span>{time}</span>
                  </div>
                  <p>{detail}</p>
                </div>
                <Badge className={styles.agentBadge} radius="xl" data-status={status}>
                  {status}
                </Badge>
              </div>
            ))}
          </div>

          <Card className={styles.mcpCard} radius="xl" shadow="none">
            <div className={styles.mcpIcon}>
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3>How this relates to MCP</h3>
              <div className={styles.mcpGrid}>
                <span>Host</span>
                <strong>PhotoGuard AI</strong>
                <span>Tools</span>
                <strong>Smart scan, cleanup queue, preference update</strong>
                <span>Resources</span>
                <strong>Supabase Auth, Database, Storage</strong>
                <span>User approval</span>
                <strong>Nothing is deleted automatically</strong>
              </div>
            </div>
          </Card>
        </section>
      </main>
      <BottomNav />
    </div>
  )
}
