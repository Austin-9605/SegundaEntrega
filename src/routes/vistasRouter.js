const { Router } = require('express');
const router = Router()

router.get("/products", (req, res) => {
 res.render("index", {})
})

router.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts", {})
   })

   module.exports = { router }