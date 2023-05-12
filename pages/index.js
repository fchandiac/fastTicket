import { Grid, Typography, TextField, Button, Divider, IconButton } from '@mui/material'
import React, { useState, useEffect } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import electron from 'electron'
const ipcRenderer = electron.ipcRenderer || false
import AppPaper from '../components/AppPaper'
const utils = require('../utils')
const print = require('../services/print')
const PDF417 = require("pdf417-generator")
const lioren = require('../services/lioren')



export default function index() {
  const [serial, setSerial] = useState('')
  const [printer, setPrinter] = useState({ idVendor: 0, idProduct: 0 })
  const [amount, setAmount] = useState(0)
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    let serial = ipcRenderer.sendSync('get-serial', 'sync')
    setSerial(serial)
    let config = ipcRenderer.sendSync('read-config', 'sync')
    setPrinter(config.printer)
  }, [])

  const ticket = () => {
    print.test(printer)
      .then(() => {
        console.log('printer ok')

        //console.log(total)
        //let timbre = '<TED version="1.0"><DD><RE>76554369-K</RE><TD>39</TD><F>9762</F><FE>2023-05-12</FE><RR>66666666-6</RR><RSR>Publico General</RSR><MNT>699</MNT><IT1>Venta</IT1><CAF version="1.0"><DA><RE>76554369-K</RE><RS>MANTENIMIENTO INDUSTRIAL MANT- PROSER LI</RS><TD>39</TD><RNG><D>9756</D><H>9855</H></RNG><FA>2023-05-11</FA><RSAPK><M>uQT2qZXFgdkbpZrIXi4PmdyTXEfeqB6JmVKCkB6B08mm4FmwM2tCNJ9tKKQx91STLVd8xX/0I5uxJjNS3PlBvQ==</M><E>Aw==</E></RSAPK><IDK>300</IDK></DA><FRMA algoritmo="SHA1withRSA">mj1HsrP5i+sJxPD2iS2D2B2c7sQ/WANS04Ze31VzqEbhGuEirbn26On8lh6RoirarKjw1CNKrXL+zLju9if/Ng==</FRMA></CAF><TSTED>2023-05-12T15:38:03</TSTED></DD><FRMT algoritmo="SHA1withRSA">FZmSxGB1/JQELdq2YAAxHsviL+XCwC2APh08PzwVu/je4LUK/uTwBEfuzSGl9NI5Lh1mQg8+dvBxgExg6SQuhg==</FRMT></TED>'
        lioren.boleta(amount)
          .then((res) => {
            console.log(res)

            let canvas = document.createElement('canvas')
            PDF417.draw(res[0], canvas,2, 4, 1.5)
            let timbre_img = canvas.toDataURL('image/jpg')

            print.ticket(amount, printer, timbre_img, res[1], res[2])
            .then(() => { 
              console.log('ticket ok')
              setAmount(0) 
            })
          })
          .catch((err) => { console.log(err) })
      })
      .catch(() => {
        setShowError(true)
        setTimeout(() => { setShowError(false) }, 4000)
      })

  }

  const updatePrinter = () => {
    ipcRenderer.send('update-config', printer)
  }

  return (
    <>
      <Typography textAlign={'right'} pr={1} pb={1} fontSize={12}>
        Serial number: {serial}
      </Typography>
      <Typography sx={{ display: showError ? 'block' : 'none' }} textAlign={'right'} color={'error'} pr={1} pb={1} fontSize={18}>
        {'Error conexión impresora'}
      </Typography>
      <AppPaper title={'Información Boleta'}>
        <form onSubmit={(e) => { e.preventDefault(); ticket() }}>
          <Grid container spacing={2} direction={'column'} p={1}>
            <Grid item>
              <TextField
                label={'Monto'}
                value={utils.renderMoneystr(amount)}
                type='text'
                onChange={(e) => { e.target.value === '$ ' || e.target.value === '$' || e.target.value === '0' || e.target.value === '' ? setAmount(0) : setAmount(utils.moneyToInt(e.target.value)) }}
                required
                fullWidth
              />
            </Grid>
            <Grid item textAlign={'right'}>
              <Button variant='contained' color='primary' type='submit'>Enviar</Button>
            </Grid>
          </Grid>
        </form>
      </AppPaper>
      <br />
      <Divider />
      <br />

      <AppPaper title={'Impresora'}>
        <form onSubmit={(e) => { e.preventDefault(); ticket() }}>
          <Grid container spacing={2} direction={'row'} p={1}>
            <Grid item xs={5}>
              <TextField
                label={'IdVendor'}
                value={printer.idVendor}
                onChange={(e) => { setPrinter({ ...printer, idVendor: e.target.value }) }}
                type={'number'}
                fullWidth
                size={'small'}
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={'IdProduct'}
                value={printer.idProduct}
                onChange={(e) => { setPrinter({ ...printer, idProduct: e.target.value }) }}
                type='number'
                fullWidth
                size={'small'}
                required
              />
            </Grid>
            <Grid item xs={2} textAlign={'right'}>
              <IconButton onClick={(e) => {updatePrinter()}}>
                <SaveIcon />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </AppPaper>

    </>
  )
}



