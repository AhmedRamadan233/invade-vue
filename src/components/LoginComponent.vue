<template>
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 mt-5">
          <div class="card">
            <div class="card-header">
              <h4>Login</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="login">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    required
                  />
                </div>
                <button type="submit" class="btn btn-primary">Login</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoginComponent',
    data() {
      return {
        email: '',
        password: '',
      };
    },
    methods: {
      async login() {
        try {
          const response = await this.$axios.post('/login', {
            email: this.email,
            password: this.password,
          });
          const token = response.data.token;
          localStorage.setItem('token', token);
          this.$router.push('/'); // Redirect to home after login
        } catch (error) {
          console.error('Login failed:', error);
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    margin-top: 50px;
  }
  </style>
  