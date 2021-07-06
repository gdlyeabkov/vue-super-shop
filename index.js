const passport = require('passport')
const jwt = require('jsonwebtoken')
var token = null

const bcrypt = require('bcrypt')
const saltRounds = 10;

const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()

app.use('/', serveStatic(path.join(__dirname, '/dist')))

app.use(express.urlencoded({ extended: true }));


var auth = false
const url = `mongodb+srv://glebClusterUser:glebClusterUserPassword@cluster0.fvfru.mongodb.net/products?retryWrites=true&w=majority`;

var options = {
    root: path.join(__dirname, 'views'),
}

const connectionParams={
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true 
}

mongoose.connect(url,connectionParams)
    .then( () => {
        console.log('Connected to database ')
    })
    .catch( (err) => {
        console.error(`Error connecting to the database. \n${err}`);
    })

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number   
});

const ProductModel = mongoose.model('ProductModel', ProductSchema);

const UsersSchema = new mongoose.Schema({
    email: String,
    password: String,
    name: String,
    age: Number,
    moneys:{
        type: Number,
        default: 0
    },
    productsInBucket:[mongoose.Schema.Types.Map]
},
{ collection : 'myusers' });

const OrderSchema = new mongoose.Schema({
    ownername: String,
    price: Number   
});

const OrderModel = mongoose.model('OrderModel', OrderSchema);

const UsersModel = mongoose.model('UsersModel', UsersSchema, 'myusers');

// var JwtStrategy = require('passport-jwt').Strategy,
//     ExtractJwt = require('passport-jwt').ExtractJwt;
// var opts = {}
// opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// opts.secretOrKey = 'secret';
// opts.issuer = 'accounts.examplesoft.com';
// opts.audience = 'yoursite.net';
// passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
//     UsersModel.findOne({id: jwt_payload.sub}, function(err, user) {
//         if (err) {
//             return done(err, false);
//         }
//         if (user) {
//             return done(null, user)
//         } else {
//             return done(null, false)
//             // or you could create a new account
//         }
//     })
// }))

// app.get('/home', passport.authenticate('jwt', { session: false }), (req, res)=>{
app.get('/home', (req, res)=>{
    //получение всех записей
    console.log('получение всех записей')
    let query = ProductModel.find({}).select(['name', 'price']);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // let security = jwt.verify(token, 'shhhhh')
    // jwt.verify(token, 'secret', function(err, decoded) {
        // if (err) {
        //     return res.json({ message: 'Failed to authenticate token.' });
        // } else {
            // if everything is good, save to request for use in other routes
            // req.decoded = decoded;
            // next();
            
            query.exec( (err, allProducts) => {
                if (err){
                    return res.json({ message: 'Failed to authenticate token.' });
                }
                if(Array(req.query.useremail)[0] === undefined){
                   console.log(allProducts)
                    // return res.json({ "allProducts": allProducts, "message": "success", "useremail": decoded.useremail })
                    return res.json({ "allProducts": allProducts, "message": "success" })
                }
                let mailOfUser = req.query.useremail
                // return res.json({ "allProducts": allProducts, "message": "success", "useremail": decoded.useremail })
                return res.json({ "allProducts": allProducts, "message": "success" })

            });

    //     }
    // });

})

app.get('/admin/orders', (req, res)=>{
    //получение всех заказов
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    let query = OrderModel.find({}).select(['ownername', 'price']);
    query.exec((err, allOrders) => {
        if (err){
            return
        }
        let mailOfUser = req.query.useremail
        res.json(allOrders)
    });
    
})
app.get('/admin/products/add', async (req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    

    if(Array(req.query.productname)[0] === undefined){
        res.send(`product not found`)
        return
    } else if(Array(req.query.productname)[0] !== undefined) {
        await new ProductModel({ name: req.query.productname, price: Number(req.query.productprice) }).save(function (err) {
            if(err){
                res.send(`product not found`)
                return
            } else {
                return res.json({ "status": "OK" })
                // res.redirect('/home')
            }
        })
    }
})

