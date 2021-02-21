<template>
  <v-container fill-height fluid>
    <v-row justify="center">
      <v-col cols="6">
        <v-form ref="loginForm" v-model="valid">
          <v-text-field
            v-model="username"
            label="Username"
            prepend-inner-icon="mdi-account"
            :rules="[rules.required]"
          >
          </v-text-field>
          <v-text-field
            v-model="password"
            label="Password"
            prepend-inner-icon="mdi-lock"
            :rules="[rules.required]"
            type="password"
          >
          </v-text-field>

          <v-btn color="primary" class="mt-6" @click="login()">
            <v-icon left dark>
              mdi-send
            </v-icon>
            Login
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar">
      {{ text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
import apiHost from "@/config";

export default {
  name: "Login",
  data: () => ({
    username: "",
    password: "",

    rules: {
      required: (value) => !!value || "Required",
    },
    valid: false,

    snackbar: false,
    text: "",
  }),
  watch: {
    snackbar(val, oldVal) {
      if (!val && oldVal) {
        this.$refs.loginForm.resetValidation();
      }
    },
  },
  methods: {
    async login() {
      const tokenUri = "auth/token/login";

      if (this.valid || this.$refs.loginForm.validate()) {
        try {
          const authTokenPromise = await axios.post(
            `${apiHost}${tokenUri}`,
            JSON.stringify({
              username: this.username,
              password: this.password,
            }),
            { headers: { "Content-Type": "application/json" } }
          );
          const { auth_token: authToken } = authTokenPromise?.data;

          localStorage.setItem("authToken", authToken);
          localStorage.setItem("username", this.username);

          this.$router.push({ name: "movie" });
        } catch ({
          response: {
            status,
            data: { non_field_errors: nonFieldErrors },
          },
        }) {
          if (status === 400 && nonFieldErrors) {
            this.text = nonFieldErrors[0];
          } else {
            this.text = "Something went wrong.";
          }
          this.snackbar = true;
        }
      } else {
        this.snackbar = true;
        this.text = "Fill in required fields.";
      }
    },
  },
};
</script>
