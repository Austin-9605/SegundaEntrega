const { Router } = require('express');
const { ProductManager } = require("../dao/ProductManager.js")
const router = Router()


const productManager = new ProductManager("./src/data/products.json")

router.get("/", async (req, res) => {
    try {
        let productos = await productManager.getProducts()
        res.setHeader("content-Type", "application/json");
        return res.status(200).json({ productos });
    } catch (error) {
        return res.status(500).send(`Error: ${error.message}`)

    }
})

router.get("/:pid", async (req, res) => {
    const pid = parseInt(req.params.pid);
    if (isNaN(pid)) {
        return res.status(400).send({ message: "El id debe ser numérico" });
    }

    try {
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).send({ message: `No existen productos con id ${pid}` });
        }
        res.status(200).send(product);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.post("/", async (req, res) => {
    let { title, id, description, code, price, status, stock, category, ...otros } = req.body;
    // ... operador "rest"
    if (id) {
        return res.status(400).send({ message: "El id no debe ser indicado." });
    }
    if (!title) {
        return res.status(400).send({ message: `title es requerido.` })
    }
    if (!description) {
        return res.status(400).send({ message: "La descripción es requerida." });
    }
    if (!code) {
        return res.status(400).send({ message: "El código es requerido." });
    }
    if (!price) {
        return res.status(400).send({ message: "El precio es requerido." });
    }
    if (!stock) {
        return res.status(400).send({ message: "El stock es requerido." });
    }
    if (!category) {
        return res.status(400).send({ message: "El category es requerido." });
    }
    if (!status) {
        return res.status(400).send({ message: "El status es requerido." });
    }
    try {

        let productos = await productManager.getProducts()
        let productoExistente = productos.find(producto => producto.code === code);
        if (productoExistente) {
            return res.status(400).send({ message: `El código ${code} ya está en uso. Intenta con otro.` });
        }

        let nuevoProducto = await productManager.addProduct({ title, description, code, price, status, ...otros })

        req.serverSocket.emit("nuevoProducto", nuevoProducto)


        res.setHeader("Content-Type", "application/json");
        return res.status(201).json({ nuevoProducto })

    } catch (error) {
        res.status(500).send({ message: error.message });
    }


})

router.put("/:pid", async (req, res) => {
    let aMoidificar = req.body

    if (aMoidificar.id) {
        res.setHeader("Content-Type", "application/json");
        return res.status(400).json({ error: `No puede modificarse la propiedad id` })
    }

    try {
        const pid = parseInt(req.params.pid);

        const producto = await productManager.getProductById(pid);
        if (isNaN(pid)) {
            return res.status(400).send({ message: "El id debe ser numérico" });
        }
        if (!producto) {
            return res.status(404).send({ message: `No existen productos con id ${pid}` });
        }

        let productoModificado = await productManager.modifyProduct(pid, aMoidificar)
        res.status(200).send(productoModificado);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

router.delete("/:pid", async (req, res) => {

    try {
        const pid = parseInt(req.params.pid);

        const product = await productManager.getProductById(pid);
        if (isNaN(pid)) {
            return res.status(400).send({ message: "El id debe ser numérico" });
        }
        if (!product) {
            return res.status(404).send({ message: `No existen productos con id ${pid}` });
        }

        let productoEliminado = await productManager.deleteProduct(pid)

        req.serverSocket.emit("productoEliminado", productoEliminado);


        res.setHeader("Content-Type", "application/json")
        res.status(200).json(productoEliminado);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});



module.exports = { router }