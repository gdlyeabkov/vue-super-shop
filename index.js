const bcrypt = require('bcrypt');
const saltRounds = 10;

const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const serveStatic = require('serve-static')
const app = express()

app.use('/', serveStatic(path.join(__dirname, '/dist')))

// const bp = require('body-parser')

// app.use(bp.json())
// app.use(bp.urlencoded({ extended: true }))

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

app.get('/home', (req, res)=>{
    //получение всех записей
    console.log('получение всех записей')
    let query = ProductModel.find({}).select(['name', 'price']);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    query.exec( (err, allProducts) => {
        if (err){
            console.log('a')
            return
        }
        if(Array(req.query.useremail)[0] === undefined){
           // // res.render('index', { allProducts: allProducts, auth:false })
           console.log('b') 
           console.log(allProducts) 
            //    console.log(res.json(allProducts))
            // console.log(res.status(200).json({ error: 'success' }))
            // return res.status(200).json({ error: 'success' })
            
            // console.log(res.send("abc"))
            // return res.json(allProducts)
            // return res.send({ error: 'success' })
            
            // response.text().
            // console.log(res.json(JSON.stringify(allProducts)))
            // return res.end(JSON.stringify(allProducts))
            return res.json(allProducts)
        }
        let mailOfUser = req.query.useremail
        return res.json(allProducts.toString())
        console.log('c')
        // res.json()
        
        // res.render('index', { allProducts: allProducts, auth:true, useremail:mailOfUser })
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
        // res.render('orderslist', { allOrders })
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
        // mongoose.connection.collection("myusers").updateOne(       
        //     {  },
        //     { $pull: { 'productsInBucket': { name: req.query.productname } } }
        // );
        
        // await ProductModel.deleteMany({ name: req.query.productname, price:Number(req.query.productprice) })
        await ProductModel.deleteMany({ name: req.query.productname  })
        res.redirect('/home')
        
    }
})

app.get('/product/:productID',(req, res)=>{
    // res.send("<h1>asd</h1>")
    // res.sendFile("D:/VueJsProjects/vuesupershop/views/index.html")
    // res.sendFile("index.html", options)
    
    // // res.render('D:/VueJsProjects/vuesupershop/views/index')
    // let query = ProductModel.find({}).select(['name', 'price']).where('name').g;
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    let query = ProductModel.findById(req.params.productID);
        query.exec((err, product) => {
        if (err){
            return
        }
        return res.json(product)
        console.log(product)
        // res.render('product', { product: product })
    });
    
})

app.get('/users/register',(req, res)=>{
    console.log(Array(req.query.useremail)[0] === undefined)
    // if(Array(req.query.useremail)[0] === undefined){
    //     // res.render('usersregistry', { userlogin : false })
    // } else {
    //     // res.render('usersregistry', { userlogin : true })
    // }
})
app.get('/users/logout',(req, res)=>{
    auth = false
    //res.redirect('/')
})

app.get('/users/bucket/delete', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // console.log(mongoose.connection)
    console.log(mongoose.connection.collection("myusers"))
    // console.log(mongoose.connection.db.listCollections())
    // var query = UsersModel.updateOne({ email: req.query.useremail }, 
    //     { $pull: { "productsInBucket[0].$[]": req.query.productname } },
    // )

    // var query = UsersModel.updateOne({ email: req.query.useremail }, 
    //     {
    //          $pull: {
    //             productsInBucket: [
    //                 {
    //                     name: req.query.productname
    //                 }
    //             ]
    //         }
    //     },
    // )
    // UsersModel.update({ email: req.query.useremail }, 
    //     {
    //          '$pull': {
    //             'productsInBucket': [
    //                 {
    //                     'name': req.query.productname
    //                 }
    //             ]
    //         }
    //     },
    // )
    // mongoose.Collection.update({  }, 
    //     {
    //          $pull: {
    //             'UsersModel.productsInBucket': {
    //                     name: req.query.productname
    //             }
    //         }
    //     },
    // )

    // UsersModel.productInBucket.pull({ name: req.query.productname })

    // mongoose.connection.db.myusers.update('myusers', (a) => {
    //     a.update(
    //         { name: req.query.productname },
    //         { $pull: { 'productsInBucket': { name: req.query.productname } } }
    //     );
    // });
    console.log("Удалён");
    console.log(req.query.useremail);
    console.log(req.query.productname);
    mongoose.connection.collection("myusers").updateOne(
        
            { email: req.query.useremail },
            { $pull: { 'productsInBucket': { name: req.query.productname } } }
    );
    return res.json({ "status": "OK" })
    // mongoose.collection.myusers.update(
    //     { name: req.query.productname },
    //     { $pull: { 'productsInBucket': { name: req.query.productname } } }
    // );

    // mongoose.connection.db.collection('usersmodels', (err, usersmodels) => {
    //     usersmodels.update(
    //         { name: req.query.productname },
    //         { $pull: { 'productsInBucket': { name: req.query.productname } } }
    //     );
    // })
    

    // var query = UsersModel.updateOne({ email: req.query.useremail }, 
    //     {
    //          $set: {
    //             "productsInBucket.$[productid]": null
    //         }, 
    //     },
    //     {
    //         arrayFilters: [ { productid: req.query.productname } ],
    //         upsert: true
    //     }
    // )

    // await UsersModel.deleteOne({ name: /phone/ })
    
    
    // var query = UsersModel.updateOne({ email: req.query.useremail }, 
    //     {
    //          $unset: {
    //             productsInBucket: [
                    
    //                     name: req.query.productname
                    
    //             ]
    //         }, 
    //     },
        // {
        //     arrayFilters: [ { productnumber: 0 } ],
        //     upsert: true
        // }
    // )

    // await UsersModel.updateOne(
    //     { email: req.query.useremail },
    //     { $pull: { productsInBucket: { $elemMatch: { name: "phone"} } } },
    // )

    // let query = await 
    // UsersModel.findOneAndUpdate(
    //     { 'email': 'seva@mail.ru' },
    //     { '$pull':{ 'productsInBucket':{ 'name': "phone"} } },
    //     { upsert: true, multi: true },
    //     function (err, val) {
    //         console.log(val)
    //         val.productsInBucket.forEach(product => {
    //             if(req.query.productname == new Map(product).get('name')){
    //                 console.log(product)
    //                 console.log("удалён")
    //                 // delete product
    //                 val.array.remove({name: 'phone'})
    //                 // val.update()     
    //             }
    //         })
    //     }
    // )
    
      //UsersModel.updateOne()

    // await UsersModel.updateOne({ email: req.query.useremail }, 
    //     { $push: 
    //         { 
    //             productsInBucket: [
    //                 {
    //                     name: req.query.productname,
    //                     price: Number(req.query.productprice)
    //                 }
    //             ]
                
    //         }
    // })
    // res.redirect(`/users/bucket/?useremail=${req.query.useremail}`)
})

