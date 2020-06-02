
const express = require('express')
const session = require('express-session')
//const bodyParser = require('body-parser')
//const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('connect-flash')
//const methodOverride = require('method-override')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')


const app = express()
// passport config
require('./config/passport')(passport)
//DB config

const db = require('./config/keys').MongoURI

//connect to mongo

mongoose.connect(db,{useNewUrlParser: true})
.then(() =>console.log('MongoDB Connected...'))
.catch(err => console.log(err))

//EJS
app.use(expressLayouts)

app.set('view engine','ejs')

//Bodyparser

app.use(express.urlencoded({extended:false}))
// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  )

  //passport middleware
  app.use(passport.initialize())
  app.use(passport.session())

  // Connect flash
app.use(flash())

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})


//Routes
app.use('/',require('./routes/index'))
app.use('/users',require('./routes/users'))

const PORT = process.env.PORT || 4000

app.listen(PORT,console.log('Server started on port 4000'))



