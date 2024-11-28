"""Load TSV files into a SQLite database."""

import pandas as pd
from sqlalchemy import create_engine

engine = create_engine('sqlite:///data/data.db')

def load_twas_results(tsv_file):
    df = pd.read_csv(tsv_file, sep='\t', usecols=['tissue', 'trait', 'gene_id', 'modality', 'phenotype_id', 'TWAS.P'])
    df.rename(columns={'TWAS.P': 'twas_p'}, inplace=True)
    df.to_sql('twas_result', engine, if_exists='fail', index=True, index_label='id')

def load_qtls_combined(tsv_file):
    df = pd.read_csv(tsv_file, sep='\t', usecols=['tissue', 'gene_id', 'rank', 'modality', 'phenotype_id', 'variant_id', 'pval_beta'])
    # Split variant_id into chromosome and position columns
    df[['chrom', 'pos']] = df['variant_id'].str.split('_', n=2, expand=True).iloc[:, :2]
    df['pos'] = df['pos'].astype(int)
    df = df[['tissue', 'gene_id', 'rank', 'modality', 'phenotype_id', 'variant_id', 'chrom', 'pos', 'pval_beta']]
    df.to_sql('qtls_combined', engine, if_exists='fail', index=True, index_label='id')

if __name__ == '__main__':
    load_twas_results('data/processed/gtex.twas_hits.tsv.gz')
    load_qtls_combined('data/processed/gtex.comb.qtls.tsv.gz')
