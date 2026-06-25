import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Button, PasswordInput } from '@mantine/core'
import { motion } from 'framer-motion'
import { KeyRound, ShieldCheck, Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import styles from './AuthPage.module.css'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password.length < 6) {
      setError('Please choose a password with at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setSubmitting(false)

    if (updateError) {
      setError(updateError.message || 'We could not update your password. Please request a new reset link.')
      return
    }

    setMessage('Password updated. You can now log in with your new password.')
    window.setTimeout(() => navigate('/login', { replace: true }), 1400)
  }

  return (
    <main className={styles.page}>
      <motion.section className={styles.card} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className={styles.brandMark}><Sparkles size={22} /></div>
        <div className={styles.kicker}><ShieldCheck size={13} /> Secure account recovery</div>
        <h1>Create new password</h1>
        <p>Choose a new password for your PhotoGuard account.</p>

        {error && <Alert className={styles.alert} color="red" variant="light">{error}</Alert>}
        {message && <Alert className={styles.alert} color="teal" variant="light">{message}</Alert>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <PasswordInput
            label="New password"
            value={password}
            onChange={event => setPassword(event.currentTarget.value)}
            required
            radius="lg"
            autoComplete="new-password"
            minLength={6}
          />
          <PasswordInput
            label="Confirm new password"
            value={confirmPassword}
            onChange={event => setConfirmPassword(event.currentTarget.value)}
            required
            radius="lg"
            autoComplete="new-password"
            minLength={6}
          />
          <Button
            className={styles.primaryButton}
            type="submit"
            radius="lg"
            loading={submitting}
            leftSection={<KeyRound size={17} />}
          >
            Update password
          </Button>
        </form>

        <div className={styles.footerText}>
          Remembered your password? <Link to="/login">Log in</Link>
        </div>
      </motion.section>
    </main>
  )
}
