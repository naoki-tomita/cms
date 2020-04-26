import { Client, QueryResult } from "pg";
import { parse } from "./CSV";
import { insertInto } from "sql-query-factory";

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

  async insertAll(table: string, csv: string) {
    const parsed = parse(csv);
    await this.client.connect();
    const keys = Object.keys(parsed[0]);
    return Promise.all(parsed.map(line => insertInto<any>(table).keys(...keys).values(...(keys.map(it => line[it]))))
      .map(query => this.client.query(query.build())));
  }
}
