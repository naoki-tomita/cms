import { inject } from "omusubi";
import { Database } from "../driver/Database";
import { select, insertInto, update } from "sql-query-factory";

interface Tenant {
  id: string;
  name: string;
}

export class Tenants {
  @inject(Database)
  database!: Database

  async getTenants() {
    return this.database.exec<Tenant>(
      select("*").from<Tenant>("tenant")
    );
  }

  async getTenant(id: string) {
    return this.database.exec<Tenant>(
      select("*").from<Tenant>("tenant")
        .where("id").equal(id)
    );
  }

  async registerTenant(id: string, name: string) {
    return this.database.exec(
      insertInto<Tenant>("tenant")
        .keys("id", "name")
        .values(id, name)
    )
  }

  async updateTenant(id: string, name: string) {
    return this.database.exec(
      update<Tenant>("tenant")
        .set("name", name)
        .where("id").equal(id)
    );
  }
}
