const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

//User model
const User = require('../models/User')
//  login page
router.get('/login',(req,res) => res.render('login'))

//  register page
router.get('/register',(req,res) => res.render('register'))

//register handle

router.post('/register',(req,res) => {
    const{name,email,password,password2 } = req.body
    
    let errors = []
    //check reqiured fields
    if(!name || !email || !password || !password2){
        errors.push({msg:'please fill in the gap'})

    }
    // check passwords match

    if(password !== password2){
        errors.push({msg:'passwords do not match'})
    }

    //password length
    if(password.lenght < 6){
        errors.push({msg:'password should not be less than 6 characters '})
    }
    if(errors.lenght > 0){
        res.render('/register',{
            errors,
            name,
            email,
            password,
            password2

        })

    }else{
        // validation pass
        User.findOne({email: email})
        .then(user => {
            if(user){
                //email exists
                errors.push({msg:'Email is alredy registed'})
                res.render('/register',{
                    errors,
                    name,
                    email,
                    password,
                    password2
        
                })
            }else{
                const newUSer = new User({
                    name: name,
                    email: email,
                    password: password

                })
                //hashed pass
                bcrypt.genSalt(10,(err,salt) => 
                bcrypt.hash(newUSer.password,salt,(err,hash)=>{
                    if (err) throw err
                    //set pass to hashed
                    newUSer.password = hash
                    //save user
                    newUSer.save()
                    .then(user =>{
                        req.flash('success_msg','You are now registed and can log in')
                        res.redirect('/users/login')
                    })
                    .catch(err => console.log(err))

                }))

            }
        })
    }
})

// Login handle
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
    })(req, res, next)
  })
  // Logout handle 
router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', 'You are logged out')
    res.redirect('/users/login')
  })
module.exports = router;