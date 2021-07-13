<template>
  <Header :useremail="useremail" :auth="true" />
  <div class="main">
    <div class="form-control">
      <p style="text-align: center;">У вас сейчас на счёте <b>{{ moneys }}$</b></p>
      <input class="myamount" v-model="myamount" type="text">
    
      <a @click="addAmount" class="form-control btn btn-danger">
          Пополнить счёт
      </a>
    </div>
    <Footer/>
  </div>
</template>

<script>

import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import * as jwt from 'jsonwebtoken'

export default {
  name: 'Amount',
  data(){
    return {
      myamount: 0,
      moneys: 0,
      token: window.localStorage.getItem('markettowntoken'),
      // useremail: window.localStorage.getItem('auth') == 'true' ? window.localStorage.getItem('useremail') : "",
      // isAuth: window.localStorage.getItem('auth') == 'true'
    }
  },
  mounted(){
    fetch(`https://markettown.herokuapp.com/users/amount?useremail=${this.$route.query.useremail}&amount=0`, {
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
          //   if(JSON.parse(result).status.includes("OK")){
          //     this.moneys = JSON.parse(result).moneys
          //     this.useremail = JSON.parse(result).useremail
          //   }
          // } else if(JSON.parse(result).message.includes("Failed")){
          //   this.$router.push({ name: "UsersLogin" })
          // }

          jwt.verify(this.token, 'secret', (err, decoded) => {
            if (err) {
              this.$router.push({ name: "UsersLogin" })
            } else {
                if(JSON.parse(result).status.includes("OK")){
                this.moneys = JSON.parse(result).moneys
                // this.useremail = JSON.parse(result).useremail
                this.useremail = decoded.useremail

              }
            }
          })

        });
  },
  methods:{
    async addAmount(){
      await fetch(`https://markettown.herokuapp.com/users/amount?useremail=${this.useremail}&amount=${this.myamount}`, {
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
          if(JSON.parse(result).status.includes("OK")){
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