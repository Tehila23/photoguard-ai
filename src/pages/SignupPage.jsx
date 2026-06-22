import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Alert, Button, PasswordInput, TextInput } from '@mantine/core'
import { motion } from 'framer-motion'
import { ShieldCheck, Sparkles, UserPlus } from 'lucide-react'
import { useAuth } from '../hooks/useAuth.jsx'
import styles from './AuthPage.module.css'

export default function SignupPage() {
  const navigate = useNavigate()
  const { user, loading, signUp } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState(null)

  if (!loading && user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    setMessage('')

    const { error: signUpError } = await signUp(email, password, fullName)
    setSubmitting(false)

    if (signUpError) {
      console.error('Supabase signup error:', signUpError)
      setError(signUpError)
      return
    }

    setMessage('Account created. If email confirmation is enabled, check your inbox before logging in.')
    window.setTimeout(() => navigate('/login'), 1200)
  }

  return (
    <main className={styles.page}>
      <motion.section className={styles.card} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div className={styles.brandMark}><Sparkles size={22} /></div>
        <div className={styles.kicker}><ShieldCheck size={13} /> Secure by default</div>
        <h1>Create your account</h1>
        <p>Save Memory Shield preferences and keep cleanup decisions connected to your account.</p>

        {error && (
          <Alert className={styles.alert} color="red" variant="light">
            <div className={styles.errorMessage}>{error.message}</div>
            <div className={styles.errorMetadata}>
              {error.status != null && <span>Status: {error.status}</span>}
              {error.code && <span>Code: {error.code}</span>}
            </div>
            {import.meta.env.DEV && (
              <details className={styles.technicalDetails}>
                <summary>Technical details</summary>
                <pre>{JSON.stringify({
                  name: error.name,
                  message: error.message,
                  status: error.status ?? null,
                  code: error.code ?? null,
                  details: error.details ?? null,
                  hint: error.hint ?? null,
                }, null, 2)}</pre>
              </details>
            )}
          </Alert>
        )}
        {message && <Alert className={styles.alert} color="teal" variant="light">{message}</Alert>}

        <form className={styles.form} onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            value={fullName}
            onChange={event => setFullName(event.currentTarget.value)}
            radius="lg"
            autoComplete="name"
          />
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
            autoComplete="new-password"
            minLength={6}
          />
          <Button
            className={styles.primaryButton}
            type="submit"
            radius="lg"
            loading={submitting}
            leftSection={<UserPlus size={17} />}
          >
            Sign up
          </Button>
        </form>

        <div className={styles.footerText}>
          Already have an account? <Link to="/login">Log in</Link>
        </div>
      </motion.section>
    </main>
  )
}
