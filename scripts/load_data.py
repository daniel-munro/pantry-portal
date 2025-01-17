"""Load TSV files into a SQLite database."""

import gzip
import pandas as pd
from sqlalchemy import create_engine, Engine

def load_gene_info(gtf: str) -> pd.DataFrame:
    records = []    
    with gzip.open(gtf, 'rt') as f:
        for line in f:
            if line[0] == '#': continue  # skip header
            row = line.strip().split('\t')
            if row[2] == 'gene':
                gene_id = row[8].split('gene_id "')[1].split('"')[0]
                try:
                    gene_name = row[8].split('gene_name "')[1].split('"')[0]
                except IndexError:
                    gene_name = None
                chrom = row[0] if row[0][:3] == 'chr' else f'chr{row[0]}'
                tss = int(row[3]) if row[6] == '+' else int(row[4])
                records.append({
                    'gene_id': gene_id,
                    'gene_name': gene_name,
                    'gene_chrom': chrom,
                    'gene_tss': tss
                })
    return pd.DataFrame(records)

def load_tissue_info(tsv_file: str) -> pd.DataFrame:
    df = pd.read_csv(tsv_file, sep='\t', usecols=['tissueSiteDetail', 'tissueSiteDetailAbbr'])
    df.rename(columns={'tissueSiteDetail': 'tissue_name', 'tissueSiteDetailAbbr': 'tissue'}, inplace=True)
    return df

def load_trait_info(tsv_file: str) -> pd.DataFrame:
    df = pd.read_csv(tsv_file, sep='\t', usecols=['Tag', 'Phenotype'])
    df.rename(columns={'Tag': 'id', 'Phenotype': 'name'}, inplace=True)
    df.set_index('id', inplace=True)
    return df

def load_twas_results(tsv_file: str, genes: pd.DataFrame, tissues: pd.DataFrame, traits: pd.DataFrame, modality_map: dict, engine: Engine) -> None:
    df = pd.read_csv(tsv_file, sep='\t', usecols=['tissue', 'trait', 'gene_id', 'modality', 'phenotype_id', 'TWAS.P'])
    df.rename(columns={'TWAS.P': 'twas_p'}, inplace=True)
    df = df.merge(tissues, on='tissue', how='left')
    df['trait'] = df['trait'].map(traits['name'])
    df['modality'] = df['modality'].map(modality_map)
    df = df.merge(
        genes[['gene_id', 'gene_name', 'gene_chrom', 'gene_tss']], 
        on='gene_id',
        how='left'
    )
    df.to_sql('twas_result', engine, if_exists='fail', index=True, index_label='id')

def load_qtls_combined(tsv_file: str, genes: pd.DataFrame, tissues: pd.DataFrame, modality_map: dict, engine: Engine) -> None:
    df = pd.read_csv(tsv_file, sep='\t', usecols=['tissue', 'gene_id', 'rank', 'modality', 'phenotype_id', 'variant_id', 'pval_beta'])
    df[['chrom', 'pos']] = df['variant_id'].str.split('_', n=2, expand=True).iloc[:, :2]
    df['pos'] = df['pos'].astype(int)
    df = df.merge(tissues, on='tissue', how='left')
    df['modality'] = df['modality'].map(modality_map)
    df = df.merge(
        genes[['gene_id', 'gene_name']], 
        on='gene_id',
        how='left'
    )
    df.to_sql('qtls_combined', engine, if_exists='fail', index=True, index_label='id')

engine = create_engine('sqlite:///data/data.db')
modality_map = {
    'alt_polyA': 'Alternative polyA',
    'alt_TSS': 'Alternative TSS', 
    'expression': 'Expression',
    'isoforms': 'Isoform ratio',
    'splicing': 'Intron excision ratio',
    'stability': 'RNA stability',
}

if __name__ == '__main__':
    genes = load_gene_info('data/other/Homo_sapiens.GRCh38.106.gtf.gz')
    tissues = load_tissue_info('data/other/tissueInfo.tsv')
    traits = load_trait_info('data/info/gwas_metadata.txt')
    load_twas_results('data/processed/gtex.twas_hits.tsv.gz', genes, tissues, traits, modality_map, engine)
    load_qtls_combined('data/processed/gtex.comb.qtls.tsv.gz', genes, tissues, modality_map, engine)
