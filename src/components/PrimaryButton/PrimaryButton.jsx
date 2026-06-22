import styles from './PrimaryButton.module.css'

export default function PrimaryButton({ children, onClick, disabled, variant, style }) {
  const cls = [
    styles.btn,
    variant === 'ghost'   ? styles.ghost   : '',
    variant === 'danger'  ? styles.danger  : '',
    variant === 'success' ? styles.success : '',
  ].filter(Boolean).join(' ')

  return (
    <button className={cls} onClick={onClick} disabled={disabled} style={style}>
      {children}
    </button>
  )
}