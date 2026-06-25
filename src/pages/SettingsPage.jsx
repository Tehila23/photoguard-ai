import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge, Button, Card, Group, Stack, Switch } from '@mantine/core'
import { motion } from 'framer-motion'
import {
  Bell, CheckCircle2, Eye, FileWarning, Lock, Mail, RefreshCcw,
  ShieldCheck, Sparkles, User, VolumeX, CalendarClock, Trash2, Database,
  Type, Contrast, Moon,
} from 'lucide-react'
import BottomNav from '../components/BottomNav/BottomNav.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { useMemoryShieldPreferences } from '../hooks/useMemoryShieldPreferences'
import '../styles/globals.css'
import styles from './SettingsPage.module.css'

const SETTINGS_KEYS = [
  'muteNotifications',
  'weeklyReminder',
  'notifyBeforeRemoval',
  'comfortMode',
  'largerText',
  'highContrast',
  'reduceMotion',
]

const DEFAULT_SETTINGS = {
  muteNotifications: false,
  weeklyReminder: true,
  notifyBeforeRemoval: true,
  comfortMode: false,
  largerText: false,
  highContrast: false,
  reduceMotion: false,
}

const ACCESSIBILITY_CLASSES = {
  comfortMode: 'photoguard-comfort-mode',
  largerText: 'photoguard-large-text',
  highContrast: 'photoguard-high-contrast',
  reduceMotion: 'photoguard-reduce-motion',
}

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.36, delay, ease: [0.22, 1, 0.36, 1] },
})

function readSettings() {
  return SETTINGS_KEYS.reduce((acc, key) => {
    const stored = window.localStorage.getItem(key)
    acc[key] = stored === null ? DEFAULT_SETTINGS[key] : stored === 'true'
    return acc
  }, {})
}