app.get('/users/bucket/buy',async (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    //const moneys = req.query.moneys
    //const productsInBucket = req.query.productsInBucket
    let query = await UsersModel.findOne({'email': req.query.useremail }, async function(err, user){
    // // res.render('ordersuccess', { success: false, auth: true, user: user.email })
    
        
        if (err){
            // res.render('ordersuccess', { success: false, auth: true, user: user.name })
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
                    const order = await new OrderModel({ ownername: req.query.useremail, price: commonPrice });
                    order.save(function (err) {
                        if(err){
                            return
                        } else {
                            console.log('заказ создан')
                            // res.render('ordersuccess', { success: true, auth: true, user: user.name })        
                        }
                    });
                    
                    await UsersModel.updateOne({ email: req.query.useremail }, 
                    { 
                        "$inc": { "moneys": -commonPrice }
                    })
                    // await UsersModel.updateOne({}, {}).

                    // // res.render('ordersuccess', { success: true, auth: true, user: user.name })
                } else if(user.moneys < commonPrice){
                    // res.render('ordersuccess', { success: false, auth: true, user: user.name })
                    console.log('нехватает денег')
                }
             } else {
                // res.render('ordersuccess', { success: false, auth: true, user: user.name })
                console.log('a')
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
            //// res.render('amount', { user, useremail: req.query.useremail })
        } else {
            if(user != null && user != undefined){
                let incerementAmountBy = req.query.amount
                UsersModel.updateOne({ email: req.query.useremail }, 
                { 
                    "$inc": { "moneys": incerementAmountBy }
                }, (err, customUser) => {
                    if(err){
                        return res.json({ "status": "Error"})
                    }
                    return res.json({ "status": "OK", "moneys": user.moneys })
                })
                
                // res.render('amount', { user, useremail: req.query.useremail }) 
            } else {
                return res.json({ "status": "Error" })
                // res.render('amount', { user, useremail: req.query.useremail })
            }
        }
    })
    

})

