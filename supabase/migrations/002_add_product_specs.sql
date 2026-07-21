-- Compare the Cool: Add detailed product specs columns
-- These give us structured queryable fields alongside the JSONB data blob

ALTER TABLE ctc_products ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}';
ALTER TABLE ctc_products ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 0;
ALTER TABLE ctc_products ADD COLUMN IF NOT EXISTS editorial JSONB DEFAULT '{}'; -- { pros:[], cons:[], verdict:"" }
