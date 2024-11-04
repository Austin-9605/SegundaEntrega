const { Router } = require('express');
const { CartManager } = require("../dao/cartManager.js")
const fs = require('fs/promises');
const router = Router()

const cartManager = new CartManager("./src/data/carts.json")

router.post('/', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json({ message: "Nuevo carrito creado", newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(Number(cid)); 
        if (cart) {
            res.status(200).json(cart); 
        } else {
            res.status(404).json({ message: `Carrito con id ${cid} no encontrado.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);

        if (isNaN(cid) || isNaN(pid)) {
            return res.status(400).send({ message: "El id del carrito y el id del producto deben ser numéricos" });
        }

        const data = await fs.readFile("./src/data/products.json", { encoding: 'utf-8' });
        const products = JSON.parse(data);

        const maxProductId = products.reduce((max, product) => Math.max(max, product.id), 0);
        if (pid > maxProductId) {
            return res.status(400).send({ message: `El id del producto ingresado (${pid}) es mayor que el ID máximo existente (${maxProductId}).` });
        }

        const carritoActualizado = await cartManager.addProductToCart(cid, pid);
        res.status(200).json({ message: "Producto agregado al carrito", cart: carritoActualizado });
    } catch (error) {
        if (error.message.includes("no encontrado")) {
            return res.status(404).send({ message: error.message });
        }
        res.status(500).send({ message: error.message });
    }
});



module.exports = { router }