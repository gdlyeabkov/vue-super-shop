<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">VueSuperShop</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <div v-if="isAuth">
              <li class="nav-item">
                <router-link :to="{name:'Home'}">
                  Домой
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-item" :to="{name:'Bucket', query:{ 'useremail': useremail }}">
                    Корзина
                </router-link>
              </li>
            </div>
            <div v-else >
              <li class="nav-item">
                <router-link class="nav-item" :to="{name:'UsersLogin'}">
                    Вход
                </router-link>
              </li>
              <li class="nav-item">
                  <!-- <a href=/users/register>
                      Регистрация
                  </a> -->
                <router-link class="nav-item" :to="{name:'UsersRegistry'}">
                  Регистрация
                </router-link>
              </li>
          </div>
          <div v-if="isAuth">
            <li>
                <span class="badge bg-primary">{{ useremail }}</span>
            </li>
            <li>
                <span class="badge bg-primary"><a class="badge bg-primary" @click="logoutUser" >Выйти</a></span>
            </li>
            <li>
                <span class="badge bg-primary">
                  <router-link :to="{ name: 'Amount', query: { useremail: useremail, amount: 0 }}">+ </router-link>
                </span>
            </li>
          </div>
        </ul>
      </div>
    </div>
  </nav>
    <h1>пользователь успешно создан</h1>
    <p class="mt-5 mb-3 text-muted">© {{ new Date().toLocaleDateString() }}</p> 
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'UserCreateSuccess',
  data(){
    return{
      isAuth: window.localStorage.getItem('auth') == 'true',
      useremail: window.localStorage.getItem('auth') == 'true' ? window.localStorage.getItem('useremail') : ""
    }
  },
  methods:{
    logoutUser(){
      window.localStorage.clear()
      this.$router.push('/')
    }
  }
}
</script>
