<template>
  <Header :useremail="useremail" :auth="true" />
  <div class="main">
    <div class="form-control">
      <input class="myamount" v-model="myamount" type="text">
    
      <a @click="addAmount" class="form-control btn btn-danger">
          Пополнить счёт
      </a>
    </div>
    <!-- footer -->
    <Footer/>
  </div>
</template>

<script>

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

export default {
  name: 'Amount',
  data(){
    return {
      myamount: 0,
      useremail: window.localStorage.getItem('auth') == 'true' ? window.localStorage.getItem('useremail') : "",
      isAuth: window.localStorage.getItem('auth') == 'true'
    }
  },
  methods:{
    async addAmount(){
      localStorage.setItem("userlogin", "true")
      await fetch(`https://vuesupershop.herokuapp.com/users/amount?useremail=${this.useremail}&amount=${this.myamount}`, {
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
          if(JSON.parse(result.includes("OK"))){
            this.$router.push({ name: "Home" })

          }
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
  input {
    width: 40%;
    margin: 10px auto;
    text-align: center;
    display:flex;
    flex-direction: column;
    justify-content: center;
    
  }
  a {
    width: 25%;
    margin: auto;
  }
  .form-control {
    display:flex;
    flex-direction: column;
    justify-content: center;
    
    width: 65%;
    margin: auto;
  }
  .main {
    display:flex;
    flex-direction: column;
    justify-content: center;
    margin: auto;
  }
</style>