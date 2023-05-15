const { app, BrowserWindow, ipcMain, webContents } = require('electron')
const path = require('path');
const url = require('url');
const port = 3003


//// --------> CONFIG JSON APP <-------/////////
const fs = require('fs')
const filePathConfig = path.join(__dirname, './config.json')
const rawDataConfig = fs.readFileSync(filePathConfig)
const config = JSON.parse(rawDataConfig)

///// --------> NODE ENV <-------/////////
const env = process.env.NODE_ENV
//const env = 'build'
///// --------------------------/////////



///// --------> EXPRESS CONFIG <-------/////////
const express = require('express');
const exp = express()

exp.set('json spaces', 2)
exp.use(express.json())
exp.use(express.urlencoded({ extended: false }))
const cors = require('cors')
exp.use(cors({ origin: '*' }))
exp.use(express.static(path.join(__dirname, './out')))

exp.use(require('./printRoute'))

exp.get('/', (req, res) => {
	res.send('Server Work')
})

exp.listen(port, () => {
	console.log('app listening at http://localhost:' + port)
})


/////// --------> ELECTRON CONFIG <-------/////////
const createWindow = () => {
	var win = new BrowserWindow({
		width: 350,
		height: 500,
		minWidth: 300,
		minHeight: 500,
		webPreferences: {
			contextIsolation: false,
			nodeIntegration: true,
			enableRemoteModule: true,
			webSecurity: false
		},
	})
	var splash = new BrowserWindow({
		width: 500,
		height: 375,
		frame: false,
		alwaysOnTop: true
	})
	win.hide()
	splash.center()
	splash.hide()
	if (env == 'build') {
		splash.center()
		win.loadURL('http://localhost:' + port)
		splash.loadURL(url.format({
			pathname: path.join(__dirname, './splash/splash.html'),
			protocol: 'file',
			slashes: true
		}))
		setTimeout(function () {
			splash.show()
			setTimeout(function () {
				splash.close();
				win.show();
			}, 6000);
		}, 2000)
	} else {
		ejecuteNext(win, splash)
	}
}

// Verificar si ya hay una instancia de la aplicación en ejecución
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock){
	app.on('ready', createWindow)
}


app.on('window-all-closed', () => {
	app.quit()
})

function ejecuteNext(win, splash) {
	/////// --------> NEXT SERVER <-------/////////
	const { createServer } = require('http');
	const next = require('next');
	const dev = env !== 'production';
	const nextApp = next({ dev });
	const handler = nextApp.getRequestHandler();
	win.hide()
	splash.hide()
	splash.center()

	nextApp
		.prepare()
		.then(() => {
			const server = createServer((req, res) => {
				if (req.headers['user-agent'].indexOf('Electron') === -1) {
					res.writeHead(404);
					res.end()
					return
				}
				return handler(req, res);
			});
			server.listen(3000, (error) => {
				if (error) throw error
			})
			if (dev) {
				win.webContents.openDevTools();
			}
			win.loadURL('http://localhost:3000')

			win.on('close', () => {
				win = null;
				server.close();
			});
			splash.loadURL(url.format({
				pathname: path.join(__dirname, './splash/splash.html'),
				protocol: 'file',
				slashes: true
			}))
			setTimeout(function () {
				splash.show()
				setTimeout(function () {
					splash.close();
					win.show();
				}, 6000);
			}, 2000)
		})
}


/////// --------> IPC COMMUNICATION <-------/////////


ipcMain.on('read-config', (e, arg) => {
	e.returnValue = config
})

ipcMain.on('update-config', (e, arg) => {
	let rawDataConfig = fs.readFileSync(filePathConfig)
	let config = JSON.parse(rawDataConfig)
	config.printer = arg
	data = JSON.stringify(config)
	fs.writeFileSync(filePathConfig, data)
})

/////// --------> IPC PRINT COMMUNICATION <-------/////////
const escpos = require('escpos')
escpos.USB = require('escpos-usb')
const usb = require('usb')

