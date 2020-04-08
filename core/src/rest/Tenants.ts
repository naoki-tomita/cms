import { inject } from "omusubi";
import { Response, root, path, post, get, put, Request } from "summer-framework";
import { uuid } from "../UUID";
import { Tenants } from "../gateway/Tenants";
import { Directories } from "../gateway/Directories";

@root("/v1/tenants")
class TenantResource {
  @inject(Tenants)
  tenants!: Tenants;

  @inject(Directories)
  directories!: Directories;

  @get
  @path("")
  async getTenants(): Promise<Response> {
    const results = await this.tenants.getTenants();
    return new Response().status(200).body(results.rows);
  }

  @get
  @path("/:id")
  async getTenant({ params: { id } }: Request<{id: string}>): Promise<Response> {
    const results = await this.tenants.getTenant(id);
    return results.rowCount === 0
      ? new Response().status(404)
      : new Response().status(200).body(results.rows[0])
  }

  @post
  @path("")
  async postTenant({ body: { name } }: Request<{}, {}, { name: string }>): Promise<Response> {
    const id = uuid();
    await this.tenants.registerTenant(id, name);
    await this.directories.registerDirectory(uuid(), id, "default");
    return new Response().status(201).body({ id, name });
  }

  @put
  @path("/:id")
  async putTenant(
    { params: { id }, body: { name } }: Request<{id: string}, {}, { name: string }>
  ): Promise<Response> {
    await this.tenants.updateTenant(id, name);
    return new Response().status(200).body({ id, name });
  }
}
