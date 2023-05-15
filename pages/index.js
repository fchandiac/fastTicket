import { Grid, Typography, TextField, Button, Divider, IconButton } from '@mui/material'
import React, { useState, useEffect, useRef } from 'react'

import electron, { } from 'electron'
const ipcRenderer = electron.ipcRenderer || false
import AppPaper from '../components/AppPaper'
import moment from 'moment'


const utils = require('../utils')
const PDF417 = require("pdf417-generator")
const lioren = require('../services/lioren')

export default function index() {
  const [printer, setPrinter] = useState({ idVendor: 0, idProduct: 0 })
  const [amount, setAmount] = useState(0)


  useEffect(() => {
    let config = ipcRenderer.sendSync('read-config', 'sync')
    setPrinter(config.printer)

  }, [])

  const ticket = () => {
    let timbre = '<TED version="1.0"><DD><RE>76554369-K</RE><TD>39</TD><F>9762</F><FE>2023-05-12</FE><RR>66666666-6</RR><RSR>Publico General</RSR><MNT>699</MNT><IT1>Venta</IT1><CAF version="1.0"><DA><RE>76554369-K</RE><RS>MANTENIMIENTO INDUSTRIAL MANT- PROSER LI</RS><TD>39</TD><RNG><D>9756</D><H>9855</H></RNG><FA>2023-05-11</FA><RSAPK><M>uQT2qZXFgdkbpZrIXi4PmdyTXEfeqB6JmVKCkB6B08mm4FmwM2tCNJ9tKKQx91STLVd8xX/0I5uxJjNS3PlBvQ==</M><E>Aw==</E></RSAPK><IDK>300</IDK></DA><FRMA algoritmo="SHA1withRSA">mj1HsrP5i+sJxPD2iS2D2B2c7sQ/WANS04Ze31VzqEbhGuEirbn26On8lh6RoirarKjw1CNKrXL+zLju9if/Ng==</FRMA></CAF><TSTED>2023-05-12T15:38:03</TSTED></DD><FRMT algoritmo="SHA1withRSA">FZmSxGB1/JQELdq2YAAxHsviL+XCwC2APh08PzwVu/je4LUK/uTwBEfuzSGl9NI5Lh1mQg8+dvBxgExg6SQuhg==</FRMT></TED>'
    let canvas = document.createElement('canvas')
    PDF417.draw(timbre, canvas)
    let timbre_img = canvas.toDataURL('image/jpg')
    print.findPrinter(printer)
      .then(res => {
        console.log(res)
        console.log('printer ok')

        //console.log(total)
        //let timbre = '<TED version="1.0"><DD><RE>76554369-K</RE><TD>39</TD><F>9762</F><FE>2023-05-12</FE><RR>66666666-6</RR><RSR>Publico General</RSR><MNT>699</MNT><IT1>Venta</IT1><CAF version="1.0"><DA><RE>76554369-K</RE><RS>MANTENIMIENTO INDUSTRIAL MANT- PROSER LI</RS><TD>39</TD><RNG><D>9756</D><H>9855</H></RNG><FA>2023-05-11</FA><RSAPK><M>uQT2qZXFgdkbpZrIXi4PmdyTXEfeqB6JmVKCkB6B08mm4FmwM2tCNJ9tKKQx91STLVd8xX/0I5uxJjNS3PlBvQ==</M><E>Aw==</E></RSAPK><IDK>300</IDK></DA><FRMA algoritmo="SHA1withRSA">mj1HsrP5i+sJxPD2iS2D2B2c7sQ/WANS04Ze31VzqEbhGuEirbn26On8lh6RoirarKjw1CNKrXL+zLju9if/Ng==</FRMA></CAF><TSTED>2023-05-12T15:38:03</TSTED></DD><FRMT algoritmo="SHA1withRSA">FZmSxGB1/JQELdq2YAAxHsviL+XCwC2APh08PzwVu/je4LUK/uTwBEfuzSGl9NI5Lh1mQg8+dvBxgExg6SQuhg==</FRMT></TED>'
        // lioren.boleta(amount)
        //   .then((res) => {
        //     console.log(res)

        // let canvas = document.createElement('canvas')
        // PDF417.draw(timbre, canvas)
        // let timbre_img = canvas.toDataURL('image/jpg')

        // print.ticket(amount, printer, timbre_img, 0, 0)
        // .then(() => { 
        //   console.log('ticket ok')
        //   setAmount(0) 
        // })
        // })
        // .catch((err) => { console.log(err) })
      })
      .catch(err => {
        console.log(err)
        setShowError(true)
        setTimeout(() => { setShowError(false) }, 4000)
      })

  }

  

  const handlePrint =  async () => {
    let timbre = '<TED version="1.0"><DD><RE>76554369-K</RE><TD>39</TD><F>9762</F><FE>2023-05-12</FE><RR>66666666-6</RR><RSR>Publico General</RSR><MNT>699</MNT><IT1>Venta</IT1><CAF version="1.0"><DA><RE>76554369-K</RE><RS>MANTENIMIENTO INDUSTRIAL MANT- PROSER LI</RS><TD>39</TD><RNG><D>9756</D><H>9855</H></RNG><FA>2023-05-11</FA><RSAPK><M>uQT2qZXFgdkbpZrIXi4PmdyTXEfeqB6JmVKCkB6B08mm4FmwM2tCNJ9tKKQx91STLVd8xX/0I5uxJjNS3PlBvQ==</M><E>Aw==</E></RSAPK><IDK>300</IDK></DA><FRMA algoritmo="SHA1withRSA">mj1HsrP5i+sJxPD2iS2D2B2c7sQ/WANS04Ze31VzqEbhGuEirbn26On8lh6RoirarKjw1CNKrXL+zLju9if/Ng==</FRMA></CAF><TSTED>2023-05-12T15:38:03</TSTED></DD><FRMT algoritmo="SHA1withRSA">FZmSxGB1/JQELdq2YAAxHsviL+XCwC2APh08PzwVu/je4LUK/uTwBEfuzSGl9NI5Lh1mQg8+dvBxgExg6SQuhg==</FRMT></TED>'
    let canvas = document.createElement('canvas')
    PDF417.draw(timbre, canvas, 2, 2, 1.5)
    let stamp_img = canvas.toDataURL('image/jpg')
    let date = moment(new Date()).format('DD-MM-yyyy')
    let time = moment(new Date()).format('HH:mm')
    let printInfo = { 
      printer: printer, 
      stamp: stamp_img, 
      date: date, time:time 
    }
    if (amount < 99) {
      alert('El monto debe ser mayor o igual a $100')
    } else {
      const findPrinter = await ipcRenderer.invoke('find-printer', printer)
      if (findPrinter) {
        ipcRenderer.send('print', printInfo)
      } else {
        alert('Impresora no encontrada')
      }
    }
    
  }

  return (
    <>
      <br />
      <br />
      <br />
      <AppPaper title={'Información Boleta'}>
        <form onSubmit={(e) => { e.preventDefault(); handlePrint() }}>
          <Grid container spacing={2} direction={'column'} p={1}>
            <Grid item>
              <TextField
                label={'Monto'}
                value={utils.renderMoneystr(amount)}
                inputProps={{ min: 100 }}
                onChange={(e) => { e.target.value === '$ ' || e.target.value === '$' || e.target.value === '0' || e.target.value === '' ? setAmount(0) : setAmount(utils.moneyToInt(e.target.value)) }}
                required
                fullWidth
                autoFocus
              />
            </Grid>
            <Grid item textAlign={'right'}>
              <Button variant='contained' color='primary' type='submit'>Enviar</Button>
            </Grid>
          </Grid>
        </form>
      </AppPaper>
    </>
  )
}



