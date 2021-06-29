let posts = require('./posts')

function findAll() {
    return new Promise((resolve, reject) => {
        resolve(posts)
    })
}

function findById(id) {
    return new Promise((resolve, reject) => {
        let post = posts.find(post => post.id === Number(id))
        if (post) 
            resolve(post)
        else 
            reject(`Post with ID ${Number(id)} NOT FOUND`)
    })
}

const create = post => {
    return new Promise((resolve, reject) => {
        let id = posts[posts.length - 1].id + 1
        const newPost = {
            id: id,
            ...post,
        }
        posts = {
            ...posts,
            newPost,
        }
        resolve(newPost)
    })
}

const deleteById = id => {
    return new Promise((resolve, reject) => {
        let deletedPost = posts.find(post => post.id === Number(id))
        if (deletedPost) {
            posts = posts.filter(post => post.id === Number(id))
            resolve(deletedPost)
        } else {
            reject(deletedPost)
        }
    })
}

const updateById = async (id, body) => {
    try {
        const { title, description } = body
        let post = await findById(id)
        return new Promise((resolve, reject) => {
            if (post) {
                newPost = {
                    id,
                    title : title ? title : post.title,
                    description : description ? description : post.description,
                }
                const index = posts.findIndex(post => post.id === Number(id))
                posts[index] = newPost
                console.log(posts)
                resolve(newPost)
            } else {
                reject(post)
            }
        })
    } catch (error) {
        console.log(error)
    }
    
}
module.exports = {
    findAll,
    findById,
    create,
    deleteById, 
    updateById,
}