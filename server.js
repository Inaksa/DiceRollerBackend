const http = require('node:http')

const servidor = http.createServer((pedido, respuesta) => {
    console.log(pedido.url)
    respuesta.writeHead(200, { 'Content-Type': 'text/html' })

    switch (pedido.url) {
        case "/url":
            respuesta.write("Pedida la url /url")
            break
        default:
            respuesta.write("No se que pediste: " + pedido.url)
            break
    }
    //respuesta.write(`<!doctype html><html><head></head><body><h1>Sitio en desarrollo</h1></body></html>`)
    respuesta.end()
})


servidor.listen(8888)

console.log('Servidor web iniciado')