app.get('/users/login',(req, res)=>{

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    // res.render('userslogin')
})
app.get('/users/check', (req,res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    //let query =  UsersModel.find({}).select(['email']);
    let query =  UsersModel.findOne({'email': req.query.useremail}, function(err, user){
        if (err || user == undefined || user == null){
            return res.send(`user not found`)    
            
        } else {
            
            let passwordCheck = bcrypt.compareSync(req.query.userpassword, user.password) && req.query.userpassword !== ''

            if(req.query.useremail == user.email && passwordCheck){
                auth = true
                res.json(user)
                //res.redirect(`/?useremail=${user.email}&error=no`)
            } else {
                return res.send(`user not found`)    
            }
            // console.log(user)
        }
    })
    // query.exec((err, allUsers) => {
    //     if (err){
    //         return
    //     }
    //     console.log(req.query)
    //     console.log(allUsers)
        /*
        allUsers.map((user) => {
            if(user.email && user.email == req.query.useremail){
                auth = true
                res.redirect(`/?useremail=${req.query.useremail}&error=no`)
            }
            else {
                res.redirect(`/?error=notAuth`)
            }
        })
        */
       
        // if(req.query.useremail in allUsers){
            // auth = true
            // res.redirect(`/?useremail=${req.query.useremail}&error=no`)
        // } else {
            // res.redirect(`/?error=notAuth`)
        // }
            
    // });
})
app.get('/users/usercreatesuccess',async (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
   
    //let query = await UsersModel.create({ email: 'rodion@mail.ru', password:req.params.userpassword.toString(), name:req.params.username, age:req.params.userage });
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
            //console.log(req.query.useremail)
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
            });
        }

        // if(req.query.useremail in allUsers){
        //     console.log(req.query.useremail in allUsers)
        //     console.log('rollback')
        //     return res.send('rollback')
        //     //res.redirect('/users/register',{ userlogin:true}) 
        // } else {
        //     const user = await new UsersModel({ email: req.query.useremail, password:req.query.userpassword, name:req.query.username, age:req.query.userage });
        //     user.save(function (err) {
        //         if(err){
        //             console.log('rollback')
        //             return res.send('rollback')
        //         } else {
        //             //localStorage.setItem('logined', 'true')
        //             // res.redirect('/users/register')
        //             //res.redirect(`/users/usercreatesuccess?useremail=${useremail}&userpassword=${userpassword}&username=${username}&userage=${userage}`)
        //             auth = true
        //             return res.send('created')
        //             console.log('created')
        //             // res.render('usercreatesuccess', {userlogin: true, useremail: req.query.useremail})
        //         }
        //     });
        // }
    });
    
    // query.exec((err, product) => {
    //     if (err){
    //         return
    //     }
    // });

})

