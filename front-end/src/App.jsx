import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routes'
import { Toaster } from 'sonner'
import AppProvider from './providers'

export default function App() {
  return (
    <>
      <AppProvider>
          <RouterProvider router={router} />
      </AppProvider>
      <Toaster richColors />

    </>
  )
}
