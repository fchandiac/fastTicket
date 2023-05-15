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
  const [ticketInfo, setTicketInfo] = useState(ticketInfoDataDefault())
  

  useEffect(() => {
    let config = ipcRenderer.sendSync('read-config', 'sync')
    setPrinter(config.printer)
    setTicketInfo(config.ticket_info)
  }, [])

  const printTicket = async () => {
    if (amount < 99) {
      alert('El monto debe ser mayor o igual a $100')
    } else {
      const findPrinter = await ipcRenderer.invoke('find-printer', printer)
      if (findPrinter) {
        const data = await lioren.boleta(amount)

        let timbre = data[0]
        let canvas = document.createElement('canvas')
        PDF417.draw(timbre, canvas, 2, 2, 1.5)
        let stamp_img = canvas.toDataURL('image/jpg')
        let date = moment(new Date()).format('DD-MM-yyyy')
        let time = moment(new Date()).format('HH:mm')
        let printInfo = {
          printer: printer,
          stamp: stamp_img,
          date: date, time: time,
          name: ticketInfo.name,
          rut: ticketInfo.rut,
          address: ticketInfo.address,
          phone: ticketInfo.phone,
          total: amount,
          iva: data[1],
          invoiceNumber: data[2],
        }
        ipcRenderer.send('print', printInfo)
        setAmount(0)

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
        <form onSubmit={(e) => { e.preventDefault(); printTicket() }}>
          <Grid container spacing={2} direction={'column'} p={1}>
            <Grid item>
              <TextField
                label={'Monto'}
                value={utils.renderMoneystr(amount)}
                inputProps={{ min: 100 }}
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

