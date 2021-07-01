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
            <div>
              <li class="nav-item">
                <router-link class="nav-item" :to="{name:'UsersLogin'}">
                  Вход
                </router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-item" :to="{name:'UsersRegistry'}">
                  Регистрация
                </router-link>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </nav>
    <div v-for="order in allOrders" :key="order._id" class="card">
        <div v-if="allOrders.length >= 1">
          <h5 class="card-header">
              <a href="#">{{ order.ownername }}</a>
          </h5>
          <div class="card-body">
              <h5 class="card-title">{{ order.price }}</h5>
              <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
          </div> 
        </div>
        <div v-else-if="allOrders.length == 0">
          список заказов этого пользователя пуст
        </div>
    </div>
  </div>
</template>

<script>


export default {
  name: 'OrdersList',
  data(){
    return {
      allOrders: []
    }
  },
  async mounted(){
    fetch(`https://vuesupershop.herokuapp.com/admin/orders?useremail${this.$route.query.useremail}`, {
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
        this.allOrders = JSON.parse(result)
      });
  },
}
</script>
