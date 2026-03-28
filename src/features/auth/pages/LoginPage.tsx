import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/features/auth/store'
import { login } from '@/features/auth/api'
import useApi from '@/shared/hooks/useApi'
import AuthLayout from '@/layouts/AuthLayout'
import AuthButton from '@/features/auth/components/AuthButton'
import AuthCard from '@/features/auth/components/AuthCard'
import AuthInput from '@/features/auth/components/AuthInput'
import AuthTitle from '@/features/auth/components/AuthTitle'
import AuthForm from '@/features/auth/components/AuthForm'
import AuthFooterLink from '@/features/auth/components/AuthFooterLink'
import { toast } from 'react-toastify'

export default function LoginPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const { execute, loading } = useApi(login)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const result = await execute({
        email: form.email,
        password: form.password,
      })

      useAuthStore.getState().setAuth({
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        user: result.user,
      })

      toast.success('Logged in successfully.')
      navigate('/')
    } catch {
      // handleApiError에서 이미 toast.error() 처리됨
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthTitle title='LOGIN' subtitle='Welcome NEXUS' />

        <AuthForm onSubmit={handleLogin}>
          <AuthInput
            name='email'
            placeholder='email'
            type='email'
            value={form.email}
            onChange={handleChange}
            autoComplete='username'
          />
          <AuthInput
            name='password'
            placeholder='password'
            type='password'
            value={form.password}
            onChange={handleChange}
            autoComplete='current-password'
          />
          <AuthButton type='submit' disabled={loading}>
            {loading ? 'Start NEXUS...' : 'Start NEXUS'}
          </AuthButton>
        </AuthForm>

        <AuthFooterLink text="Don't have an account?" linkText='Sign up' href='/signup' />
      </AuthCard>
    </AuthLayout>
  )
}
