const express = require("express");
const { Server } = require("socket.io")
const { router: productosRouter } = require('./routes/productosRouter.js');
const { router: carritosRouter } = require('./routes/carritosRouter.js');
const { router: vistasRouter } = require("./routes/vistasRouter.js")
const { engine } = require("express-handlebars");

const PORT = 8080
const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    "/api/products",
    (req, res, next) => {
        req.serverSocket=io

        
        next()
    },
    productosRouter)


app.use("/api/carts", carritosRouter)
//--
app.use(express.static("./src/public"))

app.engine("handlebars", engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")

app.use("/", vistasRouter)
//--

app.get("/", (req, res) => {
    res.setHeader("content-Type", "text/plain");
    res.status(200).send("OK");
})

const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`)
})

//- io config
const io=new Server(server) // const io=new Server(server)
// .on escucha
// .emit emite mensajes



