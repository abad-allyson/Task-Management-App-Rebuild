<template>
  <v-app>
    <v-navigation-drawer
      class="v-navigation-drawer--mobile"
      permanent
      width="220"
    >
      <v-list nav>
        <v-list-item
          link
          @click="goToTask()"
          class="font-weight-bold"
          prepend-icon="mdi-text"
          >Tasks List</v-list-item
        >
        <v-list-item
          link
          @click="goToStudent"
          class="font-weight-bold"
          prepend-icon="mdi-account"
          >Students List</v-list-item
        >
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
const router = useRouter();

const goToStudent = () => router.push("/student");
const goToTask = () => router.push("/");
</script>
