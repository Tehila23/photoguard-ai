import styles from './Navbar.module.css'

export default function Navbar({ title = 'PhotoGuard AI', showBack = false, onBack, rightContent }) {
  return (
    <header className={styles.navbar}>
      <div className={styles.left}>
        {showBack ? (
          <button className={styles.backBtn} onClick={onBack}>‹ Back</button>
        ) : (
          <div className={styles.brand}>
            <div className={styles.brandMark}>
              <svg viewBox="0 0 24 24" fill="white" width="16" height="16">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
            <span className={styles.brandName}>{title}</span>
          </div>
        )}
        {showBack && <span className={styles.pageTitle}>{title}</span>}
      </div>
      <div className={styles.right}>
        {rightContent ?? <div className={styles.avatar}>S</div>}
      </div>
    </header>
  )
}
