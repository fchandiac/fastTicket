
const url = "http://localhost:3003/"

function test(printerInfo){
    let data = { printerInfo }
    const print = new Promise((resolve, reject) => {
        fetch(url + 'print/test', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject('printer Error')
                } else {
                    resolve(res)
                }
            })
        }).catch(err => { 
            reject('printer Error') })
    })
    return print
}

function ticket(total, printerInfo, timbre_img, iva, folio){
    let data = { total, printerInfo, timbre_img, iva, folio }
    const print = new Promise((resolve, reject) => {
        fetch(url + 'print/ticket', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject('printer Error')
                } else {
                    resolve(res)
                }
            })
        }).catch(err => { 
            reject('printer Error') })
    })
    return print
}


export { test, ticket }