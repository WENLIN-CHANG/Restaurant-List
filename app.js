const express = require('express')
const { engine } = require('express-handlebars')
const app = express()
const port = 3000
const restaurants = require('./public/jsons/restaurant.json').results

app.engine('.hbs', engine({extname: '.hbs'}))
app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect('/restaurants')
})

app.get('/restaurants', (req, res) => {
  res.render('index', {restaurants: restaurants})
})

app.get('/restaurant/:id', (req, res) => {
  const id = req.params.id
  const restaurant = restaurants.find((restaurant) => restaurant.id.toString() === id)
  res.render('detail', {restaurant})
})

// 添加搜索路由
app.get('/search', (req, res) => {
  const keyword = req.query.keyword ? req.query.keyword.trim().toLowerCase() : '';
  const filteredRestaurants = keyword
    ? restaurants.filter(restaurant => {
        return (restaurant.name && restaurant.name.toLowerCase().includes(keyword)) ||
               (restaurant.category && restaurant.category.toLowerCase().includes(keyword)) ||
               (restaurant.description && restaurant.description.toLowerCase().includes(keyword));
      })
    : restaurants;
  
  res.render('index', { restaurants: filteredRestaurants, keyword: keyword });
});

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})
