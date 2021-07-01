<template>
  <div>
    <Header :auth="false" :touser="''" />    
    <div class="customCardGroup">
      <img class="mb-4" src="https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/vue-dot-js-256.png" alt="" width="72" height="72">
      <h1 class="headerform h3 mb-3 font-weight-normal">Войдите</h1>    
      <!-- <label for="inputEmail" class="sr-only">Email</label> -->
      <input v-model="useremail" type="email" id="inputEmail" class="useremail form-control" placeholder="Email address" required="" autofocus="">
      <!-- <label for="inputPassword" class="sr-only">Password</label> -->
      <input v-model="userpassword" type="password" id="inputPassword" class="userpassword form-control" placeholder="Password" required="">
      <div class="checkbox mb-3">
      </div>
      <button @click="loginUser" class="btn btn-lg btn-danger btn-block loginBtn">Войти</button>       
      <div class="customErros">{{ errors }}</div>
    </div>
  </div>
  <Footer/>
</template>

<script>

import Header from '@/components/Header.vue' 
import Footer from '@/components/Footer.vue' 

export default {
  name: 'UsersLogin',
  data(){
    return {
      useremail: '',
      userpassword: '',
      errors: ""
    }
  },
  methods:{
    async loginUser(){
      await fetch(`https://vuesupershop.herokuapp.com/users/check?useremail=${this.useremail}&userpassword=${this.userpassword}`, {
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
          if(!result.includes("user not found")){
            // console.log(JSON.parse(result))
            //window.localStorage.setItem("userlogin", "true")
            window.localStorage.setItem("auth", "true");
            window.localStorage.setItem("useremail", this.useremail);
            this.$router.push('/')
          } else if(result.includes("user not found")){
            this.errors = "Такого пользователя не существует!!!"
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
  .headerform {
    /* color: #EB3B88; */
    color: white;
  }
  .customCardGroup {
    margin:auto;
    display:flex;
    justify-content: center;
    width:75%;
    flex-direction: column; 
    text-align: center;
  }
  .customCardGroup img {
    display: block;
    margin:auto;
  }
  .customErros {
    color: red;
    font-weight: bolder;
  }
  .customCardGroup > input {
    width: 40%;
    margin: 10px auto;
  }

   .loginBtn {
      width: 25%;
      margin: auto;
   }
</style>