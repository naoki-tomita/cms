import { readFile } from "fs";
import { Step, DataStoreFactory, BeforeSuite } from "gauge-ts";
import { equal, deepEqual, ok } from "assert";
import fetch from "node-fetch";
import { parse } from "./CSV";
import { Database } from "./DB";
import { expect } from "chai";

async function readFileAsync(path: string) {
  return new Promise<string>((ok, ng) => readFile(path, (err, data) => err ? ng(err) : ok(data.toString())));
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
  }

  @Step("テナント登録リクエスト<testCase>をPOSTする")
  public async registerTenant(testCase: string) {
    const body = await readFileAsync(`resources/tenant/${testCase}/setup/postTenantRequest.json`);
    const response = await fetch(`${"http://localhost:8000"}/v1/tenants`, {
      method: "POST", headers: { "content-type": "application/json" }, body,
    });
    setStatus(response.status);
    setBody(await response.json());
  }

  @Step("ステータスコードが<code>でレスポンスされる")
  public async verifyStatusCode(code: string) {
    equal(status(), parseInt(code, 10));
  }

  @Step("テナント登録リクエストのレスポンスボディが<testCase>と一致する")
  public async verifyTenantRegisterResponse(testCase: string) {
    const body = await readFileAsync(`resources/tenant/${testCase}/expected/postTenantResponse.json`);
    this.verifyBody(JSON.parse(body));
  }

  public async verifyBody(json: any) {
    expect(body()).to.include(json);
  }

  @Step("テナント情報<testCase>がDBに登録されている")
  public async verifyTenantRegister(testCase: string) {
    const csv = await readFileAsync(`resources/tenant/${testCase}/expected/db/tenant.csv`);
    const items = parse(csv);
    const results = await new Database().run(exec => exec("select * from tenant"));
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
