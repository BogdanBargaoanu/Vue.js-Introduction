<template>
  <div class="container-fluid login-container">
    <form class="main-form">
      <h1 class="text-center">Login</h1>
      <div class="mb-3">
        <label for="inputUsername" class="form-label">Username</label>
        <input v-model="username" type="text" class="form-control" id="inputUsername" required>
      </div>
      <div class="mb-3">
        <label for="inputPassword" class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" id="inputPassword" aria-describedby="pwHelp"
          required>
        <div id="pwHelp" class="form-text">We'll never share your password with anyone else.</div>
      </div>
      <button @click="login($event)" type="submit" class="btn btn-primary">Login</button>
      <p class="create-account-info">Don't have an account? <router-link to="/register">Register</router-link></p>
    </form>
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true"
      :class="{ 'show': showToast }" style="position: absolute; top: 0; right: 0;">
      <div class="toast-header">
        <strong class="me-auto">Notification</strong>
        <button type="button" class="m1-2 mb-1 btn-close" @click="showToast = false"></button>
      </div>
      <div class="toast-body">
        {{ toastMessage }}
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserLogin',
  props: {
    msg: String
  },
  data() {
    return {
      username: '',
      password: '',
      showToast: false,
      toastMessage: ''
    };
  },
  methods: {
    login(event) {
      event.preventDefault();
      axios.post('http://localhost:3000/users/login', {
        username: this.username,
        password: this.password
      })
        .then(response => {
          if (response.data.success) {
            // The login was successful
            localStorage.setItem('user-token', response.data.token);
            //this.$router.push('/dashboard');
          }
        })
        .catch(error => {
          this.toastMessage = 'Invalid login: ' + error.response.data.message;
          this.showToast = true;

          setTimeout(() => {
            this.showToast = false;
          }, 5000);
        });
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 100%;
}
</style>