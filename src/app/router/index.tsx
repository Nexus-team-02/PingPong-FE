import { createBrowserRouter } from 'react-router-dom'
import ProtectedRoute from '@/components/common/ProtectedRoute'

import RootLayout from '@/layouts/RootLayout'
import MainLayout from '@/layouts/MainLayout'
import TeamLayout from '@/layouts/TeamLayout'

import HomePage from '@/pages/Home'
import LoginPage from '@/pages/Auth/LoginPage'
import SignupPage from '@/pages/Auth/SignupPage'
import MyPage from '@/pages/Users/MyPage'

import TeamCreatePage from '@/pages/Team/TeamCreatePage'
import TeamDetailPage from '@/pages/Team/TeamDetailPage'

import BackendApiDocsPage from '@/pages/Backend/BackendApiDocs'
import FrontendApiDocsPage from '@/pages/Frontend/FrontendApiDocsPage'
import ApiIntegrationPage from '@/pages/Frontend/ApiIntegrationPage'
import PmPage from '@/pages/PM/PmPage'
import NotionCallback from '@/pages/PM/NotionCallback'
import QaPage from '@/pages/QA/QaPage'

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
