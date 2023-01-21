import Head from '../components/Head/Head'
import Header from '../components/Header/Header'
import Main from '../components/Main/Main'
import RegistrationModal from '../components/Modals/RegistrationModal'
import { Inter } from '@next/font/google'
import { ContextProvider } from '../ContextProvider'
import createMirageServer from './api/mirage/_mirage'
import { QueryClient, QueryClientProvider } from 'react-query'
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  createMirageServer({ environment: process.env.NODE_ENV })
  const queryClient = new QueryClient()

  return (
    <ContextProvider>
      <QueryClientProvider client={queryClient}>
        <RegistrationModal font={inter.className} />
        <Head title="XCO+" />
        <Header font={inter.className} />
        <Main font={inter.className} />
      </QueryClientProvider>
    </ContextProvider>
  )
}
