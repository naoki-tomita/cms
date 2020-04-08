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

  async run<T>(cb: (exec: (query: string) => void) => void): Promise<T[]> {
    await this.client.connect();
    let execution: Promise<QueryResult<T>>;
    const exec = async (query: string) => execution = this.client.query(query);
    cb(exec);
    const result = await execution;
    await this.client.end();
    return result.rows;
  }
}
