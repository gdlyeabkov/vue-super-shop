<template>
  <div>
    <Header :useremail="useremail" :auth="true"/>
    <h1 style="text-align: center; color: white;">Пользователь успешно создан!</h1>
    <Footer/>
  </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'

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
  },
  components: {
    Header,
    Footer
  }
}
</script>
