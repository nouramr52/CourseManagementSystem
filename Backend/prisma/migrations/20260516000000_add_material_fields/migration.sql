-- AlterTable: add type, url, storagePath, uploadedById to Material
-- type and url are required fields; we set defaults for existing rows first

ALTER TABLE "Material"
  ADD COLUMN "type"        TEXT,
  ADD COLUMN "url"         TEXT,
  ADD COLUMN "storagePath" TEXT,
  ADD COLUMN "uploadedById" INTEGER;

-- Back-fill existing rows with sensible defaults so NOT NULL can be applied
UPDATE "Material" SET "type" = 'PDF', "url" = COALESCE("filePath", '') WHERE "type" IS NULL;

-- Now enforce NOT NULL on type and url
ALTER TABLE "Material"
  ALTER COLUMN "type" SET NOT NULL,
  ALTER COLUMN "url"  SET NOT NULL;

-- Add foreign key for uploadedById → User
-- uploadedById is nullable (legacy rows have no uploader)
ALTER TABLE "Material"
  ADD CONSTRAINT "Material_uploadedById_fkey"
  FOREIGN KEY ("uploadedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
