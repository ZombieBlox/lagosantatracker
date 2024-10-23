let express = require("express")
let path = require("path")

let html = require("html")

let fs = require("node:fs")
const { copyFileSync } = require("fs")

let port = 8080

let app = express()

app.set('view engine', 'html');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'assets')));
app.use(express.static(__dirname));

function renderError(res) {
    res.sendFile(path.join(__dirname, "public", "error.html"))
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "village.html"))
})

app.get("/scenes/:scene", (req, res) => {
    let scene = req.params.scene

    if (!scene) {
        res.send("")
        return
    }

    let dir = path.join("scenes", scene)

    if (fs.existsSync(dir)) {
        res.render(path.join(dir, "index"))
    } else {
        renderError(res)
    }
})

app.all("*", (req, res) => {
    renderError(res)
})

app.listen(port, () => {
    console.log(`Port ${port}`)
})