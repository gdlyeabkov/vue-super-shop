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

const url = `mongodb+srv://glebClusterUser:glebClusterUserPassword@cluster0.fvfru.mongodb.net/products?retryWrites=true&w=majority`;

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

app.get('/home', (req, res)=>{
    //получение всех записей
    let query = ProductModel.find({}).select(['name', 'price']);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    query.exec( (err, allProducts) => {
        if (err){
            return res.json({ message: 'Failed to authenticate token.' });
        }
        if(Array(req.query.useremail)[0] === undefined){
            return res.json({ "allProducts": allProducts, "message": "success" })
        }
        let mailOfUser = req.query.useremail
        return res.json({ "allProducts": allProducts, "message": "success" })
    });
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
            
    let query = ProductModel.findById(req.params.productID);
        query.exec((err, product) => {
        if (err){
            return res.json({ "message": "success" })
        }
        return res.json({ "product": product, "message": "success" })
    })    
})

app.get('/users/bucket/delete', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    mongoose.connection.collection("myusers").updateOne(
        { email: req.query.useremail },
        { $pull: { 'productsInBucket': { name: req.query.productname } } }
    );
    return res.json({ "status": "OK", "message": "success" })
})

app.get('/users/bucket/buy', (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

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
                        }
                        //заказ создан
                    })
                    
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
                    return res.json({ "status": "Error", "message": "success" })
                }
            } else {
                return res.json({ "status": "Error", "message": "success" })
            }
        }
    })
})

app.get('/users/amount',(req, res)=>{
    
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
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
                    return res.json({ "status": "OK", "moneys": user.moneys, "message": "success" })
                })
                
            } else {
                return res.json({ "status": "Error", "message": "success" })
            }
        }
    })
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
        }
        let userExists = false
        allUsers.forEach(user => {
            if(user.email.includes(req.query.useremail)){
                userExists = true
            }
        });
        if(userExists){
            return res.send('rollback')
        } else {

            let encodedPassword = "#"
            const salt = bcrypt.genSalt(saltRounds)
            encodedPassword = bcrypt.hashSync(req.query.userpassword, saltRounds)

            const user = await new UsersModel({ email: req.query.useremail, password: encodedPassword, name:req.query.username, age:req.query.userage });
            user.save(function (err) {
                if(err){
                    return res.send('rollback')
                } else {
                    return res.send('created')
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
})

app.get(`/users/bucket`, (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
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
            })
            res.json({ "productsInBucket": allProductsInBucketOfThisUser.productsInBucket, "message": 'success' })
        })
        
    })
})

app.get('**', (req, res) => {
    return res.redirect(`/?redirectroute=${req.path}`)
})

const port = process.env.PORT || 8080
// const port = 4000

app.listen(port)
