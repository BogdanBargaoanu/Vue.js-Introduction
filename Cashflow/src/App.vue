<template>
  <div id="app">
    <nav>
      <RouterLink to="/login"></RouterLink>
      <RouterLink to="/register"></RouterLink>
      <RouterLink to="/dashboard"></RouterLink>
    </nav>
    <RouterView />
  </div>

</template>

<script>
export default {
  name: 'App',
}
</script>