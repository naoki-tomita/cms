import { inject } from "omusubi";
import { Database } from "../driver/Database";
import { select, insertInto, update } from "sql-query-factory";

interface Document {
  id: string;
  directory_id: string;
  title: string;
  content: string;
}

export class Documents {
  @inject(Database)
  database!: Database

  async getDocuments() {
    return this.database.exec<Document>(
      select("*").from<Document>("document")
    );
  }

  async getDocumentsByDirectoryId(direcroryId: string) {
    return this.database.exec<Document>(
      select("*").from<Document>("document").where("directory_id").equal(direcroryId)
    );
  }

  async getDocument(id: string) {
    return this.database.exec<Document>(
      select("*").from<Document>("document")
        .where("id").equal(id)
    );
  }

  async registerDocument(id: string, directoryId: string, title: string, content: string) {
    return this.database.exec(
      insertInto<Document>("document")
        .keys("id", "directory_id", "title", "content")
        .values(id, directoryId, title, content)
    )
  }

  async updateDocument(id: string, updatedValue: Partial<Omit<Document, "id">>) {
    const u = update<Document>("tenant");
    return this.database.exec(
      (Object.keys(updatedValue) as (keyof typeof updatedValue)[])
        .reduce<any>((prev, next) => updatedValue[next] ? prev : prev.set(next, updatedValue[next]), u)
        .where("id").equal(id)
    );
  }
}
