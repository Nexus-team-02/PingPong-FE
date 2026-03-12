import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '@/api/auth'
import useApi from '@/hook/useApi'
import AuthLayout from '@/layouts/AuthLayout'
import AuthButton from '@/components/Auth/AuthButton'
import AuthCard from '@/components/Auth/AuthCard'
import AuthInput from '@/components/Auth/AuthInput'
import AuthTitle from '@/components/Auth/AuthTitle'
import AuthForm from '@/components/Auth/AuthForm'
import AuthFooterLink from '@/components/Auth/AuthFooterLink'
import { toast } from 'sonner'

export default function SignupPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm: '',
    nickname: '',
  })

  const { execute, loading } = useApi(signup)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (form.password !== form.confirm) {
      toast.error('Passwords do not match.')
      return
    }

    try {
      await execute({
        email: form.email,
        password: form.password,
        nickname: form.nickname,
      })

      toast.success('Signed up successfully.')
      navigate('/login')
    } catch {
      // handleApiError에서 이미 toast.error() 처리됨
    }
  }

  return (
    <AuthLayout>
      <AuthCard>
        <AuthTitle title='SIGNUP' subtitle='Create your account' />

        <AuthForm onSubmit={handleSubmit}>
          <AuthInput
            name='email'
            placeholder='email'
            type='email'
            value={form.email}
            onChange={handleChange}
          />
          <AuthInput
            name='password'
            placeholder='password'
            type='password'
            value={form.password}
            onChange={handleChange}
          />
          <AuthInput
            name='confirm'
            placeholder='confirm password'
            type='password'
            value={form.confirm}
            onChange={handleChange}
          />
          <AuthInput
            name='nickname'
            placeholder='name'
            type='text'
            value={form.nickname}
            onChange={handleChange}
          />
          <AuthButton type='submit' disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </AuthButton>
        </AuthForm>

        <AuthFooterLink text='Already have an account?' linkText='Sign in' href='/login' />
      </AuthCard>
    </AuthLayout>
  )
}
