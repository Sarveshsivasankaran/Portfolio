import React from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Wins from '../../src/components/Wins'
import '../../src/index.css'
const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
createRoot(document.getElementById('root')!).render(<QueryClientProvider client={client}><Wins /></QueryClientProvider>)
