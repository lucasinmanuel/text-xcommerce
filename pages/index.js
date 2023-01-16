import Head from '../components/Head/Head'
import Header from '../components/Header/Header'
import Main from '../components/Main/Main'
import { Inter } from '@next/font/google'
import { ContextProvider } from '../ContextProvider'
import createMirageServer from './api/mirage/_mirage'

const inter = Inter({
  variable: '--inter-font',
})

export default function Home() {
  createMirageServer()
  return (
    <ContextProvider>
      <Head title="XCO+" />
      <Header font={inter.className} />
      <Main font={inter.className}  />
    </ContextProvider>
  )
}
