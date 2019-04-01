const express = require('express')
const mustacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const app = express()

const pgp = require('pg-promise')()

const connectionString = "postgres://localhost:5432/blogdb"
const db = pgp(connectionString)
console.log(db)
app.use(bodyParser.urlencoded({ extended: false }))
app.engine('mustache',mustacheExpress())

app.set('views','./views')
// extension will be .mustache
app.set('view engine','mustache')

app.get('/view-all-posts',(req,res) => {

  db.any('SELECT postid,title,body FROM posts')
  .then((posts) => {
      res.render('view-all-posts',{posts: posts})
  })

})

app.get('/add-new-post',(req,res) => {
  res.render('add-new-post')
})

app.post('/add-new-post', (req,res) =>{

  let title = req.body.title
  let body = req.body.body

db.none('INSERT INTO posts(title,body) VALUES($1,$2);',[title,body])
  .then(() =>{
    console.log("SUCCESS")
  }).catch(error => console.log(error))
  res.send("hello world")
})


app.post('/delete-post', (req,res) =>{
  let postid = parseInt(req.body.postId)
db.none('DELETE FROM posts WHERE postid = $1',[postid])
.then(() => {
  res.redirect('/view-all-posts')
})

})


app.post('/update-post', (req,res) =>{
  let postid = parseInt(req.body.postId)
  let bodyUpdate = req.body.bodyUpdate
db.none('UPDATE posts SET body = $2 WHERE postid = $1',[postid,bodyUpdate])

.then(() => {
  res.redirect('/view-all-posts')
})

})




app.listen(3000,() => {
  console.log("Server is running...")
})
