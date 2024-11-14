"""Load TSV files into a SQLite database."""

import os
import sys
import pandas as pd
from sqlalchemy import create_engine
project_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(project_dir)
from portal.models.models import TWASResult
from portal.config import DATABASE_URI

# Set up database connection
engine = create_engine(DATABASE_URI)

# Load data from TSV file
def load_data(tsv_file):
    # Load specific columns from the TSV file
    df = pd.read_csv(tsv_file, sep='\t', usecols=['tissue', 'trait', 'gene_id', 'TWAS.P'])
    df.rename(columns={'TWAS.P': 'twas_p'}, inplace=True)
    df.to_sql(TWASResult.__tablename__, engine, if_exists='fail', index=True, index_label='id')

if __name__ == '__main__':
    load_data('data/gtex.twas_hits.1000.tsv')
