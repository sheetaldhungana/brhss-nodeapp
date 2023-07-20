//import express
const express = require('express')
const mongoose = require('mongoose')
const Post = require('./model/post')
const upload = require('express-fileupload')

const app = express()//similar to=> Express app= new Express();
var dbURL = 'mongodb+srv://dhunganashital786:qwertyuiop@bhss-node-app.ostox64.mongodb.net/?retryWrites=true&w=majority'
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => {
        console.log('Connect to mongoDB successful.');
        app.listen(4000, () => {
            console.log('listening on 4000')
        })

    })
    .catch((error) => {
        console.log('DB Connect Failed', error);
    })



//setting view engine
app.set('view engine', 'ejs')


//middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true })) //to retrieve data from POST request
app.use(express.json()) // post garay ko value  json format ma xu vanay ra vanay ko
app.use(upload())


//routes
//home page[GET]
app.get('/', (req, res) => {
    // res.end('Request for Home Page')
    let title = 'BRSS'
    Post.find()//array of post
        .then((result) => {
            console.log(result)
            res.render('index', { title, posts: result })

        })
        .catch((error) => {
            console.log(error)
            res.end(error.message)
        })
})

//create new post form[GET]
app.get('/posts/create', (req, res) => {

    let title = 'BRSS -Create new post'
    res.render('create-post', { title })
})

//store new post [POST]
app.post('/posts', (req, res) => {
    if (req.files) {
        let file = req.files.image
        let fileName = 'brhss_' + file.name
        let fileURL = '/uploads/' + fileName
        let fileUploadPath = './public' + fileURL
        console.log('image file url:', fileURL)
        file.mv(fileUploadPath, (err) => {
            if (err)
                res.end(err.message)

            else {
                console.log("Image uploaded successfully")




                const post = new Post(req.body)
                post.image = fileURL
                //new instamce of Post schema
                //saving to mongooes
                post.save()
                    .then((result) => {
                        console.log('Successfully saved')
                        res.redirect('/')  //redirect to home page

                    })
                    .catch((error) => {
                        console.log('Cannotsave the post to mongoDB', error.message)
                    })
            }
        })
    }
})

//show single post [GET] //  let postId=req.params.id aadi app.get('/posts/:id', (req, res) => { :id ma :abc vaya ko vaya params.abc garanu parxa
app.get('/posts/:id', (req, res) => {
    title = "Post details"
    let postId = req.params.id
    // console.log(postId)
    //reterive single post from mongoes
    Post.findById(postId)
        .then((result) => {
            res.render('post-details', { title, post: result })
        })
        .catch((error) => {
            res.end(error.message)
        })
})

//delete post[DELETE]
app.delete('/posts/:id', (req, res) => {
    /*  console.log(req.url);
      console.log('delete request received');*/
    let postId = req.params.id
    Post.findByIdAndDelete(postId)
        .then((result) => {
            res.json({
                message: "successFully deleted post.",
                redirect: "/"
            })
        })
        .catch((error) => {
            res.end(error.message)
        })
})

//open edit form [GET]
app.get('/posts/:id/edit', (req, res) => {
    let title = "Update post."
    let postId = req.params.id
    Post.findById(postId)
        .then((result) => {

            res.render("update-post", { title, post: result })
        })
        .catch((error) => {
            res.end(error.message)
        })
})

//update post [PUT]
app.put('/posts/:id', (req, res) => {
    let postId = req.params.id
    let post = req.body

    Post.findByIdAndUpdate(postId, post)
        .then((result) => {
            res.json({
                message: "Successfully update", //alert of app.js
                redirect: '/posts/' + postId
            })
        })
        .catch((error) => {
            res.status(500).end(error.message)
        })

})


//about page
app.get('/about', (req, res) => {
    // res.end('Request for Home Page11')
})

//sign up user [POST]
app.post("/sign-up", (req, res) => { })

///search
app.get('/search', (req, res) => {
    let searchQuery = req.query.q
    let title = 'Search Results'
    console.log(req.query.q)

    Post.find({ $text: { $search: searchQuery } })
        .then((result) => {
            res.render('search', { title, posts: result })
        })
        .catch((error) => {
            res.end(error.message)
        })
})


//not found
app.use((req, res) => {
    res.end('404 Not Found')
})
