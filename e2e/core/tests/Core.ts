import { readFile } from "fs";
import { Step, DataStoreFactory, BeforeSuite } from "gauge-ts";
import { equal, deepEqual, ok } from "assert";
import fetch from "node-fetch";
import { parse } from "./CSV";
import { Database } from "./DB";
import { expect } from "object-assertion";

async function readFileAsync(path: string) {
  return new Promise<string>((ok, ng) => readFile(path, (err, data) => err ? ng(err) : ok(data.toString())));
}

async function readFileAsObject(path: string) {
  return JSON.parse(await readFileAsync(path))
}

async function readCsvAsListObject(path: string) {
  return parse(await readFileAsync(path));
}

function setStatus(status: number) {
  DataStoreFactory.getScenarioDataStore().put("status", status);
}

function setBody(body: any) {
  DataStoreFactory.getScenarioDataStore().put("body", body);
}

function status() {
  return DataStoreFactory.getScenarioDataStore().get("status");
}

function body() {
  return DataStoreFactory.getScenarioDataStore().get("body");
}

export default class Core {

  @BeforeSuite()
  async setup() {
    await new Database().run(exec => exec("delete from tenant"))
    await new Database().insertAll("tenant", await readFileAsync("resources/tenant/setup/tenant.csv"));
  }

  @Step("テナント登録リクエスト<testCase>をPOSTする")
  async registerTenant(testCase: string) {
    const body = await readFileAsync(`resources/tenant/${testCase}/request/postTenantRequest.json`);
    const response = await fetch(`${"http://localhost:8081"}/v1/tenants`, {
      method: "POST", headers: { "content-type": "application/json" }, body,
    });
    setStatus(response.status);
    setBody(await response.json());
  }

  @Step("テナント取得リクエストを行う")
  async getTenants() {
    const response = await fetch(`${"http://localhost:8081"}/v1/tenants`);
    setStatus(response.status);
    setBody(await response.json());
  }

  @Step("ステータスコードが<code>でレスポンスされる")
  async verifyStatusCode(code: string) {
    equal(status(), parseInt(code, 10));
  }

  @Step("レスポンスボディの一部が<testCase>と一致する")
  async verifyLooseResponseBody(testCase: string) {
    const json = await readFileAsObject(`resources/${testCase}/expected/response.json`);
    expect(body()).lazy.deepEquals(json);
  }

  @Step("レスポンスボディの配列に<testCase>の配列を含む")
  async verifyIncludesArray(testCase: string) {
    const json = await readFileAsObject(`resources/${testCase}/expected/response.json`);
    expect(body()).includes.items(json)
  }

  @Step("DBの<table>テーブルに<testCase>のデータセットが登録されている")
  async verifyDatabaseLoosy(table: string, testCase: string) {
    const items = await readCsvAsListObject(`resources/${testCase}/expected/db/${table}.csv`);
    const results = await new Database().run(exec => exec(`select * from ${table}`));
    arrayIncludesLooseItems(results, items);
  }
}

function arrayIncludesLooseItems(expected: any[], actual: any[]) {
  ok(
    actual.every(item =>
      expected.some(result =>
        Object.entries(item).every(([key, value]) =>
          result[key] === value))),
    ""
  );
}
