import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Alert, Button, PasswordInput, TextInput } from '@mantine/core'
import { motion } from 'framer-motion'
import { LogIn, ShieldCheck, Sparkles } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import styles from './AuthPage.module.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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
    </main>
  )
}
