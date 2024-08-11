<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<template>
  <nav>
      <RouterLink to="/login"></RouterLink>
    </nav>
    <RouterView />
</template>

<script>
export default {
  name: 'App',
}
</script>