"""Database model definitions using SQLAlchemy."""

from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TWASResult(Base):
    __tablename__ = 'twas_result'
    
    id = Column(Integer, primary_key=True)
    tissue = Column(String, nullable=False)
    trait = Column(String, nullable=False)
    gene_id = Column(String, nullable=False)
    twas_p = Column(Float, nullable=False)

    def __repr__(self):
        return f"<TWASResult(tissue={self.tissue}, trait={self.trait}, gene_id={self.gene_id}), twas_p={self.twas_p}>"
