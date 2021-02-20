<template>
  <v-container fluid> Movie View. Welcome {{ username }} </v-container>
</template>

<script>
export default {
  name: "Movie",
  data: () => ({
    authToken: "",
    username: "",
  }),
  mounted() {
    this.authToken = localStorage.getItem("authToken");
    this.username = localStorage.getItem("username");

    if (!this.authToken || !this.username) {
      this.$router.push({ name: "login" });
    }
  },
};
</script>