app.get('/users/bucket/add', (req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    // let query = UsersModel.find({}).select(['email']);
    // let queryOfUsers = UsersModel.findOneAndUpdate({'email': req.query.useremail}, { $set: { productsInBucket: {productFour} }}, function(){

    // });

    // let queryOfProducts = UsersModel.findOne({'id': req.params.productid});
    // queryOfUsers.exec(async (err, user) => {
    //     if (err){
    //         return
    //     }
    // }
    if(Array(req.query)[0] === undefined){
        // res.render('index', { allProducts: allProducts, auth:false })
        return
    } else {
        // await UsersModel.updateOne({ email: req.query.useremail }, 
        //     { $push: 
        //         { 
        //             productsInBucket: [
        //                 {
        //                     name: req.query.productname,
        //                     price: Number(req.query.productprice)
        //                 }
        //             ]
                    
        //         }
        // })
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
                return res.json({ "status": "OK" })
            })
        
        // await UsersModel.updateOne({ email: req.query.useremail }, 
        //     { 
        //         "$inc": { "moneys": -commonPrice }
        //     })
        
        // res.redirect(`/?useremail=${req.query.useremail}`)

        // await UsersModel.updateOne({ email: req.query.useremail }, 
        //     { $push: 
        //         { 
        //             productFive:{
        //                 name: ['tablet'],
        //                 price: 350
        //             }
        //         }
        // })
    }
})

app.get(`/users/bucket`, (req, res)=>{
    // var myProductsInBucket = []
    // let queryOfProductsInBucket = UsersModel.findOne({'email': req.query.useremail});
    // let queryOfProducts = ProductModel.find({}).select(['name' ,'price']);
    // queryOfProducts.exec( (err, allProducts) => {
    //     if (err){
    //         return
    //     }
    //     queryOfProductsInBucket.exec( (err, allProductsInBucketOfThisUser) => {
    //         if(err){
    //             return
    //         }
    //         allProducts.forEach(function(product){
    //             if(allProductsInBucketOfThisUser.productsInBucket){
    //                 allProductsInBucketOfThisUser.productsInBucket.forEach(function(productInBucket){
    //                     // allProducts.forEach(function(productOne){
    //                         if(productInBucket.name == product.name){
    //                             myProductsInBucket.push(productInBucket)
    //                             //allProductsInBucketOfThisUser.username
    //                             // res.send('success');
    //                         } 
    //                         // else {
    //                         //     res.send('error 1');
    //                         // }
    //                     // })
    //                     console.log('allProductsInBucketOfThisUser', allProductsInBucketOfThisUser)
    //                     console.log('productInBucket', productInBucket)
    //                     console.log('productsInBucket', productInBucket)
                        
    //                     // res.render('bucket', {auth, allProductsInBucketOfThisUser:allProductsInBucketOfThisUser.productsInBucket, user:allProductsInBucketOfThisUser})
    //                 })
                    
    //             } else {
    //                 res.send('error')
    //             }
    //         })
    //     })
        
    // });
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, X-Access-Token, X-Socket-ID, Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    
    var myProductsInBucket = []
    let queryOfProductsInBucket = UsersModel.findOne({'email': req.query.useremail});
    let queryOfProducts = ProductModel.find({}).select(['name' ,'price']);
    queryOfProducts.exec( (err, allProducts) => {
        if (err){
            return
        }
        queryOfProductsInBucket.exec( (err, allProductsInBucketOfThisUser) => {
            if(err){
                return
            }
            allProductsInBucketOfThisUser.productsInBucket.forEach(function(productInBucket){                        
                myProductsInBucket.push(productInBucket)
                console.log(productInBucket)
            })
            console.log(myProductsInBucket)
            console.log(allProductsInBucketOfThisUser)
            res.json(allProductsInBucketOfThisUser.productsInBucket)
                // res.render('bucket', {auth, allProductsInBucketOfThisUser:allProductsInBucketOfThisUser.productsInBucket, user:allProductsInBucketOfThisUser, myProductsInBucket})
            
              
        })
        
    });
})

const port = process.env.PORT || 8080
// const port = 4000
app.listen(port)
