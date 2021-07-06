<template>
  <div class="home">
    <Header :auth="true" :useremail="$route.query.useremail" />
    <div class="card" style="width: 18rem;">
      <div class="card-title">
        <h5 class="card-header bg-warning">
          {{ product.name }}
        </h5>
      </div>
      <div class="card-body" :v-if="product.length">
        <p class="card-text">{{ product.price }}$</p>
        <!-- <router-link :to="`/users/bucket/add/${product.id}`" class="btn btn-danger">Добавить в корзину</router-link> -->
        <a @click="addToBucket()" class="btn btn-danger">Добавить в корзину</a>
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
  name: 'Product',
  data(){
    return{
      product: {},
      token: window.localStorage.getItem('vuesupershoptoken')
      // isAuth: window.localStorage.getItem('auth') == 'true'
    }
  },
  methods: {
    addToBucket(){
      fetch(`https://vuesupershop.herokuapp.com/users/bucket/add?useremail=${this.$route.query.useremail}&productname=${this.product.name}&productprice=${this.product.price}`, {
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
      .then(async result => {
        
        // if(JSON.parse(result).message.includes("success")){
        //   if(JSON.parse(result).status.includes("OK")){
        //     this.$router.push({ name: 'Bucket', query: { useremail: this.$route.query.useremail } })  
        //   }
        // } else if(JSON.parse(result).message.includes("Failed")){
        //   this.$router.push({ name: "UsersLogin" })
        // }

        jwt.verify(this.token, 'secret', (err, decoded) => {
          if (err) {
              this.$router.push({ name: "UsersLogin" })
          } else {
            this.$router.push({ name: 'Bucket', query: { useremail: this.$route.query.useremail } })  
          }
        })

      });
    }
  },
  async mounted(){
    console.log(this.$route.params.productID)
    fetch(`https://vuesupershop.herokuapp.com/product/${this.$route.params.productID}`, {
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
        console.log(result);
        // if(JSON.parse(result).message.includes("success")){
        //   this.product = JSON.parse(result).product
        // } else if(JSON.parse(result).message.includes("Failed")){
        //   this.$router.push({ name: "UsersLogin" })
        // }

        jwt.verify(this.token, 'secret', (err, decoded) => {
          if (err) {
              this.$router.push({ name: "UsersLogin" })
          } else {
            this.product = JSON.parse(result).product
          }
        })

      });
  },
  components: {
    Header,
    Footer
  }
}
</script>
<style scoped>
  .card {
    margin: 10px auto;
    text-align: center;
    display:flex;
    flex-direction: column;
    justify-content: center;
  }
</style>