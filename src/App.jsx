import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthenticationPage, {action as authAction} from './pages/Authentication'
import RootLayout from './pages/Root'
import { checkAuthLoader, tokenLoader } from './util/auth'
import ErrorPage from './pages/Error'
import HomePage from './pages/Home'
import { action as logoutAction } from './pages/Logout'
import ProjectDetailsPage from './pages/ProjectDetails'

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    loader: tokenLoader,
    children: [
      { index: true, element: <HomePage />, loader: checkAuthLoader },
     

      {
        path: 'logout',
        action: logoutAction,
      },
      {
        path: '/project/:projectName',
        element: <ProjectDetailsPage />,
        loader: checkAuthLoader
      },
    ],
  },
  {
    path: 'auth',
    element: <AuthenticationPage />,
    action: authAction,
  },
]);


function App() {
  return <RouterProvider router={router} />;
}

export default App;