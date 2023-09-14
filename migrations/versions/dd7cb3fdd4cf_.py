"""empty message

Revision ID: dd7cb3fdd4cf
Revises: 
Create Date: 2023-09-13 19:20:30.460773

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'dd7cb3fdd4cf'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('image',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('url', sa.String(length=150), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=25), nullable=False),
    sa.Column('lastname', sa.String(length=25), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('password', sa.String(length=80), nullable=False),
    sa.Column('phone_number', sa.String(length=30), nullable=False),
    sa.Column('account_creation_date', sa.String(length=40), nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('house',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=150), nullable=False),
    sa.Column('category', sa.String(length=10), nullable=False),
    sa.Column('image_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('location', sa.String(length=150), nullable=False),
    sa.Column('number_of_rooms', sa.Integer(), nullable=False),
    sa.Column('number_of_bathrooms', sa.Integer(), nullable=False),
    sa.Column('parking', sa.Boolean(), nullable=False),
    sa.Column('wifi', sa.Boolean(), nullable=False),
    sa.Column('virified_account', sa.Boolean(), nullable=False),
    sa.Column('price', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['image_id'], ['image.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('booking',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.Column('house_id', sa.Integer(), nullable=True),
    sa.Column('date_of_admission', sa.String(length=100), nullable=False),
    sa.Column('date_of_delivery', sa.String(length=100), nullable=False),
    sa.ForeignKeyConstraint(['house_id'], ['house.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('favorites',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('house_id', sa.Integer(), nullable=True),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['house_id'], ['house.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('favorites')
    op.drop_table('booking')
    op.drop_table('house')
    op.drop_table('user')
    op.drop_table('image')
    # ### end Alembic commands ###
