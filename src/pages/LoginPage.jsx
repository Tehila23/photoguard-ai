import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, Modal, PasswordInput, Stack, TextInput } from '@mantine/core'
import { motion } from 'framer-motion'
import { LogIn, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, signIn, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [resetOpen, setResetOpen] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetSubmitting, setResetSubmitting] = useState(false)
  const [resetError, setResetError] = useState('')
  const [resetSuccess, setResetSuccess] = useState('')

  const redirectTo = location.state?.from?.pathname ?? '/dashboard'

  if (!loading && user) {
    return <Navigate to={redirectTo} replace />
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate(redirectTo, { replace: true })
  }

  const handleResetSubmit = async event => {
    event.preventDefault()
    const emailToReset = resetEmail.trim()

    setResetError('')
    setResetSuccess('')

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToReset)) {
      setResetError('Please enter a valid email address.')
      return
    }

    setResetSubmitting(true)
    const { error: resetRequestError } = await resetPassword(emailToReset)
    setResetSubmitting(false)

    if (resetRequestError) {
      setResetError(resetRequestError.message || 'We could not send the reset email. Please try again.')
      return
    }

    setResetSuccess('Password reset email sent. Please check your inbox.')
  }

  return (
    <main className={styles.page}>
      <motion.section className={styles.card} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className={styles.brandMark}><Sparkles size={22} /></div>
        <div className={styles.kicker}><ShieldCheck size={13} /> Private memory protection</div>
        <h1>Welcome back</h1>
        <p>Sign in to keep your PhotoGuard memories and cleanup preferences synced securely.</p>

        {error && <Alert className={styles.alert} color="red" variant="light">{error}</Alert>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={event => setEmail(event.currentTarget.value)}
            required
            radius="lg"
            autoComplete="email"
          />
          <PasswordInput
            label="Password"
            value={password}
            onChange={event => setPassword(event.currentTarget.value)}
            required
            radius="lg"
            autoComplete="current-password"
          />
          <button
            className={styles.forgotButton}
            type="button"
            onClick={() => {
              setResetEmail(email)
              setResetError('')
              setResetSuccess('')
              setResetOpen(true)
            }}
          >
            Forgot password?
          </button>
          <Button
            className={styles.primaryButton}
            type="submit"
            radius="lg"
            loading={submitting}
            leftSection={<LogIn size={17} />}
          >
            Log in
          </Button>
        </form>

        <div className={styles.footerText}>
          New to PhotoGuard? <Link to="/signup">Create an account</Link>
        </div>
      </motion.section>

      <Modal
        opened={resetOpen}
        onClose={() => setResetOpen(false)}
        centered
        radius="xl"
        size="sm"
        title="Reset your password"
        classNames={{
          content: styles.modalContent,
          header: styles.modalHeader,
          title: styles.modalTitle,
          body: styles.modalBody,
        }}
      >
        <form onSubmit={handleResetSubmit}>
          <Stack gap="sm">
            <p className={styles.modalText}>
              Enter your email and PhotoGuard will send a secure reset link.
            </p>
            {resetError && <Alert className={styles.alert} color="red" variant="light">{resetError}</Alert>}
            {resetSuccess && <Alert className={styles.alert} color="teal" variant="light">{resetSuccess}</Alert>}
            <TextInput
              label="Email"
              type="email"
              value={resetEmail}
              onChange={event => setResetEmail(event.currentTarget.value)}
              required
              radius="lg"
              autoComplete="email"
            />
            <Button
              className={styles.primaryButton}
              type="submit"
              radius="lg"
              loading={resetSubmitting}
              leftSection={<Mail size={17} />}
            >
              Send reset email
            </Button>
          </Stack>
        </form>
      </Modal>
    </main>
  )
}
