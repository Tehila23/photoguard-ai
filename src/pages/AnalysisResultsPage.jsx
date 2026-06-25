import { useNavigate } from 'react-router-dom'
import { ActionIcon, Badge, Button, Card, Group, Stack } from '@mantine/core'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Eye, Archive, Sparkles, Image, CheckCircle2, Lock, Gauge, HardDrive, Copy, Images } from 'lucide-react'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import '../styles/globals.css'
import styles from './AnalysisResultsPage.module.css'

const SUMMARY = [
  { label: 'Photos analyzed', value: '492', Icon: Images, tone: 'violet' },
  { label: 'Recoverable space', value: '1.8 GB', Icon: HardDrive, tone: 'teal' },
  { label: 'Duplicates found', value: '47', Icon: Copy, tone: 'amber' },
  { label: 'Confidence score', value: '92%', Icon: Gauge, tone: 'blue' },
]

const RESULTS = [
  {
    id: 1,
    filename: 'IMG_4821.jpg',
    meta: 'Aug 12 · 4.2 MB',
    title: 'Similar photo detected',
    reason: 'Looks nearly identical to 4 other photos from the same moment.',
    status: 'Needs review',
    score: 92,
    protectionScore: 68,
    recommendation: 'Safe to review for cleanup',
    explanation: 'This looks like a low-risk cleanup candidate.',
    reasons: ['Duplicate detected', 'Similar moment', 'Safe cleanup candidate', 'User approval required'],
    accent: '#6C47FF',
    pale: '#F0ECFF',
    thumbBg: 'linear-gradient(145deg,#6C47FF,#A78BFF)',
    Icon: Eye,
  },
  {
    id: 2,
    filename: 'IMG_3302.jpg',
    meta: 'Jul 4 · 2.8 MB',
    title: 'Low quality capture',
    reason: 'Motion blur was detected. This photo may be safe to remove.',
    status: 'Safe to remove',
    score: 85,
    protectionScore: 34,
    recommendation: 'Safe to review for cleanup',
    explanation: 'This looks like a low-risk cleanup candidate.',
    reasons: ['Low quality capture', 'Motion blur', 'No faces detected', 'Safe cleanup candidate'],
    accent: '#B83A50',
    pale: '#FFF2F4',
    thumbBg: 'linear-gradient(145deg,#B83A50,#F4899A)',
    Icon: Archive,
  },
  {
    id: 3,
    filename: 'Screenshot_0812.png',
    meta: 'Aug 8 · 1.1 MB',
    title: 'Temporary screenshot',
    reason: 'Likely an app screenshot that is no longer meaningful.',
    status: 'Safe to remove',
    score: 71,
    protectionScore: 22,
    recommendation: 'Safe to review for cleanup',
    explanation: 'This looks like a low-risk cleanup candidate.',
    reasons: ['Screenshot', 'Temporary content', 'Low memory value', 'Safe cleanup candidate'],
    accent: '#C27A05',
    pale: '#FFF8E8',
    thumbBg: 'linear-gradient(145deg,#C27A05,#FCD34D)',
    Icon: Archive,
  },
  {
    id: 4,
    filename: 'IMG_5500.jpg',
    meta: 'Aug 15 · 5.6 MB',
    title: 'Protected memory',
    reason: 'PhotoGuard detected this as a meaningful memory and protected it.',
    status: 'Protected',
    score: 98,
    protectionScore: 96,
    recommendation: 'Recommended to keep',
    explanation: 'This photo may have sentimental value.',
    reasons: ['Contains people', 'Only copy found', 'High image quality', 'Meaningful event'],
    accent: '#00897B',
    pale: '#E8FAF7',
    thumbBg: 'linear-gradient(145deg,#00897B,#5DE8D5)',
    Icon: ShieldCheck,
  },
]

