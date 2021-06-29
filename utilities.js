const url = require('url')

const request_url = "/api/posts?id=1"
const originalUrl = `http://localhost:8080${request_url}`

const current_url = new URL(originalUrl)

const hostname = current_url.hostname
const pathname = current_url.pathname
const searchParams = current_url.searchParams
const method = current_url.method

const fullURL = req => `${req.protocol}://${req['host']}:${req['port']}${req.url}`

const req = {
    protocol: 'http',
    host: 'localhost',
    port: '8080',
    url: '/api/posts'
}
const result = fullURL(req)

console.log(result)
