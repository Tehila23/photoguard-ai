import styles from './PrimaryButton.module.css'

export default function PrimaryButton({ children, onClick, variant = 'primary', disabled = false }) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}