export default function AnalysisResultsPage() {
  const nav = useNavigate()

  return (
    <div className="app-shell">
      <main className={styles.page}>
        <header className={styles.topbar}>
          <ActionIcon
            className={styles.backBtn}
            variant="subtle"
            radius="xl"
            size={42}
            aria-label="Back to photo selection"
            onClick={() => nav('/select-photos')}
          >
            <ArrowLeft size={18} />
          </ActionIcon>

          <div className={styles.titleBlock}>
            <h1 className={styles.pageTitle}>Memory Insights</h1>
            <p className={styles.pageSubtitle}>AI cleanup intelligence</p>
          </div>

          <Badge className={styles.itemCount} variant="light" radius="xl">
            4 items
          </Badge>
        </header>

        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className={styles.heroWrap}
        >
          <Card className={styles.heroCard} radius="xl" shadow="none">
            <Stack gap={18}>
              <Group justify="space-between" align="flex-start" gap="sm" wrap="nowrap">
                <Stack gap={10} className={styles.heroCopy}>
                  <Badge
                    className={styles.heroBadge}
                    leftSection={<Sparkles size={12} />}
                    radius="xl"
                    variant="light"
                  >
                    PhotoGuard AI summary
                  </Badge>
                  <div>
                    <h2 className={styles.heroTitle}>Your gallery is ready for a safe cleanup.</h2>
                    <p className={styles.heroText}>
                      Meaningful memories are protected. Review the cleanup suggestions before anything is removed.
                    </p>
                  </div>
                </Stack>
                <div className={styles.heroOrb}>
                  <ShieldCheck size={28} strokeWidth={1.8} />
                </div>
              </Group>

              <div className={styles.summaryGrid}>
                {SUMMARY.map(({ label, value, Icon, tone }) => (
                  <div className={`${styles.summaryTile} ${styles[tone]}`} key={label}>
                    <Icon size={16} strokeWidth={2} />
                    <span className={styles.summaryValue}>{value}</span>
                    <span className={styles.summaryLabel}>{label}</span>
                  </div>
                ))}
              </div>
            </Stack>
          </Card>
        </motion.section>

        <section className={styles.sectionHeader}>
          <div>
            <h2 className={styles.sectionTitle}>AI recommendations</h2>
            <p className={styles.sectionSub}>Sorted by confidence and memory risk</p>
          </div>
          <Badge className={styles.sectionBadge} variant="light" radius="xl">
            Review first
          </Badge>
        </section>

        <Stack className={styles.resultsList} gap={12}>
          {RESULTS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <Card className={styles.resultCard} radius="xl" shadow="none">
                <Group align="stretch" gap={14} wrap="nowrap">
                  <div className={styles.thumb} style={{ background: r.thumbBg, boxShadow: `0 12px 22px ${r.accent}33` }}>
                    <Image size={23} color="white" strokeWidth={1.55} />
                  </div>

                  <Stack className={styles.resultBody} gap={9}>
                    <Group justify="space-between" align="flex-start" gap="xs" wrap="nowrap">
                      <div className={styles.fileBlock}>
                        <div className={styles.filename}>{r.filename}</div>
                        <div className={styles.meta}>{r.meta}</div>
                      </div>
                      <Badge
                        className={styles.statusBadge}
                        radius="xl"
                        variant="light"
                        style={{ color: r.accent, background: r.pale }}
                      >
                        {r.status}
                      </Badge>
                    </Group>

                    <div className={styles.insightRow}>
                      <span className={styles.insightIcon} style={{ color: r.accent, background: r.pale }}>
                        <r.Icon size={14} strokeWidth={2.2} />
                      </span>
                      <span className={styles.resultTitle}>{r.title}</span>
                    </div>

                    <p className={styles.reason}>{r.reason}</p>

                    <div className={styles.explainPanel}>
                      <Group justify="space-between" align="center" gap="xs" wrap="nowrap">
                        <div>
                          <div className={styles.explainKicker}>Memory Protection Score</div>
                          <strong>{r.protectionScore}%</strong>
                        </div>
                        <Badge
                          className={styles.recommendationBadge}
                          radius="xl"
                          variant="light"
                          style={{ color: r.accent, background: r.pale }}
                        >
                          {r.recommendation}
                        </Badge>
                      </Group>
                      <div className={styles.whyTitle}>Why this recommendation?</div>
                      <p className={styles.explainText}>{r.explanation}</p>
                      <div className={styles.reasonChips}>
                        {r.reasons.map(reason => (
                          <span key={reason}>{reason}</span>
                        ))}
                      </div>
                    </div>

                    <div className={styles.confidenceRow}>
                      <Badge
                        className={styles.confidenceBadge}
                        radius="xl"
                        variant="outline"
                        style={{ color: r.accent, borderColor: `${r.accent}55` }}
                      >
                        AI confidence {r.score}%
                      </Badge>
                      <div className={styles.confidenceTrack} aria-hidden="true">
                        <div className={styles.confidenceFill} style={{ width: `${r.score}%`, background: r.accent }} />
                      </div>
                    </div>
                  </Stack>
                </Group>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </main>

      <Card className={styles.bottomBar} radius="xl" shadow="none">
        <Button
          className={styles.reviewButton}
          leftSection={<CheckCircle2 size={18} />}
          radius="lg"
          size="md"
          onClick={() => nav('/review')}
        >
          Continue to final review
        </Button>
        <p className={styles.safeNote}>
          <Lock size={12} /> No photo removed without your approval
        </p>
      </Card>

      <BottomNav />
    </div>
  )
}