ipcMain.on('print', (e, printInfo) => {
	const device = new escpos.USB(printInfo.printer.idVendor, printInfo.printer.idProduct)
	const options = { encoding: "GB18030" /* default */ }
	const printer = new escpos.Printer(device)
	let stamp = printInfo.stamp
	let total = 678
	let folio = 123456
	let iva = 19

	console.log(typeof printInfo.date )

	escpos.Image.load(stamp, function (image) {

		device.open(function () {
			printer
			.font('b').align('ct').style('NORMAL')
            .size(0, 0)
            .text('_________________________________________')
            .text('')
            .size(1, 0)
            .text('BOLETA ELECTRONICA')
            .size(0, 0)
            .text('Nro: ' + folio)
            .text('')
            .text('_________________________________________')
            .text('')
                   .text('TRIMATH FERRETERIA')
                    .text('76.554.369-K')
                    .text('Anibal Pinto #96')
                    .text('_________________________________________')
                    .size(1, 0)
                    .text('')
                    .text('TOTAL: ' + renderMoneystr(total))
                    .text('')
                    .size(0, 0)
                    // let date_line = 'fecha: ' + printInfo.date + 'hora: ' + printInfo.time
                    // .text('')
                    // let iva_line = 'El iva de esta boleta es: ' + renderMoneystr(parseInt(iva))
                    // .text(iva_line)
                    // .text('')
				.text('fecha: ' + printInfo.date + ' hora: ' + printInfo.time)
                    //.text(date_line)
			
				.align('ct')
				.image(image, 'd24')
				.then(() => {
					printer
                    .text('Timbre Electronico SII')
                    .text('Res. Nro 80 de 2014-08-22')
                    .text('Verifique Documento en www.lioren.cl/consultabe')
                    .text('')
					.cut()
					.close()
				})
	})
	})
})

ipcMain.handle('find-printer', (e, printer) => {
	try {
		let devices = usb.getDeviceList()
		const idVendor = parseInt(printer.idVendor) 
		const idProduct = parseInt(printer.idProduct) 

		const device = devices.find(dev => dev.deviceDescriptor.idVendor === idVendor && dev.deviceDescriptor.idProduct === idProduct);

		if (device) {
			console.log('Dispositivo encontrado')
			return true
		} else {
			console.log('Dispositivo no encontrado')
			return false
		}
	} catch (err) {
		console.log('Dispositivo no encontrado')
		return false
	}
})



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
  
	


// ipcMain.on('print', (event, content) => {
// 	const win = webContents.getAllWebContents()[0];
// 	const win = new BrowserWindow({
// 		width: 300,
// 		height: 600,
// 		show: false, // Ventana en modo oculto
// 		webPreferences: {
// 			nodeIntegration: true
// 		}
// 	})

// 	win.webContents.getPrintersAsync().then((printers) => {
// 		console.log(printers)
// 	})



// 	win.loadURL('data:text/html;charset=utf-8,' + encodeURI(content))

// 	win.loadURL(url.format({
// 		pathname: path.join(__dirname, './splash/splash.html'),
// 		protocol: 'file',
// 		slashes: true
// 	})).then(() => {
// 			win.webContents.print({
// 			silent: false,
// 			printBackground: true,
// 			deviceName: '',
// 		}, (success) => {
// 			if (!success) {
// 				event.reply('print-reply', 'Error al imprimir.');
// 			}
// 		});
// 	}).catch((error) => {
// 		event.reply('print-reply', 'Error al imprimir.');
// 	});

// 	const code = 'kjankhakhlakjhdksjhdlkasjhdlakjhsdlkajhsdlkaj'
// 	let canvas = win.webContents.id
// 	PDF417.draw(code, canvas)
// 	win.webContents.executeJavaScript(`
// 	canvas =  document.getElementById('code'))
// 	canvas.innerHTML = "<H1>juanininini</H1>"')


// 	`)

	
// 	win.show()



// 	win.webContents.print({
// 		silent: true,
// 		printBackground: false,
// 		deviceName: '',
// 	}, (success) => {
// 		if (!success) {
// 			event.reply('print-reply', 'Error al imprimir.');
// 		}
// 	});

// });



