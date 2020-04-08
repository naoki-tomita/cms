<template>
  <div>
    <ul v-for="tenant in tenants">
      <li>
        {{ tenant.name }}
        <button @click="tenant.open = !tenant.open">{{ tenant.open ? "close" : "open" }}</button>
        <directory v-if="tenant.open" :tenant-id="tenant.id" />
      </li>
    </ul>
    <input v-model="name">
    <button @click="postTenant">regiister</button>
  </div>
</template>

<script>
  const Directory = require("./src/components/Directory");
  module.exports = {
    components: {
      Directory
    },
    async created() {
      this.fetchTenants();
    },
    data() {
      return {
        tenants: [],
        name: "",
      }
    },
    methods: {
      async postTenant() {
        fetch("/v1/tenants", {
          method: "post",
          headers: {"content-type": "application/json"},
          body: JSON.stringify({ name: this.name })
        });
        this.name = "";
        this.fetchTenants();
      },
      async fetchTenants() {
        const result = await fetch("/v1/tenants");
        const response = await result.json();
        this.tenants = response.map(it => ({ ...it, open: false }));
      }
    }
  }
</script>

<style lang="scss">
p {
  font-size: 2em;
  text-align: center;
}
</style>
