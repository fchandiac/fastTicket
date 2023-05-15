import React from 'react'
import '../styles/global.css'

import { createTheme, ThemeProvider } from '@mui/material/styles'
import { esES } from '@mui/material/locale'
import moment from 'moment'
import Layout from '../components/Layout'

const theme = createTheme(
  {
    palette: {
      primary: { main: '#0091ea' }
    },
  }, esES)





export default function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
        <Layout><Component {...pageProps} /></Layout>
    </ThemeProvider>

  )
}