app.get('/admin/products/delete', async (req, res)=>{
    if(Array(req.query.productname)[0] === undefined){
        res.send(`product not found`)
        return
    } else if(Array(req.query.productname)[0] !== undefined) {
        await ProductModel.deleteMany({ name: req.query.productname  })
        res.redirect('/home')
        
    }
})

app.get('/product/:productID',(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // jwt.verify(token, 'secret', function(err, decoded) {
    //     if (err) {
    //         return res.json({ "message": 'Failed to authenticate token.' })
    //     } else {
            
            
            let query = ProductModel.findById(req.params.productID);
                query.exec((err, product) => {
                if (err){
                    return res.json({ "message": "success" })
                }
                return res.json({ "product": product, "message": "success" })
                console.log(product)
            })
    //     }
    // })
    
})

app.get('/users/register',(req, res)=>{
    console.log(Array(req.query.useremail)[0] === undefined)
})
app.get('/users/logout',(req, res)=>{

})

app.get('/users/bucket/delete', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // jwt.verify(token, 'secret', function(err, decoded) {
    //     if (err) {
    //         return res.json({ "message": 'Failed to authenticate token.' })
    //     } else {
            console.log(mongoose.connection.collection("myusers"))
            console.log("Удалён");
            console.log(req.query.useremail);
            console.log(req.query.productname);
            mongoose.connection.collection("myusers").updateOne(
                
                    { email: req.query.useremail },
                    { $pull: { 'productsInBucket': { name: req.query.productname } } }
            );
            return res.json({ "status": "OK", "message": "success" })
    //     }
    // })
})

app.get('/users/bucket/buy', (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // jwt.verify(token, 'secret', function(err, decoded) {
    //     if (err) {
    //         return res.json({ "message": 'Failed to authenticate token.' })
    //     } else {
            let query = UsersModel.findOne({'email': req.query.useremail }, function(err, user){
                if (err){
                    res.json({ "status": "Error", "message": "success" })
                } else {
                    if(user != null && user != undefined){
                        let commonPrice = 0
                        user.productsInBucket.forEach(function (product){
                            if(new Map(product).get('price') == null){
                                commonPrice += 0
                            } else {
                                commonPrice += new Map(product).get('price')
                            }
                        })
                        if(user.moneys >= commonPrice){
                            const order = new OrderModel({ ownername: req.query.useremail, price: commonPrice });
                            order.save(function (err) {
                                if(err){
                                    return res.json({ "message": "success" })
                                } else {
                                    console.log('заказ создан')
                                    // res.json({ "status": "OK" })
                                    // return res.json({ "message": "success" })
                                
                                    // res.json({ "status": "OK", "message": "success" })

                                }
                            });
                            
                            UsersModel.updateOne({ email: req.query.useremail }, 
                            { 
                                "$inc": { "moneys": -commonPrice }
                            }, (err, user) => {
                                if(err){
                                    return res.json({ "status": "Error", "message": "success" })
                                }
                                return res.json({ "status": "OK", "message": "success" })
                            })
                            
                        } else if(user.moneys < commonPrice){
                            console.log('нехватает денег')
                            return res.json({ "status": "Error", "message": "success" })
                        }
                    } else {
                        return res.json({ "status": "Error", "message": "success" })
                    }
                }
            })
    //     }
    // })
})

app.get('/users/amount',(req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    // jwt.verify(token, 'secret', function(err, decoded) {
    //     if (err) {
    //         return res.json({ "message": 'Failed to authenticate token.' })
    //     } else {
            let query = UsersModel.findOne({'email': req.query.useremail }, function(err, user){
                if (err || Array(req.query.useremail)[0] === undefined){
                    
                } else {
                    if(user != null && user != undefined){
                        let incerementAmountBy = req.query.amount
                        UsersModel.updateOne({ email: req.query.useremail }, 
                        { 
                            "$inc": { "moneys": incerementAmountBy }
                        }, (err, customUser) => {
                            if(err){
                                return res.json({ "status": "Error", "message": "success" })
                            }
                            return res.json({ "status": "OK", "moneys": user.moneys, "message": "success", "useremail": decoded.useremail })
                        })
                        
                    } else {
                        return res.json({ "status": "Error", "message": "success" })
                    }
                }
            })
    //     }
    // })

})

