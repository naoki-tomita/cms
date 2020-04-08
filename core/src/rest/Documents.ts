import { inject } from "omusubi";
import { Response, root, path, post, get, put, Request } from "summer-framework";
import { Documents } from "../gateway/Documents";
import { Directories } from "../gateway/Directories";
import { uuid } from "../UUID";

@root("/v1/tenants/:tenantId/directories/:directoryId/documents")
class DocumentResource {
  @inject(Documents)
  documents!: Documents;

  @inject(Directories)
  directories!: Directories;

  @get
  @path("")
  async getDocuments({ params: {directoryId} }: Request<{directoryId: string}>): Promise<Response> {
    const documents = await this.documents.getDocumentsByDirectoryId(directoryId);
    return new Response().status(200).body(documents.rows);
  }

  @get
  @path("/:documentId")
  async getDocument({ params: {documentId} }: Request<{documentId: string}>): Promise<Response> {
    const documents = await this.documents.getDocument(documentId);
    if (documents.rowCount === 0) {
      return new Response().status(404);
    }
    return new Response().status(200).body(documents.rows[0]);
  }

  @post
  @path("")
  async postDocument({
    params: { tenantId, directoryId },
    body: { title, content }
  }: Request<
    {tenantId: string, directoryId: string}, {},
    {title: string, content: string}
  >): Promise<Response> {
    const id = uuid();
    await this.documents.registerDocument(id, directoryId, title, content);
    return new Response().status(201).body({ id, directoryId, title, content });
  }

  @put
  @path("/:documentId")
  async putDocument(
    { params: { tenantId, documentId }, body: { title, content, directoryId } }: Request<
      { tenantId: string, documentId: string }, {},
      { title?: string, content?: string, directoryId?: string }
    >
  ): Promise<Response> {
    await this.documents.updateDocument(documentId, { title, content, directory_id: directoryId })
    return new Response().status(200);
  }
}
