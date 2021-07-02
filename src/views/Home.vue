<template>
  <div>
  <Header :useremail="useremail" :auth="true" />
  <div class="customCardGroup">
    <div class="card" v-if="allProducts.length >= 1" v-for="product in allProducts" :key="product._id">
      <h5 class="card-header bg-warning">
        <router-link v-if="isAuth" :to="{ name: 'product', params: { productID: product._id }, query: { 'useremail': useremail }}">{{ product.name }} </router-link>
        <router-link v-else :to="{ name: 'product', params: { productID: product._id }}">{{ product.name }} </router-link>
      </h5>
      <div class="card-body">
        <h5 class="card-title">{{ product.price }}$</h5>
        <a v-if="isAuth" @click="addToBucket(product)" class="btn btn-danger">Добавить в корзину</a>
      </div> 
    </div>
    <div v-else-if="allProducts.length <= 0" style="color: white; font-weight: bold;">
      Список товаров пуст
    </div>
  </div>
</div>
<Footer/>
</template>

<script>

import Header from '@/components/Header.vue' 
import Footer from '@/components/Footer.vue'

export default {
  name: 'Home',
  data(){
    return{
      allProducts: [],
      isAuth: window.localStorage.getItem('auth') == 'true',
      useremail: window.localStorage.getItem('auth') == 'true' ? window.localStorage.getItem('useremail') : ""
    }
  },
  methods:{
    async addToBucket(thisProduct){
      fetch(`https://vuesupershop.herokuapp.com/users/bucket/add?useremail=${this.useremail}&productname=${thisProduct.name}&productprice=${thisProduct.price}`, {
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
        console.log(JSON.parse(result))
        if(JSON.parse(result).status.includes("OK")){
          this.$router.push({ name: 'Bucket', query: { useremail: this.useremail } })  
        }
      });
    },
    toAmount(){
      
    },
  },
  async mounted(){
    
    fetch('https://vuesupershop.herokuapp.com/home', {
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
        console.log(JSON.parse(result));
        if(window.localStorage.getItem('auth') === null || window.localStorage.getItem('auth') === false){
          this.$router.push({ name: 'UsersLogin' })
        }
        console.log(window.localStorage.getItem('auth'))
        this.allProducts = JSON.parse(result)
      });
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
    /* display: flex; */
    justify-content: center;
    width:75%;
    /* flex-direction: column;  */
    text-align: center;
   
  }
  
  .card {
    display: block;
    float: left;
    margin: 10px 5px;
  }
  
  .customCardGroup .card {
     /* margin: 20px 0px; */
  }
</style>