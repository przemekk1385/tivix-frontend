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
        <v-alert v-model="alert" dense type="warning">
          {{ text }}
        </v-alert>
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
          <v-col cols="12">
            <v-pagination
              v-if="pages > 1"
              v-model="page"
              class="my-4"
              :length="pages"
            ></v-pagination>
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

    alert: false,
    text: "",

    title: "",
    items: [],
    count: 0,
    page: 1,

    resultsPerPage: 10,
  }),
  computed: {
    offset() {
      return this.resultsPerPage * (this.page - 1);
    },
    pages() {
      return (
        Math.floor(this.count / this.resultsPerPage) +
        (this.count % this.resultsPerPage > 0 ? 1 : 0)
      );
    },
  },
  watch: {
    async title(val) {
      this.page = 1;
      const movieUri = `/movie/?s=${val}&page=${this.page}`;
      this.fetchMovies(movieUri);
    },
    page(val) {
      let movieUri;
      if (this.title.length) {
        movieUri = `/movie/?s=${this.title}&page=${val}`;
      } else {
        movieUri = `/movie/?offset=${this.offset}`;
      }
      this.fetchMovies(movieUri);
  },
  },
  mounted() {
    this.authToken = localStorage.getItem("authToken");
    this.username = localStorage.getItem("username");

    if (!this.authToken || !this.username) {
      this.$router.push({ name: "login" });
    } else {
    const movieUri = "/movie/";
    this.fetchMovies(movieUri);
    }
  },
  methods: {
    async fetchMovies(movieUri) {
      const host = "http://127.0.0.1:8000";

      try {
        const movieListPromise = await axios.get(`${host}${movieUri}`, {
          headers: { Authorization: `Token ${this.authToken}` },
        });

        const { count, results } = movieListPromise?.data;

        this.text = "";
        this.alert = false;
        this.items = results.map(
          ({
            title,
            year,
            imdb_id: imdbId,
            movie_type: movieType,
            poster,
          }) => ({
            title,
            year,
            imdbId,
            movieType,
            poster,
          })
        );
        this.count = count;
      } catch ({
        response: {
          status,
          data: { error },
        },
      }) {
        if (status === 400) {
          this.text = "Too many results.";
          this.alert = true;
          this.items = [];
          this.count = 0;
        } else {
          console.error(error);
        }
      }
    },
  },
};
</script>
