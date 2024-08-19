<template>
  <UserLogin msg="Login" />
  <div id="app">
    <nav>
      <RouterLink to="/login"></RouterLink>
    </nav>
    <RouterView />
  </div>

</template>

<script>
export default {
  name: 'App',
}
</script>