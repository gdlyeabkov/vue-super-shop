<template>
  <div class="pos-f-t">
    <div ref="customcollapsepanel" class="customcollapsepanel collapse" id="navbarToggleExternalContent">
      <div class="customcollapse bg-dark p-4">
        <div v-if="!auth">
          <ul class="navbar-nav">
            <div>
              <li class="nav-item">
                <router-link style="color: red; float: right;" class="nav-item" :to="{name:'UsersLogin'}">
                  Вход
                </router-link>
              </li>
              <br style="clear: both;"/> 
              <li class="nav-item">
                <router-link  style="color: red; float: right;" class="nav-item" :to="{name:'UsersRegistry'}">
                  Регистрация
                </router-link>
              </li>
              <div v-if="auth">
              <li class="nav-item">
                <router-link :to="{name:'Home'}">
                  Главная
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-item" :to="{name:'Bucket', query:{ 'useremail': useremail }}">
                  Корзина
                </router-link>
              </li>
              <li>
                  <span class="badge bg-danger">{{ useremail }}</span>
              </li>
            </div>
            </div>
          </ul>
        </div>
        <div v-else-if="auth"  style="float: right;">        
          <li>
            <span class="badge bg-danger"><a class="badge bg-danger" style="cursor: pointer;" @click="logoutUser()" >Выйти</a></span>
          </li>
          <li>
            <span class="badge bg-danger">
              <router-link style="color: white; text-decoration: none;" :to="{ name: 'Amount', query: { useremail: useremail, amount: 0 }}">+</router-link>
            </span>
          </li>
          <li class="nav-item">
            <router-link style="color:red;" :to="{name:'Home'}">
              Главная
            </router-link>
          </li>
          <li class="nav-item">
            <router-link  style="color: red;" class="nav-item" :to="{name:'Bucket', query:{ 'useremail': useremail }}">
                Корзина
            </router-link>
          </li>
          <li>
              <span class="badge bg-danger">{{ useremail }}</span>
          </li>        
        </div>
      </div>
    </div>
    <nav class="navbar navbar-dark bg-dark">
      <button @click="toggleSidebar()" class="customburger navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarToggleExternalContent" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
        <a class="navbar-brand" href="#">VueSuperShop</a>
        <ul class="navbar-nav">
          <div v-if="!burgerVisible">
            <div v-if="!auth">
              <li class="nav-item">
                <router-link style="color: red; float: right;" class="nav-item" :to="{name:'UsersLogin'}">
                  Вход
                </router-link>
              </li>
              <br style="clear: both;"/> 
              <li class="nav-item">
                <router-link  style="color: red; float: right;" class="nav-item" :to="{name:'UsersRegistry'}">
                  Регистрация
                </router-link>
              </li>
            </div>
            <div v-else-if="auth">
              <li class="nav-item">
                <router-link :to="{name:'Home'}" style="color: red;" >
                  Главная
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-item" :to="{name:'Bucket', query:{ 'useremail': useremail }}" style="color: red;">
                    Корзина
                </router-link>
              </li>
              <li>
                  <span class="badge bg-danger">{{ useremail }}</span>
              </li>
            </div>
          </div>
        </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data(){
    return {
      burgerVisible: false,
    }
  },
  methods: {
    toggleSidebar(){
      this.burgerVisible = !this.burgerVisible
      if(this.burgerVisible){
        this.$refs.customcollapsepanel.style = "display: block;"
      } else if(!this.burgerVisible){
        this.$refs.customcollapsepanel.style = "display: none;"
      }
    },
    logoutUser(){
    //   fetch(`https://vuesupershop.herokuapp.com/cleartoken`, {
    //   mode: 'cors',
    //   method: 'GET'
    // }).then(response => response.body).then(rb  => {
    //     const reader = rb.getReader()
    //     return new ReadableStream({
    //       start(controller) {
    //         function push() {
    //           reader.read().then( ({done, value}) => {
    //             if (done) {
    //               console.log('done', done);
    //               controller.close();
    //               return;
    //             }
    //             controller.enqueue(value);
    //             console.log(done, value);
    //             push();
    //           })
    //         }
    //         push();
    //       }
    //     });
    // }).then(stream => {
    //     return new Response(stream, { headers: { "Content-Type": "text/html" } }).text();
    //   })
    //   .then(result => {
    //     console.log(JSON.parse(result))
          
    //     if(JSON.parse(result).status.includes("OK")){
          window.localStorage.clear()
          jwt.sign({
            useremail: 'custom@mail.ru'
          }, 'secret', { expiresIn: 1 })
          this.$router.push({ name: "UsersLogin" })
      //   }
      // })
    },
  },
  props: {
    auth: {
      type: Boolean,
      default: false
    },
    useremail: {
      type: String,
      
    },
  }
}
</script>
<style>
  .customcollapsepanel {
    float: right;
  }
  .customcollapse {
    position: fixed;
    top: 0px;
    left: 0px;
    /* display: flex;
    justify-content: center; */
    height: 100%;
    width: 35%;
    z-index: 1;
  }
  .customburger {
    z-index:1;
  }
</style>