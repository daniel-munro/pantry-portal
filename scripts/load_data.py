"""Load TSV files into a SQLite database."""

import os
import sys
import pandas as pd
from sqlalchemy import create_engine

engine = create_engine('sqlite:///portal/data.db')

def load_data(tsv_file):
    df = pd.read_csv(tsv_file, sep='\t', usecols=['tissue', 'trait', 'gene_id', 'modality', 'phenotype_id', 'TWAS.P'])
    df.rename(columns={'TWAS.P': 'twas_p'}, inplace=True)
    df.to_sql('twas_result', engine, if_exists='fail', index=True, index_label='id')

if __name__ == '__main__':
    load_data('portal/static/data/processed/gtex.twas_hits.tsv.gz')
