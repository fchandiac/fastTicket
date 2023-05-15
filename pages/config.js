import React, {useState, useEffect} from 'react'
import AppPaper from '../components/AppPaper'
import { Grid, Typography, TextField, Button, Divider, IconButton } from '@mui/material'
import SaveIcon from '@mui/icons-material/Save'
import electron, { } from 'electron'
const ipcRenderer = electron.ipcRenderer || false
const PDF417 = require("pdf417-generator")
import moment from 'moment'

export default function config() {
  const [printer, setPrinter] = useState({ idVendor: 0, idProduct: 0 })
  const [ticketInfo, setTicketInfo] = useState(ticketInfoDataDefault())

  useEffect(() => {
    let config = ipcRenderer.sendSync('read-config', 'sync')
    setPrinter(config.printer)
    setTicketInfo(config.ticket_info)

  }, [])

  const updatePrinter = () => {
    ipcRenderer.send('update-printer', printer)
    alert('Impresora actualizada')
  }

  const updateTicketInfo = () => {
    ipcRenderer.send('update-ticket-info', ticketInfo)
    alert('Información de ticket actualizada')
  }

  const findPrinter = async () => {
    const findPrinter = await ipcRenderer.invoke('find-printer', printer)
      if (findPrinter) {
        alert('Impresora encontrada')
      } else {
        alert('Impresora no encontrada')
      }

  }

  const testPrintTicket =  async () => {
    let timbre = '<TED version="1.0"><DD><RE>76554369-K</RE><TD>39</TD><F>9762</F><FE>2023-05-12</FE><RR>66666666-6</RR><RSR>Publico General</RSR><MNT>699</MNT><IT1>Venta</IT1><CAF version="1.0"><DA><RE>76554369-K</RE><RS>MANTENIMIENTO INDUSTRIAL MANT- PROSER LI</RS><TD>39</TD><RNG><D>9756</D><H>9855</H></RNG><FA>2023-05-11</FA><RSAPK><M>uQT2qZXFgdkbpZrIXi4PmdyTXEfeqB6JmVKCkB6B08mm4FmwM2tCNJ9tKKQx91STLVd8xX/0I5uxJjNS3PlBvQ==</M><E>Aw==</E></RSAPK><IDK>300</IDK></DA><FRMA algoritmo="SHA1withRSA">mj1HsrP5i+sJxPD2iS2D2B2c7sQ/WANS04Ze31VzqEbhGuEirbn26On8lh6RoirarKjw1CNKrXL+zLju9if/Ng==</FRMA></CAF><TSTED>2023-05-12T15:38:03</TSTED></DD><FRMT algoritmo="SHA1withRSA">FZmSxGB1/JQELdq2YAAxHsviL+XCwC2APh08PzwVu/je4LUK/uTwBEfuzSGl9NI5Lh1mQg8+dvBxgExg6SQuhg==</FRMT></TED>'
    let canvas = document.createElement('canvas')
    PDF417.draw(timbre, canvas, 2, 2, 1.5)
    let stamp_img = canvas.toDataURL('image/jpg')
    let date = moment(new Date()).format('DD-MM-yyyy')
    let time = moment(new Date()).format('HH:mm')
    let printInfo = { 
      printer: printer, 
      stamp: stamp_img, 
      date: date, time:time,
      name: ticketInfo.name,
      rut: ticketInfo.rut,
      address: ticketInfo.address,
      phone: ticketInfo.phone,
      total: 1001,
      iva: 190,
      invoiceNumber: 999,
    }
  
      const findPrinter = await ipcRenderer.invoke('find-printer', printer)
      if (findPrinter) {
        ipcRenderer.send('print', printInfo)
      } else {
        alert('Impresora no encontrada')
      }
    
    

  }
  return (
    <>
      <AppPaper title={'Impresora'}>
        <form onSubmit={(e) => { e.preventDefault(); updatePrinter()}}>
          <Grid container spacing={2} direction={'row'} p={1}>
            <Grid item xs={5}>
              <TextField
                label={'IdVendor'}
                value={printer.idVendor}
                onChange={(e) => { setPrinter({ ...printer, idVendor: parseInt(e.target.value) }) }}
                type='number'
                fullWidth
                size={'small'}
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={'IdProduct'}
                value={printer.idProduct}
                onChange={(e) => { setPrinter({ ...printer, idProduct: parseInt(e.target.value) }) }}
                type='number'
                fullWidth
                size={'small'}
                required
              />
            </Grid>
            <Grid item xs={2} textAlign={'right'}>
              <IconButton type={'submit'}>
                <SaveIcon />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </AppPaper>
      <br/>
      <AppPaper title={'Información ticket'}>
        <form onSubmit={(e) => { e.preventDefault(); updateTicketInfo()}}>
          <Grid container spacing={1} direction={'column'} p={1}>
            <Grid item xs={5}>
              <TextField
                label={'Nombre'}
                value={ticketInfo.name}
                onChange={(e) => { setTicketInfo({ ...ticketInfo, name: e.target.value }) }}
                fullWidth
                size={'small'}
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={'Rut'}
                value={ticketInfo.rut}
                onChange={(e) => { setTicketInfo({ ...ticketInfo, rut: e.target.value }) }}
                fullWidth
                size={'small'}
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={'Dirección'}
                value={ticketInfo.address}
                onChange={(e) => { setTicketInfo({ ...ticketInfo, address: e.target.value }) }}
                fullWidth
                size={'small'}
                required
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={'Teléfono'}
                value={ticketInfo.phone}
                onChange={(e) => { setTicketInfo({ ...ticketInfo, phone: e.target.value }) }}
                fullWidth
                size={'small'}
                required
              />
            </Grid>
            <Grid item xs={2} textAlign={'right'}>
              <IconButton type='submit'>
                <SaveIcon />
              </IconButton>
            </Grid>
          </Grid>
        </form>
      </AppPaper>
      <br/>
      <Button variant={'contained'} onClick={findPrinter}>Probar conexión impresora</Button>
      <br/><br/>
      <Button variant={'contained'} onClick={testPrintTicket}>Probar impresión ticket</Button>
      <br/><br/>
    </>
  )
}


function ticketInfoDataDefault(){
  return {
    name: 'FastTicket',
    rut: '12345678-1',
    address: 'Calle 1 # 2-3',
    phone: '1234567890'
  }
}