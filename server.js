const http = require('http')
const url = require('url')

const postController = require('./postController')

const fullURL = req => `${req.protocol}'://'${req.get('host')}:${req.get('port')}req.url`

function getBodyDataStr(req) {
    return new Promise((resolve, reject) => {
        try {
            let body = ''
            req.on('data', chunk => {
                body += chunk.toString()
            })
            req.on('end', () => {
                resolve(body)
            })
        } catch (error) {
            reject(error)
        }
    })
}

const server = http.createServer(async function(req, res) {
    const method = req.method
    const currentURL = new URL(`http://localhost:8080${req.url}`)
    const pathName = currentURL.pathname
    const seachParams = currentURL.searchParams

    if (pathName === '/api/posts' && method === 'GET' && !seachParams.has('id')) {
        try {
            const posts = await postController.findAll()
            res.writeHead(200, { 'Content-Type' : 'application/json'})
            res.end(JSON.stringify(posts))
        } catch (error) {
            res.writeHead(404, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify({ message: 'GET>> Error with findAll' }))
        }
    } else if (pathName === '/api/posts' && method === 'GET' && seachParams.has('id')) {
        try {
            const id = seachParams.get('id')
            const post = await postController.findById(id)
            res.writeHead(200, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify(post))
        } catch (error) {
            res.writeHead(404, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify({ message: 'GET>> Error with findById' }))
        }
    } else if (pathName === '/api/posts' && method === 'POST') {
        try {
            const body = await getBodyDataStr(req)
            const { title, description } = JSON.parse(body)
            const newPost = await postController.create({ title, description })
            res.writeHead(201, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify(newPost))
        } catch (error) {
            res.writeHead(400, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify({ message : 'POST>> Error with create' }))
        }
    } else if (pathName === '/api/posts' && method === 'DELETE' && seachParams.has('id')) {
        try {
            const id = seachParams.get('id')
            const deletedPost = await postController.deleteById(id)
            res.writeHead(200, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify({ message: 'POST deleted successfully!!!', content: deletedPost }))
        } catch (error) {
            res.writeHead(404, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify({ message : 'DELETE>> POST NOT FOUND ???' }))
        }
    } else if (pathName === '/api/posts' && method === 'PATCH' && seachParams.has('id')) {
        try {
            const id = seachParams.get('id')
            const body = getBodyDataStr(req)
            const updatedPost = await postController.updateById(id, JSON.parse(body))
            res.writeHead(200, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify(updatedPost))
        } catch (error) {
            res.writeHead(404, { 'Content-Type' : 'application/json' })
            res.end(JSON.stringify({ message : 'PATCH>> POST NOT FOUND ???' }))
        }
    } else {
        res.writeHead(404, { 'Content-Type' : 'application/json' })
        res.write(JSON.stringify({ message: `${currentURL.origin.toUpperCase() } NOT FOUND <?>` }))
        res.end()
    }
})

const PORT = process.env.PORT || 8080
server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}!!!`))


