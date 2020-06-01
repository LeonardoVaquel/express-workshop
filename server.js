var formidable = require('express-formidable');
var express = require('express');
var fs = require('fs');

var app = express();
app.use(formidable());

const dataBasePath = `${__dirname}/data/posts.json`

const readFileAndDo = fn => fs.readFile(dataBasePath, fn)

const addNewPosts = (post, filePath, callback) => {
  readFileAndDo((error, file) => {
    const posts = JSON.parse(file)
    let date = Date.now()
    const newPost = {}
    newPost[date] = post['blogpost']
    const data = Object.assign(posts, newPost)

    fs.writeFile(filePath, JSON.stringify(data), callback)
  })
}


app.post("/create-post", (req, res) => {
    const post = req.fields;
    const filePath = 'data/posts.json';
    const callback = error => error ?
      console.log('Error!: ', error):
      console.log('Post saved!', post)

    addNewPosts(post, filePath, callback)
    res.send('ok')
})


app.get("/get-posts", (req, res) => {
  readFileAndDo((error, file) => {
    return res.sendFile(dataBasePath)
  })
})


app.use(express.static("public"));

app.listen(3000, function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});
