<template>
  <div>
    <Header :useremail="$route.query.useremail" :auth="true" />
    <div class="customCardGroup">
      <div v-if="allProductsInBucketOfThisUser.length > 0">
        <div class="card" v-for="product in allProductsInBucketOfThisUser" :key="product._id">
          <h5 class="card-header">
            {{ product.name }}
            <span @click="deleteFromBucket(product.name, product._id)" style="cursor: pointer;" class="material-icons">
              close
            </span>
          </h5>
          <div class="card-body">
            {{ product._id }}
            <h5>{{ product.price }}$</h5>
            <button @click="deleteFromBucket(product.name, product._id)"  class="btn btn-danger">удалить из корзины</button>
          </div>
        </div>
        <button style="font-size: 22px; min-width: 150px;" @click="addOrder()" class="order form-control btn btn-success">
          Оформить заказ {{ priceForAllOrders }}$
        </button>
        <p class="customErros">
          {{ errors }}
        </p>
      </div>
      <div  v-else > 
        <router-link :to="{ name: 'Home'}" class="form-control btn btn-danger">
          У вас нет ещё ни одного товара в корзине    
        </router-link>
      </div>
    </div>
  </div>
  <Footer/>
</template>

<script>

import Header from '@/components/Header.vue' 
import Footer from '@/components/Footer.vue' 

import * as jwt from 'jsonwebtoken'

export default {
  name: 'Bucket',
  data(){
    return{
      // useremail: window.localStorage.getItem('auth') == 'true' ? window.localStorage.getItem('useremail') : "",
      allProductsInBucketOfThisUser: {},
      // isAuth: window.localStorage.getItem('auth') == 'true',
      priceForAllOrders: 0,
      errors: '',
      token: window.localStorage.getItem('markettowntoken')
    }
  },
  async mounted(){
    console.log(this.$route.query.useremail)
    fetch(`https://markettown.herokuapp.com/users/bucket?useremail=${this.$route.query.useremail}`, {
      mode: 'cors',
      method: 'GET'
    }).then(response => response.body).then(rb  => {
        const reader = rb.getReader()
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then( ({done, value}) => {
                if (done) {
                  console.log('done', done);
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                console.log(done, value);
                push();
              })
            }
            push();
          }
        });
    }).then(stream => {
        return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
      })
      .then(result => {
          
          // if(JSON.parse(result).message.includes("success")){
          //   console.log(JSON.parse(result));
          //   this.allProductsInBucketOfThisUser = JSON.parse(result).productsInBucket
          //   this.allProductsInBucketOfThisUser.map(product => {
          //       this.priceForAllOrders += product.price
          //   })
          // } else if(JSON.parse(result).message.includes("Failed")){
          //   this.$router.push({ name: "UsersLogin" })
          // }
        
        jwt.verify(this.token, 'secret', (err, decoded) => {
          if (err) {
            this.$router.push({ name: "UsersLogin" })
          } else {
            console.log(JSON.parse(result));
            this.allProductsInBucketOfThisUser = JSON.parse(result).productsInBucket
            this.allProductsInBucketOfThisUser.map(product => {
                this.priceForAllOrders += product.price
            })
          }
        })

      })
  },
  methods:{
    goToPage(page){
      if(page.includes('home')){
        this.router.push({ name: 'Home' })
      }
    },
    addOrder(){
      fetch(`https://markettown.herokuapp.com/users/bucket/buy?useremail=${this.$route.query.useremail}`, {
      mode: 'cors',
      method: 'GET'
    }).then(response => response.body).then(rb  => {
        const reader = rb.getReader()
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then( ({done, value}) => {
                if (done) {
                  console.log('done', done);
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                console.log(done, value);
                push();
              })
            }
            push();
          }
        });
    }).then(stream => {
        return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
      })
      .then(result => {
       
        // console.log(JSON.parse(result))
        // if(JSON.parse(result).message.includes("success")){
        //   // location.reload()
        //   if(JSON.parse(result).status.includes("OK")){
        //     this.$router.push({ name: 'Amount', query: { 'useremail': this.$route.query.useremail, 'amount': 0 } })
        //   } else if(JSON.parse(result).status.includes("Error")){
        //     this.errors = 'У вас не хватает денег!!!'

        //     setTimeout(() => {
        //       this.errors = ''
        //     }, 5000)
        //   }
        // } else if(JSON.parse(result).message.includes("Failed")){
        //   this.$router.push({ name: "UsersLogin" })
        // }

        jwt.verify(this.token, 'secret', (err, decoded) => {
          if (err) {
            this.$router.push({ name: "UsersLogin" })
          } else {
            if(JSON.parse(result).status.includes("OK")){
              this.$router.push({ name: 'Amount', query: { 'useremail': this.$route.query.useremail, 'amount': 0 } })
            } else if(JSON.parse(result).status.includes("Error")){
              this.errors = 'У вас не хватает денег!!!'

              setTimeout(() => {
                this.errors = ''
              }, 5000)
            }
          }
        })
      
      });
    },
    
    deleteFromBucket(productName, productId) {
      // надо починить одиночное удаление   
      fetch(`https://markettown.herokuapp.com/users/bucket/delete?useremail=${this.$route.query.useremail}&productname=${productName}&productid=${productId}`, {
      mode: 'cors',
      method: 'GET'
    }).then(response => response.body).then(rb  => {
        const reader = rb.getReader()
        return new ReadableStream({
          start(controller) {
            function push() {
              reader.read().then( ({done, value}) => {
                if (done) {
                  console.log('done', done);
                  controller.close();
                  return;
                }
                controller.enqueue(value);
                console.log(done, value);
                push();
              })
            }
            push();
          }
        });
    }).then(stream => {
        return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
      })
      .then(result => {

        // if(JSON.parse(result).message.includes("success")){
          // this.$router.push({ name: "Home"})
        // } else if(JSON.parse(result).message.includes("Failed")){
        //   this.$router.push({ name: "UsersLogin" })
        // }

        jwt.verify(this.token, 'secret', (err, decoded) => {
          if (err) {
            this.$router.push({ name: "UsersLogin" })
          } else {
            this.$router.push({ name: "Home"})
          }
        })

      });
      
    }
  },
  components: {
    Header,
    Footer
  }
}
</script>
<style scoped>
  .customCardGroup {
    margin:auto;
    display:flex;
    justify-content: center;
    width:75%;
    flex-direction: column; 
    text-align: center;
   
  }
  
  .customCardGroup .card {
     margin: 20px 0px;
  }
  .order {
    width: 25%;
    margin: auto;
  }
  .customErros {
    color: red;
    font-weight: bolder;
  }
</style>