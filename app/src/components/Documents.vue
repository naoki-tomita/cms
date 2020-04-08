<template>
  <div>
    <ul v-for="document in documents">
      <li>
        {{ document.title }}:{{ document.content }}
      </li>
    </ul>
    <input v-model="title"/><input v-model="content"><button @click="postDocument">register</button>
  </div>
</template>

<script>
  module.exports = {
    async created() {
      this.fetchDocuments();
    },
    props: ["tenantId", "directoryId"],
    data() {
      return {
        documents: [],
        title: "",
        content: "",
      }
    },
    methods: {
      async postDocument() {
        await fetch(`/v1/tenants/${this.tenantId}/directories/${this.directoryId}/documents`, {
          method: "post", headers: { "content-type": "application/json" },
          body: JSON.stringify({ title: this.title, content: this.content })
        });
        this.fetchDocuments();
      },
      async fetchDocuments() {
        console.log(this)
        const result = await fetch(`/v1/tenants/${this.tenantId}/directories/${this.directoryId}/documents`);
        const response = await result.json();
        this.documents = response;
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
