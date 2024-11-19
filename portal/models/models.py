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
    modality = Column(String, nullable=False)
    phenotype_id = Column(String, nullable=False)
    twas_p = Column(Float, nullable=False)

    def __repr__(self):
        return f"<TWASResult({self.tissue}, {self.trait}, {self.gene_id}), {self.modality}, {self.phenotype_id}, {self.twas_p})>"
