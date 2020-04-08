import { insertInto, select } from "sql-query-factory";
import { Database } from "../driver/Database";
import { inject } from "omusubi";

interface Directory {
  id: string;
  tenant_id: string;
  name: string;
}

export class Directories {
  @inject(Database)
  database!: Database

  async getDirectory(id: string, tenantId: string) {
    return await this.database.exec<Directory>(
      select("*").from<Directory>("directory")
        .where("id").equal(id)
        .and("tenant_id").equal(tenantId)
    );
  }

  async getDirectoriesByTenantId(tenantId: string) {
    return await this.database.exec<Directory>(
      select("*").from<Directory>("directory")
        .where("tenant_id").equal(tenantId)
    );
  }

  async registerDirectory(id: string, tenantId: string, name: string) {
    return await this.database.exec<Directory>(
      insertInto<Directory>("directory")
        .keys("id", "tenant_id", "name")
        .values(id, tenantId, name)
    );
  }
}
