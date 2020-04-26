import { Client, QueryResult } from "pg";

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

  async exec<T>(buildable: { build(): string }): Promise<QueryResult<T>>;
  async exec<T>(query: string): Promise<QueryResult<T>>;
  async exec<T>(param: { build(): string } | string): Promise<QueryResult<T>> {
    if (typeof param === "string") {
      return await this.execQuery(param);
    }
    return await this.client.query<T>(param.build());
  }

  private async execQuery<T>(query: string) {
    return await this.client.query<T>(query);
  }
}
