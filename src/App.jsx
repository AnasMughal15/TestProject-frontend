import { lazy, Suspense } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { action as authAction } from './pages/Authentication'
import { action as logoutAction } from './pages/Logout'
import { checkAuthLoader, tokenLoader } from './util/auth'

// Always loaded — needed for every route
import RootLayout from './pages/Root'
import ErrorPage from './pages/Error'

// Lazy loaded — only fetched when the user navigates to that route
const HomePage = lazy(() => import('./pages/Home'))
const HomePageV2 = lazy(() => import('./v2/pages/HomePage/Home'))
const ProjectDetailsPage = lazy(() => import('./pages/ProjectDetails'))
const AuthenticationV2 = lazy(() => import('./v2/pages/Authentication'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#242424]">
      <div className="w-8 h-8 border-4 border-[#fab833] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: tokenLoader,
    children: [
      {
        index: true,
        element: <Suspense fallback={<PageLoader />}><HomePageV2 /></Suspense>,
        loader: checkAuthLoader,
      },
      {
        path: 'logout',
        action: logoutAction,
      },
      {
        path: '/project/:projectName',
        element: <Suspense fallback={<PageLoader />}><ProjectDetailsPage /></Suspense>,
        loader: checkAuthLoader,
      },
    ],
  },
  {
    path: 'auth',
    element: <Suspense fallback={<PageLoader />}><AuthenticationV2 /></Suspense>,
    action: authAction,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App