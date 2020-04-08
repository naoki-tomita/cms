import { inject } from "omusubi";
import { Response, root, path, post, get, put, Request } from "summer-framework";
import { Documents } from "../gateway/Documents";
import { Directories } from "../gateway/Directories";
import { uuid } from "../UUID";
import { Tenants } from "../gateway/Tenants";

@root("/v1/tenants/:tenantId/directories")
class DirectoryResource {
  @inject(Tenants)
  tenants!: Tenants;

  @inject(Directories)
  directories!: Directories;

  @get
  @path("")
  async getDirectories({ params: {tenantId} }: Request<{tenantId: string}>): Promise<Response> {
    const directories = await this.directories.getDirectoriesByTenantId(tenantId);
    return new Response().status(200).body(directories.rows);
  }

  @get
  @path("/:directoryId")
  async getDocument({ params: {directoryId, tenantId} }: Request<{tenantId: string, directoryId: string}>): Promise<Response> {
    const documents = await this.directories.getDirectory(directoryId, tenantId);
    if (documents.rowCount === 0) {
      return new Response().status(404);
    }
    return new Response().status(200).body(documents.rows[0]);
  }

  @post
  @path("")
  async postDirectory({
    params: { tenantId },
    body: { name }
  }: Request<
    {tenantId: string}, {},
    {name: string}
  >): Promise<Response> {
    const id = uuid();
    await this.directories.registerDirectory(id, tenantId, name);
    return new Response().status(201).body({ id, name });
  }

  @put
  @path("/:directoryId")
  async putDocument(
    { params: { tenantId, documentId }, body: { title, content, directoryId } }: Request<
      { tenantId: string, documentId: string }, {},
      { title?: string, content?: string, directoryId?: string }
    >
  ): Promise<Response> {
    throw Error("unimplemented");
  }
}
