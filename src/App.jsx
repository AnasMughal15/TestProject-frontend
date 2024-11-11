import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AuthenticationPage, {action as authAction} from './pages/Authentication'
import RootLayout from './pages/Root'
import { checkAuthLoader, tokenLoader } from './util/auth'
import ErrorPage from './pages/Error'
const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    id: 'root',
    // loader: tokenLoader,
    children: [
      // { index: true, element: <HomePage /> },
      // {
      //   path: 'events',
      //   element: <EventsRootLayout />,
      //   children: [
      //     {
      //       index: true,
      //       element: <EventsPage />,
      //       loader: eventsLoader,
      //     },
      //     {
      //       path: ':eventId',
      //       id: 'event-detail',
      //       loader: eventDetailLoader,
      //       children: [
      //         {
      //           index: true,
      //           element: <EventDetailPage />,
      //           action: deleteEventAction,
      //         },
      //         {
      //           path: 'edit',
      //           element: <EditEventPage />,
      //           action: manipulateEventAction,
      //           loader: checkAuthLoader,
      //         },
      //       ],
      //     },
      //     {
      //       path: 'new',
      //       element: <NewEventPage />,
      //       action: manipulateEventAction,
      //       loader: checkAuthLoader,
      //     },
      //   ],
      // },
      {
        path: 'auth',
        element: <AuthenticationPage />,
        action: authAction,
      },
      // {
      //   path: 'newsletter',
      //   element: <NewsletterPage />,
      //   action: newsletterAction,
      // },
      // {
      //   path: 'logout',
      //   action: logoutAction,
      // },
    ],
  },
]);


function App() {
  return <RouterProvider router={router} />;
  // return(
  //   <div>
  //     <AuthenticationPage />
  //   </div>
  // )
}

export default App
