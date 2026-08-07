"""add search_vector column to chunks for full-text search

Revision ID: a1c9f2b7e3d4
Revises: 3947510322ea
Create Date: 2026-08-06 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = 'a1c9f2b7e3d4'
down_revision: Union[str, Sequence[str], None] = '3947510322ea'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Generated column: Postgres keeps this in sync automatically on
    # every INSERT/UPDATE to `text`. Written as raw SQL because
    # SQLAlchemy's Computed() construct isn't reliably picked up by
    # Alembic's autogenerate for existing tables.
    op.execute(
        """
        ALTER TABLE chunks
        ADD COLUMN search_vector tsvector
        GENERATED ALWAYS AS (to_tsvector('english', text)) STORED
        """
    )

    op.execute(
        """
        CREATE INDEX ix_chunks_search_vector
        ON chunks
        USING GIN (search_vector)
        """
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.execute("DROP INDEX IF EXISTS ix_chunks_search_vector")
    op.execute("ALTER TABLE chunks DROP COLUMN IF EXISTS search_vector")
