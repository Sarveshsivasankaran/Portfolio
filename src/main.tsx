import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'
import './index.css'

const ActivitiesAdmin = lazy(() => import('./pages/ActivitiesAdmin'))
const isAdminRoute = window.location.pathname.replace(/\/$/, '') === '/admin/activities'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 30, refetchOnWindowFocus: false },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {isAdminRoute ? <Suspense fallback={<p role="status">Loading activity manager…</p>}><ActivitiesAdmin /></Suspense> : <App />}
    </QueryClientProvider>
  </React.StrictMode>
)
