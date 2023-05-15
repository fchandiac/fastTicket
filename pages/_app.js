import React, {useEffect} from 'react'
import '../styles/global.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { esES } from '@mui/material/locale'
import Layout from '../components/Layout'

import { useRouter } from 'next/router'

const theme = createTheme(
  {
    palette: {
      primary: { main: '#0091ea' }
    },
  }, esES)


export default function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [pageTitle, setPageTitle] = React.useState('Boleta')

  useEffect(() => {
    switch (router.pathname) {
      case '/':
        setPageTitle('Boleta')
        break
      case '/config':
        setPageTitle('Configuración')
        break
      default:
        setPageTitle('')
        break
    }
  }, [router.pathname])


  console.log(router.pathname)
  return (
    <ThemeProvider theme={theme}>
        <Layout pageTitle={pageTitle}><Component {...pageProps} /></Layout>
    </ThemeProvider>

  )
}
