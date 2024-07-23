<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <a class="navbar-brand" href="#">Invade</a>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#">Home</a>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/tasks">Tasks</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/categories">Categories</router-link>
          </li>
        </ul>
      </div>
      <button class="btn btn-outline-danger" @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script>
import axiosInstance from "../axios"; // Import your custom axios instance

export default {
  name: "HomeComponent",
  methods: {
    async logout() {
      try {
        await axiosInstance.post("/logout");
        localStorage.removeItem("token");
        this.$router.push("/login");
      } catch (error) {
        console.error("Error logging out:", error);
      }
    },
  },
};
</script>
