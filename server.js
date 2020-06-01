var express = require('express');
var formidable = require('express-formidable');
var fs = require('fs');

var app = express();
app.use(formidable());

const readFile = fn => {
  fs.readFile(`${__dirname}/data/posts.json`, fn)
}

const addNewPosts = (post, filePath, callback) => {
  readFile((error, file) => {
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
    const callback = error => error ? console.log('Hubo un error!'): console.log('Post guardado con existo!')

    addNewPosts(post, filePath, callback)
    res.send('ok')
})


app.get("/get-posts", (req, res) => {
  readFile((error, file) => {
    return res.sendFile(__dirname + '/data/posts.json')
  })
})


app.use(express.static("public"));

app.listen(3000, function () {
  console.log('Server is listening on port 3000. Ready to accept requests!');
});
