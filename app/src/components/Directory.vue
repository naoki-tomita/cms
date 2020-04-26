<template>
  <div>
    <ul v-for="directory in directories" :key="directory.id">
      <li>
        {{ directory.name }}
        <button @click="directory.open = !directory.open">{{ directory.open ? "close" : "open" }}</button>
        <documents v-if="directory.open" :tenant-id="tenantId" :directory-id="directory.id">
      </li>
    </ul>
    <input v-model="name">
    <button @click="postDirectory">regiister</button>
  </div>
</template>

<script>
  const Documents = require("./Documents");
  module.exports = {
    components: {
      Documents
    },
    async created() {
      this.fetchDirectories();
    },
    props: ["tenantId"],
    data() {
      return {
        directories: [],
        name: "",
      }
    },
    methods: {
      async postDirectory() {
        await fetch(`/v1/tenants/${this.tenantId}/directories`, {
          method: "post", headers: { "content-type": "application/json" },
          body: JSON.stringify({ name: this.name })
        });
        this.fetchDirectories();
      },
      async fetchDirectories() {
        const result = await fetch(`/v1/tenants/${this.tenantId}/directories`);
        const response = await result.json();
        this.$data.directories = response.map(it => ({ ...it, open: false }));
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
