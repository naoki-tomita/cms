import "./src/rest/index";
import { Database } from "./src/driver/Database";
import { register } from "omusubi";
import { listen } from "summer-framework";
import { Tenants } from "./src/gateway/Tenants";
import { Directories } from "./src/gateway/Directories";
import { Documents } from "./src/gateway/Documents";

async function main() {
  const database = new Database();
  await database.init();
  register(database).as(Database);

  const tenants = new Tenants();
  register(tenants).as(Tenants);

  const directories = new Directories();
  register(directories).as(Directories);

  const documents = new Documents();
  register(documents).as(Documents);
  listen(8081);
}
main();