function getAvatarData(user) {
  const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.user_metadata?.display_name
  const fallbackText = displayName || user?.email || ''
  const image = user?.user_metadata?.avatar_url || user?.user_metadata?.picture

  return {
    image,
    initial: fallbackText.trim().charAt(0).toUpperCase() || '?',
  }
}

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { resetPreferences } = useMemoryShieldPreferences()
  const [settings, setSettings] = useState(readSettings)
  const [resetDone, setResetDone] = useState(false)
  const avatar = getAvatarData(user)

  useEffect(() => {
    SETTINGS_KEYS.forEach(key => {
      window.localStorage.setItem(key, String(settings[key]))
    })

    Object.entries(ACCESSIBILITY_CLASSES).forEach(([key, className]) => {
      document.body.classList.toggle(className, settings[key])
    })

    window.dispatchEvent(new Event('photoguard-settings-change'))
  }, [settings])

  const updateSetting = key => checked => {
    setSettings(prev => ({ ...prev, [key]: checked }))
  }

  const resetProtectionPreferences = async () => {
    await resetPreferences()
    setResetDone(true)
    window.setTimeout(() => setResetDone(false), 2200)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login', { replace: true })
  }

  return (
    <div className="app-shell">
      <main className={styles.page}>
        <motion.header {...up(0)} className={styles.header}>
          <div className={styles.brandIcon}><Sparkles size={20} /></div>
          <div>
            <h1>Settings</h1>
            <p>Personalize PhotoGuard for safer cleanup.</p>
          </div>
        </motion.header>

        <motion.section {...up(0.04)}>
          <Card className={styles.accountCard} radius="xl" shadow="none">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group gap={12} wrap="nowrap">
                <div className={styles.avatar} aria-label="Account avatar">
                  {avatar.image ? <img src={avatar.image} alt="" /> : avatar.initial}
                </div>
                <Stack gap={3}>
                  <h2>Account</h2>
                  <div className={styles.accountLine}><User size={13} /> {user?.user_metadata?.full_name || 'PhotoGuard user'}</div>
                  <div className={styles.accountLine}><Mail size={13} /> {user?.email}</div>
                </Stack>
              </Group>
              <Stack gap={8} align="flex-end">
                <Badge className={styles.connectedBadge} leftSection={<CheckCircle2 size={12} />} radius="xl">
                  Connected
                </Badge>
                <Button className={styles.logoutButton} variant="subtle" radius="lg" onClick={handleLogout}>
                  Logout
                </Button>
              </Stack>
            </Group>
          </Card>
        </motion.section>

        <SettingsSection
          delay={0.08}
          eyebrow="Notifications"
          title="Stay informed without noise"
          icon={<Bell size={18} />}
        >
          <SettingRow
            icon={<VolumeX size={16} />}
            title="Mute notifications"
            description="Pause non-essential alerts."
            checked={settings.muteNotifications}
            onChange={updateSetting('muteNotifications')}
          />
          <SettingRow
            icon={<CalendarClock size={16} />}
            title="Weekly cleanup reminder"
            description="A gentle nudge to review your gallery."
            checked={settings.weeklyReminder}
            onChange={updateSetting('weeklyReminder')}
          />
          <SettingRow
            icon={<FileWarning size={16} />}
            title="Notify before removal"
            description="Always ask before anything is deleted."
            checked={settings.notifyBeforeRemoval}
            onChange={updateSetting('notifyBeforeRemoval')}
          />
        </SettingsSection>

        <SettingsSection
          delay={0.12}
          eyebrow="Accessibility"
          title="Make PhotoGuard easier to read"
          icon={<Eye size={18} />}
        >
          <SettingRow
            icon={<Eye size={16} />}
            title="Comfort Mode"
            description="Larger text, calmer motion, clearer contrast."
            checked={settings.comfortMode}
            onChange={updateSetting('comfortMode')}
          />
          <SettingRow
            icon={<Type size={16} />}
            title="Larger text"
            description="Increase reading size across the app."
            checked={settings.largerText}
            onChange={updateSetting('largerText')}
          />
          <SettingRow
            icon={<Contrast size={16} />}
            title="High contrast"
            description="Strengthen text and card boundaries."
            checked={settings.highContrast}
            onChange={updateSetting('highContrast')}
          />
          <SettingRow
            icon={<Moon size={16} />}
            title="Reduce motion"
            description="Use calmer transitions where possible."
            checked={settings.reduceMotion}
            onChange={updateSetting('reduceMotion')}
          />
        </SettingsSection>

        <motion.section {...up(0.16)}>
          <Card className={styles.safetyCard} radius="xl" shadow="none">
            <Group align="flex-start" gap={12} wrap="nowrap">
              <div className={styles.safetyIcon}><ShieldCheck size={19} /></div>
              <Stack gap={10} className={styles.safetyCopy}>
                <Badge className={styles.safetyBadge} radius="xl">Privacy & Safety</Badge>
                <h2>Safe by design</h2>
                <p>PhotoGuard keeps cleanup decisions transparent and reversible.</p>
                <div className={styles.safetyList}>
                  <SafetyItem icon={<Lock size={15} />} text="Nothing is deleted automatically" />
                  <SafetyItem icon={<ShieldCheck size={15} />} text="Smart Memory Shield is active" />
                  <SafetyItem icon={<Database size={15} />} text="Preferences are saved to your account" />
                  <SafetyItem icon={<RefreshCcw size={15} />} text="You can reset protection preferences" />
                </div>
                <Button
                  className={styles.resetButton}
                  leftSection={resetDone ? <CheckCircle2 size={16} /> : <RefreshCcw size={16} />}
                  radius="lg"
                  variant="light"
                  onClick={resetProtectionPreferences}
                >
                  {resetDone ? 'Protection preferences reset' : 'Reset preferences'}
                </Button>
              </Stack>
            </Group>
          </Card>
        </motion.section>
      </main>

      <BottomNav />
    </div>
  )
}


function SafetyItem({ icon, text }) {
  return (
    <div className={styles.safetyItem}>
      <span>{icon}</span>
      <p>{text}</p>
    </div>
  )
}
function SettingsSection({ delay, eyebrow, title, icon, children }) {
  return (
    <motion.section {...up(delay)}>
      <Card className={styles.sectionCard} radius="xl" shadow="none">
        <Group gap={12} align="flex-start" wrap="nowrap" className={styles.sectionHead}>
          <div className={styles.sectionIcon}>{icon}</div>
          <div>
            <div className={styles.eyebrow}>{eyebrow}</div>
            <h2>{title}</h2>
          </div>
        </Group>
        <Stack gap={10} className={styles.settingList}>
          {children}
        </Stack>
      </Card>
    </motion.section>
  )
}

function SettingRow({ icon, title, description, checked, onChange }) {
  return (
    <div
      className={styles.settingRow}
      role="button"
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onChange(!checked)
        }
      }}
    >
      <div className={styles.rowIcon}>{icon}</div>
      <div className={styles.rowCopy}>
        <div>{title}</div>
        <p>{description}</p>
      </div>
      <Switch
        checked={checked}
        onChange={event => onChange(event.currentTarget.checked)}
        onClick={event => event.stopPropagation()}
        aria-label={title}
        color="cyan"
      />
    </div>
  )
}
