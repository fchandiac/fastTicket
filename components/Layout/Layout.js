import {
  AppBar, Container, Grid, IconButton, Typography, Box, Divider, Drawer, List,
  ListItem, ListItemButton, ListItemText, Chip, Badge, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Popper
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import React, { useState, useEffect, useRef } from 'react'
// import { useAppContext } from '../../AppProvider'
import { useRouter } from 'next/router'
import { useTheme } from '@mui/material/styles'
import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false


import styles from './Layout.module.css'

export default function Layout(props) {
  const { children, pageTitle } = props
  const theme = useTheme()
  const [drawerState, setDrawerState] = useState(false)
  const router = useRouter()

  return (
    <>
      <AppBar>
        <Container sx={{ display: 'flex', alignItems: 'center', paddingTop: '0.3rem', paddingBottom: '0.3rem' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => { setDrawerState(true) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            FastTicket
          </Typography>
          <Typography variant={'button'} component="div" sx={{ flexGrow: 1 }} textAlign={'right'}>
            {pageTitle}
          </Typography>
        </Container>
      </AppBar>
      <Drawer
        anchor='left'
        open={drawerState}
      >
        <Box sx={{ justifyContent: 'flex-end', display: 'flex', padding: '0.3rem' }}>
          <IconButton onClick={() => setDrawerState(false)} >
            <ChevronLeft />
          </IconButton>
        </Box>
        <Divider />
        <List>
        <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary={'Home'}
                onClick={() => {
                  router.push({
                    pathname: '/',
                  })
                  setDrawerState(false)
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary={'Configuración'}
                onClick={() => {
                  router.push({
                    pathname: '/config',
                  })
                  setDrawerState(false)
                }}
              />
            </ListItemButton>
          </ListItem>
          </List>
      </Drawer>
      <Box>
        {children}
      </Box>
    </>
  )
}



