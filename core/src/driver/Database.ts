import { Client } from "pg";

export class Database {
  client: Client;
  constructor() {
    this.client = new Client({
      user: "cms",
      host: "localhost",
      database: "cms",
      password: "cms",
      port: 8010,
    });
  }

  async init() {
    await this.client.connect();
  }

  async exec<T>(buildable: { build(): string }) {
    return await this.client.query<T>(buildable.build());
  }

  async execQuery<T>(query: string) {
    return await this.client.query<T>(query);
  }
}