app.get('/users/login',(req, res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
})
app.get('/users/check', (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    let query =  UsersModel.findOne({'email': req.query.useremail}, function(err, user){
        if (err || user == undefined || user == null){
            return res.send(`user not found`)    
            
        } else {
            
            let passwordCheck = bcrypt.compareSync(req.query.userpassword, user.password) && req.query.userpassword !== ''

            if(req.query.useremail == user.email && passwordCheck){
                
                // token = jwt.sign({
                //     useremail: user.email
                // }, 'secret', { expiresIn: '5m' })
                // window.localStorage.setItem("vuesupershoptoken", token)
                return res.json({ "user": user, "status": "OK", "token": token })
            } else {
                return res.json({ "status": "Error" })
            }
        }
    })
})
app.get('/users/usercreatesuccess',async (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    let query = UsersModel.find({}).select(['email']);
    query.exec(async (err, allUsers) => {
        if (err){
            return res.send('rollback')
            console.log('rollback')
        }
        console.log(req.query.useremail)
        console.log(allUsers)
        console.log(req.query.useremail in allUsers)
        let userExists = false
        allUsers.forEach(user => {
            if(user.email.includes(req.query.useremail)){
                userExists = true
            }
        });
        if(userExists){
            console.log(req.query.useremail in allUsers)
            console.log('rollback')
            return res.send('rollback')
        } else {

            let encodedPassword = "#"
            const salt = bcrypt.genSalt(saltRounds)
            encodedPassword = bcrypt.hashSync(req.query.userpassword, saltRounds)

            const user = await new UsersModel({ email: req.query.useremail, password: encodedPassword, name:req.query.username, age:req.query.userage });
            user.save(function (err) {
                if(err){
                    console.log('rollback')
                    return res.send('rollback')
                } else {
                    auth = true
                    return res.send('created')
                    console.log('created')
                }
            })
        }
    })
})

app.get('/users/bucket/add', (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // jwt.verify(token, 'secret', function(err, decoded) {
    //     if (err) {
    //         return res.json({ "message": 'Failed to authenticate token.' })
    //     } else {
            if(Array(req.query)[0] === undefined){
                return res.json({ "message": 'success' })
            } else {
                UsersModel.updateOne({ email: req.query.useremail },
                    { $push: 
                        { 
                            productsInBucket: [
                                {
                                    name: req.query.productname,
                                    price: Number(req.query.productprice)
                                }
                            ]
                            
                        }
                }, (err, user) => {
                    return res.json({ "status": "OK", "message": 'success' })
                })
            }
    //     }
    // })
})

app.get(`/users/bucket`, (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // jwt.verify(token, 'secret', function(err, decoded) {
    //     if (err) {
    //         return res.json({ "message": 'Failed to authenticate token.' })
    //     } else {
            var myProductsInBucket = []
            let queryOfProductsInBucket = UsersModel.findOne({'email': req.query.useremail});
            let queryOfProducts = ProductModel.find({}).select(['name' ,'price']);
            queryOfProducts.exec( (err, allProducts) => {
                if (err){
                    return res.json({ "message": 'success' })
                }
                queryOfProductsInBucket.exec( (err, allProductsInBucketOfThisUser) => {
                    if(err){
                        return res.json({ "message": 'success' })
                    }
                    allProductsInBucketOfThisUser.productsInBucket.forEach(function(productInBucket){                        
                        myProductsInBucket.push(productInBucket)
                        console.log(productInBucket)
                    })
                    console.log(myProductsInBucket)
                    console.log(allProductsInBucketOfThisUser)
                    res.json({ "productsInBucket": allProductsInBucketOfThisUser.productsInBucket, "message": 'success' })
                })
                
            })
    //     }
    // })
})

app.get('/cleartoken',(req, res) => {
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // token = jwt.sign({
    //     useremail: 'custom@mail.ru'
    // }, 'secret', { expiresIn: 1 })
    // return res.json({ "status": "OK" })
})

const port = process.env.PORT || 8080
// const port = 4000
app.listen(port)
