const express = require('express')
const router = express.Router()
const escpos = require('escpos')
const moment = require('moment')
escpos.USB = require('escpos-usb')




router.post('/print/test', (req, res) => {
    test(req.body.printerInfo)
        .then(() => {
            res.json({ status: 'success' })
        })
        .catch(err => {
            console.log(err)
            res.json(err)
        })
})



function test(printerInfo) {
    const print = new Promise((resolve, reject) => {
        try {
            const device = new escpos.USB(parseInt(printerInfo.idVendor), parseInt(printerInfo.idProduct))
            const options = { encoding: "GB18030" /* default */ }
            const printer = new escpos.Printer(device, options)
            device.open(function (error) {
                printer.close()
                resolve({ code: 1, data: 'success' })
            })
            device.close()
        } catch (err) {
            reject({ code: 0, data: err })
        }
    })
    return print
}

router.post('/print/ticket', (req, res) => {
    ticket(req.body.total, req.body.printerInfo, req.body.timbre_img, req.body.iva, req.body.folio)
        .then(() => {
            res.json({ status: 'success' })
        }).catch(err => {
            console.log(err)
            res.json(err)
        })
})

function ticket(total, printerInfo, timbre_img, iva, folio) {
    const print = new Promise((resolve, reject) => {
        try {
            const device = new escpos.USB(parseInt(printerInfo.idVendor), parseInt(printerInfo.idProduct))
            const options = { encoding: "GB18030" /* default */ }
            const printer = new escpos.Printer(device, options)
            escpos.Image.load(timbre_img, function (image) {
                device.open(function (error) {
                    printer.font('b').align('ct').style('NORMAL')
                    printer.size(0, 0)
                    printer.text('_________________________________________')
                    printer.text('')
                    printer.size(1, 0)
                    printer.text('BOLETA ELECTRONICA')
                    printer.size(0, 0)
                    printer.text('Nro: ' + folio)
                    printer.text('')
                    printer.text('_________________________________________')
                    printer.text('')
                    printer.text('TRIMATH FERRETERIA')
                    printer.text('76.554.369-K')
                    printer.text('Anibal Pinto #96')
                    printer.text('_________________________________________')
                    printer.size(1, 0)
                    printer.text('')
                    printer.text('TOTAL: ' + renderMoneystr(total))
                    printer.text('')
                    printer.size(0, 0)
                    let today = new Date()
                    let date = moment(today).format('DD-MM-yyyy')
                    let time = moment(today).format('HH:mm:ss')
                    let date_line = 'fecha: ' + date + ' hora: ' + time
                    printer.text('')
                    let iva_line = 'El iva de esta boleta es: ' + renderMoneystr(parseInt(iva)) 
                    printer.text(iva_line)
                    printer.text('')
                    printer.text(date_line)
                    printer.image(image, 'd24')
                        .then(() => {
                            printer.text('')
                            printer.text('Timbre Electronico SII')
                            printer.text('Res. Nro 80 de 2014-08-22')
                            printer.text('Verifique Documento en www.lioren.cl/consultabe')
                            printer.text('')
                            // printer.cashdraw(2)
                            printer.cut()
                            printer.close()
                        })
                    
                })
            })
            device.close()
            resolve({ 'code': 1, 'data': 'success' })

        } catch (err) {
            reject({ 'code': 0, 'data': err })
        }
    })
    return print
}

function renderMoneystr(value) {
    if (value < 0) {
        value = value.toString()
        value = value.replace(/[^0-9]/g, '')
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        value = '$ -' + value
        return value
    } else {
        value = value.toString()
        value = value.replace(/[^0-9]/g, '')
        value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        value = '$ ' + value
        return value
    }
}


module.exports = router