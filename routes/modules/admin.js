const express = require('express')
const router = express.Router()

const { authenticatedAdmin } = require('../../middlewares/auth')

const adminController = require('../../controllers/admin-controller')

router.get('/restaurants/create', authenticatedAdmin, adminController.createRestaurants)
router.get('/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
router.get('/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
router.get('/restaurants', authenticatedAdmin, adminController.getRestaurants)
router.put('/restaurants/:id', authenticatedAdmin, adminController.putRestaurant)
router.post('/restaurants', authenticatedAdmin, adminController.psotRestaurants)


router.get('/allorders', authenticatedAdmin, adminController.getAllOrders)
router.get('/dailyorder/:date', authenticatedAdmin, adminController.getDailyOrder)

router.get('', (req, res) => res.redirect('/admin/allorders'))

module.exports = router