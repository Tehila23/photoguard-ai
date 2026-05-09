import styles from './ConfirmationModal.module.css'
import PrimaryButton from '../PrimaryButton/PrimaryButton.jsx'

export default function ConfirmationModal({ filename, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.handle} />
        <div className={styles.icon}>🗑️</div>
        <div className={styles.title}>Delete this photo?</div>
        <div className={styles.sub}>
          This will move <strong>{filename}</strong> to trash.<br />
          You can restore it within 30 days.
        </div>
        <div className={styles.warning}>⚠️ This action can be undone within 30 days</div>
        <div className={styles.divider} />
        <PrimaryButton variant="danger" onClick={onConfirm}>Yes, Delete Photo</PrimaryButton>
        <button className={styles.cancel} onClick={onCancel}>Cancel — Keep It</button>
      </div>
    </div>
  )
}
