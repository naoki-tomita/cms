\c cms;

CREATE TABLE tenant (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE directory (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL
);

CREATE TABLE document (
  id UUID PRIMARY KEY,
  directory_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  FOREIGN KEY (directory_id) REFERENCES directory(id)
);
