<template>
  <v-row class="fill-height" justify="center" align-content="center">
    <v-col cols="12" lg="3" md="6">
      <v-card width="100%" border="md" variant="outlined">
        <v-card-text class="pa-8">
          <v-text-field
            v-model="email"
            placeholder="Email"
            :rules="[requiredInput, isValidEmail]"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            v-model="password"
            type="password"
            placeholder="Password"
            :rules="[requiredInput, minFourInput]"
          ></v-text-field>
          <v-row v-if="message" justify="center">
            <span class="text-error font-weight-bold">{{ message }}</span>
          </v-row>
        </v-card-text>
        <v-card-actions class="px-8 pb-8">
          <v-btn
            @click="login()"
            variant="flat"
            color="black"
            rounded="xl"
            block
            >Log In</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>
definePageMeta({
  layout: "plain",
});

const email = ref("");
const password = ref("");

function requiredInput(value) {
  return !!value || "Required";
}

function minFourInput(value) {
  return (value && value.length >= 4) || "Password length minimum of 4.";
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) || "Invalid email address";
}

const message = ref("");

async function login() {
  const { cookieConfig } = useRuntimeConfig().public;
  try {
    const data = await $fetch("/api/auth", {
      method: "POST",
      body: { email: email.value, password: password.value },
    });

    useCookie("sid", cookieConfig).value = data.sid;
    useCookie("user", cookieConfig).value = data.user;

    navigateTo({ name: "student" });
  } catch (error) {
    message.value = error.response._data.message;
  }
}
</script>
