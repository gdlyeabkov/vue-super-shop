<template>
  <div>
    <Header/>
    <div class="customCardGroup">
      <img class="mb-4" src="https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/vue-dot-js-256.png" alt="" width="72" height="72">
      <h1 class="h3 mb-3 font-weight-normal headerform">Зарегистрируйтесь</h1>
      
      <!-- <label class="sr-only">Email</label> -->
      <input v-model="useremail" type="email" id="" class="useremail form-control" placeholder="Email address" required="" autofocus="">
      <!-- <label class="sr-only">Password</label> -->
      <input v-model="userpassword" type="password" id="" class="userpassword form-control" placeholder="Password" required="">
      <!-- <label class="sr-only">Age</label> -->
      <input v-model="userage" type="text" id="" class="userage  form-control" placeholder="Age" required="" autofocus="">
      <!-- <label class="sr-only">Name</label> -->
      <input v-model="username" type="text" id="" class="username form-control" placeholder="Name" required="" autofocus="">
      <div class="checkbox mb-3">
      </div>
      <button style="font-size: 16px; min-width: 175px;" @click="registerNewUser" class="btn btn-lg btn-danger btn-block registerBtn">Зарегистрироваться</button>
      <div class="customErros">{{ errors }}</div>
    </div>
  </div>
  <Footer/>
</template>

<script>

import Header from '@/components/Header.vue' 
import Footer from '@/components/Footer.vue'

export default {
  name: 'UsersRegistry',
  data(){
    return{
      useremail: '',
      userpassword: '',
      userage: 0,
      username: '',
      // isAuth: window.localStorage.getItem('auth') == 'true',
      errors: ""

    }
  },
  methods:{
    registerNewUser(){
      // if(this.$route.query.useremail != null || this.$route.query.userpassword != null || this.$route.query.userage != null || this.$route.query.username != null){
        fetch(`https://markettown.herokuapp.com/users/usercreatesuccess?useremail=${this.useremail}&userpassword=${this.userpassword}&username=${this.username}&userage=${this.userage}`, {
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
          if(result.includes("created")){
            window.localStorage.setItem("auth", "true");
            window.localStorage.setItem("useremail", this.useremail);
            this.$router.push({ name: "UsersLogin", query: { "useremail": this.useremail } })  
          } else if(result.includes("rollback")){
            this.errors = "Такой пользователь уже существует!!!"
          }
          
        });
      }
    },
    components: {
      Header,
      Footer
    }
  // }
}
</script>
<style scoped>
  .headerform {
    /* color: #EB3B88; */
    color: white;
  }
  .customCardGroup > input {
    width: 40%;
    margin: 10px auto;
  }

   .registerBtn {
      width: 25%;
      margin: auto;
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
</style>