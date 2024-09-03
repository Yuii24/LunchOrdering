const { Order, User, Restaurant, Meal, Personalorder, Mealorder } = require('../models')
const { sequelize } = require('../models')
const { Op } = require('sequelize');
const bcrypt = require('bcrypt')

const orderController = {
  getOrderingRest: (req, res, next) => {
    Order.findAll({
      where: {
        isOpen: true
      },
      include: [Restaurant],
      order: [
        ['createdAt', 'DESC']
      ]
    })
      .then(orders => {
        const orderDate = orders.map(orders => orders.toJSON())
        return res.render('orderingrest', { orders: orderDate })
      })
  },
  getOrderPage: (req, res, next) => {
    const orderId = req.params.id
    Order.findByPk(orderId, {
      include: [
        {
          model: Restaurant,
          include: [{
            model: Meal
          }]
        }]
    })
      .then(order => {
        if (!order) throw new Error("此餐廳不存在！")

        const restaurant = order.Restaurant ? order.Restaurant : []
        const meals = order.Restaurant.Meals ? order.Restaurant.Meals : []

        const mealsData = meals.map(meals => meals.toJSON())

        return res.render('orderpage', { order: order.toJSON(), restaurant: restaurant.toJSON(), meals: mealsData })
      })
      .catch(err => next(err))
  },
  postOrdering: async (req, res, next) => {
    let { name, employeeId } = req.body

    try {
      const orderId = req.params.id;

      const order = await Order.findByPk(orderId)
      if (!order) throw new Error("此餐廳不存在！")

      const restId = order.restaurantId;

      const restaurant = await Restaurant.findByPk(restId, {
        include: [Meal]
      });
      if (!restaurant) throw new Error('Restaurant not found')

      const orderItems = []
      let totalPrice = 0

      // forEach所有餐點
      restaurant.Meals.forEach(meal => {
        const quantity = Number(req.body[`quantity_${meal.id}`])
        const description = req.body[`description_${meal.id}`] || ''

        if (quantity && quantity > 0) {
          const mealtotal = meal.price * quantity
          totalPrice += mealtotal

          orderItems.push({
            mealsname: meal.meals,
            price: meal.price,
            quantity,
            description,
            mealtotal
          })
        }
      })

      const personalorder = await Personalorder.create({
        name: req.user.name,
        employeeId: req.user.employeeId,
        totalprice: totalPrice,
        orderId: orderId,
        userId: req.user.id,
        restaurantName: restaurant.name
      })

      const mealorderData = orderItems.map(item => ({
        meals: item.mealsname,
        price: item.price,
        quantity: item.quantity,
        description: item.description,
        mealtotal: item.mealtotal,
        personalorderId: personalorder.id,
        orderId: orderId,
        name: name,
        employeeId: employeeId,
        restaurantName: restaurant.name
      }));

      await Mealorder.bulkCreate(mealorderData)

      req.flash('success_messages', '訂餐成功！')
      res.redirect(`/orderpage/${orderId}`)

    } catch (err) {
      next(err);
    }
  },
  getOrderInfo: async (req, res, next) => {
    const orderId = req.params.id

    try {
      const [meals, order] = await Promise.all([
        // 取得餐點資料
        Mealorder.findAll({
          where: {
            orderId
          },
          attributes: [
            'meals',
            'price',
            'quantity',
            'mealtotal',
            'name',
            'description'
          ],
          raw: true,
          nest: true
        }),
        // 透過訂單編號查詢是否開啟訂餐與後續使用餐廳資料
        Order.findByPk(orderId, {
          include: [Restaurant],
          raw: true,
          nest: true
        })
      ])

      // 取得餐廳資料
      const Rest = order.Restaurant
      // 計算總金額
      const total = meals.map(meal => meal.mealtotal).reduce((acc, price) => acc + price, 0)
      // 將餐點內容組合成一個Object
      const mealsSummary = meals.reduce((acc, meal) => {
        const mealType = meal.meals
        const quantity = meal.quantity
        const price = meal.price
        const mealPrice = meal.mealtotal
        const name = meal.name
        const description = meal.description

        // 確認餐點Object是否存在，不存在就初始化
        if (!acc[mealType]) {
          acc[mealType] = {
            quantity: 0,
            price: 0,
            totalPrice: 0,
            name: [],
            description: []
          };
        }

        // 累加餐點資料
        acc[mealType].quantity += quantity
        acc[mealType].price = price
        acc[mealType].totalPrice += mealPrice
        for (let i = 0; i < quantity; i++) {
          acc[mealType].name.push(name)
        }
        if (description) {
          acc[mealType].description.push({ name, description })
        }


        return acc
      }, {});
      res.render('orderinfo', { mealsSummary, Rest, total, orderId, order })
    }
    catch (err) {
      next(err)
    }
  }
}
module.exports = orderController