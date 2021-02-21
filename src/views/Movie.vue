<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="6">
        <v-form ref="searchForm">
          <v-text-field
            v-model="title"
            label="Title"
            prepend-inner-icon="mdi-magnify"
          >
          </v-text-field>
        </v-form>
        <v-row>
          <v-col
            v-for="(item, i) in items"
            :key="i"
            class="d-flex child-flex"
            cols="6"
          >
            <v-card>
              <v-img
                aspect-ratio="0.67"
                :src="item.poster"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              >
                <v-card-title v-text="item.title"></v-card-title>
              </v-img>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn icon>
                  <v-icon>mdi-star</v-icon>
                </v-btn>

                <v-btn :href="`https://www.imdb.com/title/${item.imdbId}`" icon>
                  <v-icon>mdi-link</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "Movie",
  data: () => ({
    authToken: "",
    username: "",

    title: "",

    items: [],
    pages: 1,

    page: 1,
  }),
  watch: {
    async title(val) {
      this.page = 1;

      const host = "http://127.0.0.1:8000";
      const movieUri = `/movie/?s=${val}&page=${this.page}`;

      try {
        const movieListPromise = await axios.get(`${host}${movieUri}`, {
          headers: { Authorization: `Token ${this.authToken}` },
        });

        const { items, pages } = movieListPromise?.data;

        this.items = items;
        this.pages = pages;
      } catch ({
        response: {
          status,
          data: { error },
        },
      }) {
        console.log(status, error);
      }
    },
  },
  mounted() {
    this.authToken = localStorage.getItem("authToken");
    this.username = localStorage.getItem("username");

    if (!this.authToken || !this.username) {
      this.$router.push({ name: "login" });
    }
  },
};
</script>
