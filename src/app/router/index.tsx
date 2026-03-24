import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '@/shared/components/ProtectedRoute'

import RootLayout from '@/layouts/RootLayout'
import MainLayout from '@/layouts/MainLayout'
import TeamLayout from '@/layouts/TeamLayout'

import HomePage from '@/features/user/pages'
import LoginPage from '@/features/auth/pages/LoginPage'
import SignupPage from '@/features/auth/pages/SignupPage'
import MyPage from '@/features/user/pages/MyPage'
import TeamCreatePage from '@/features/team/pages/TeamCreatePage'
import TeamDetailPage from '@/features/team/pages/TeamDetailPage'

import BackendApiDocsPage from '@/features/backend/pages/BackendApiDocsPage'
import FrontendApiDocsPage from '@/features/frontend/pages/FrontendApiDocsPage'
import ApiIntegrationPage from '@/features/frontend/pages/ApiIntegrationPage'
import PmPage from '@/features/pm/pages/PmPage'
import NotionCallback from '@/features/pm/pages/NotionCallback'
import QaPage from '@/features/qa/pages/QaPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/login', element: <LoginPage /> },
          { path: '/signup', element: <SignupPage /> },
          {
            path: '/mypage',
            element: (
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/team/create',
            element: (
              <ProtectedRoute>
                <TeamCreatePage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/team/:teamId',
            element: (
              <ProtectedRoute>
                <TeamDetailPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/notion/callback',
            element: (
              <ProtectedRoute>
                <NotionCallback />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '/team/:teamId',
        element: (
          <ProtectedRoute>
            <TeamLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'backend',
            children: [
              { path: '', element: <BackendApiDocsPage /> },
              { path: 'integration/:flowId', element: <ApiIntegrationPage /> },
            ],
          },
          {
            path: 'frontend',
            children: [
              { path: '', element: <FrontendApiDocsPage /> },
              { path: 'integration/:flowId', element: <ApiIntegrationPage /> },
            ],
          },
          { path: 'qa', element: <QaPage /> },
          { path: 'pm', element: <PmPage /> },
        ],
      },
    ],
  },
])
