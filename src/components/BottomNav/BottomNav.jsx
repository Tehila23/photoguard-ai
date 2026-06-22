import { NavLink } from 'react-router-dom'
import { Home, Images, Sparkles, Settings } from 'lucide-react'
import styles from './BottomNav.module.css'

const ITEMS = [
  { label: 'Home',     Icon: Home,     path: '/dashboard' },
  { label: 'Library',  Icon: Images,   path: '/select-photos' },
  { label: 'AI Tools', Icon: Sparkles, path: '/analysis' },
  { label: 'Settings', Icon: Settings, path: '/settings' },
]

export default function BottomNav() {
  return (
    <nav className={styles.nav} aria-label="Primary navigation">
      {ITEMS.map(({ label, Icon, path }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            isActive ? `${styles.item} ${styles.active}` : styles.item
          }
        >
          {({ isActive }) => (
            <>
              <span className={styles.iconWrap}>
                <Icon size={20} strokeWidth={isActive ? 2.35 : 1.9} />
              </span>
              <span className={styles.label}>{label}</span>
              <span className={styles.pip} />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}