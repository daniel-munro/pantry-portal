# Collect Pantry and LaDDR data for portal

set -e

modalities="alt_polyA alt_TSS expression isoforms splicing stability"

mkdir -p data/{processed,info,rna_phenotypes,covariates,qtls,twas_weights,twas_associations}

rsync -a ../laddr/repo/repo/info/pcg_and_lncrna.tsv data/processed/

rsync -a ../data/gtex/tissueInfo.tsv data/info/
cat ../data/gtex/tissues-49.txt <(echo "GEUVADIS") | sort > data/info/tissues.txt
rsync -a ../pantry/twas/input/gwas/gwas_metadata.txt data/info/
gzip -c ../ref/human-ensembl/Homo_sapiens.GRCh38.113.chr.chrom.gtf > data/info/Homo_sapiens.GRCh38.113.chr.chrom.gtf.gz

####################
## RNA phenotypes ##
####################

## GTEx
cat ../laddr/data/gtex/tissues.gtex.txt | while read tissue; do
    ## Pantry
    for modality in alt_polyA alt_TSS expression isoforms splicing stability; do
        rsync -a ../pantry/pheast/$tissue/input/phenotypes/$modality.bed.gz data/rna_phenotypes/$tissue.$modality.bed.gz
    done
    ## LaDDR
    rsync -a ../laddr/pheast/gtextcga-full/input/phenotypes/$tissue-latent.bed.gz data/rna_phenotypes/$tissue.latent_full.bed.gz
    rsync -a ../laddr/pheast/gtex-residual/input/phenotypes/$tissue-latent.bed.gz data/rna_phenotypes/$tissue.latent_residual.bed.gz
done
## Geuvadis Pantry
for modality in alt_polyA alt_TSS expression isoforms splicing stability; do
    rsync -a ../pantry/phenos/GEUVADIS/output/$modality.bed.gz data/rna_phenotypes/GEUVADIS.$modality.bed.gz
done
## Geuvadis LaDDR
rsync -a ../laddr/pheast/geuvadis/input/phenotypes/geuvadis-full-Geuvadis-latent.bed.gz data/rna_phenotypes/GEUVADIS.latent_full.bed.gz
rsync -a ../laddr/pheast/geuvadis/input/phenotypes/geuvadis-residual-Geuvadis-latent.bed.gz data/rna_phenotypes/GEUVADIS.latent_residual.bed.gz

################
## Covariates ##
################

## GTEx
cat ../laddr/data/gtex/tissues.gtex.txt | while read tissue; do
    ## Pantry
    for modality in alt_polyA alt_TSS expression isoforms splicing stability; do
        rsync -a ../pantry/pheast/$tissue/intermediate/covar/$modality.covar.tsv data/covariates/$tissue.$modality.covar.tsv
        rsync -a ../pantry/pheast/$tissue/intermediate/covar/$modality.covar.plink.tsv data/covariates/$tissue.$modality.covar.plink.tsv
    done
    rsync -a ../pantry/pheast/$tissue/intermediate/covar/cross_modality.covar.tsv data/covariates/$tissue.cross_modality_kdp.covar.tsv
    ## LaDDR
    rsync -a ../laddr/pheast/gtextcga-full/intermediate/covar/$tissue-latent.covar.tsv data/covariates/$tissue.latent_full.covar.tsv
    rsync -a ../laddr/pheast/gtex-residual/intermediate/covar/$tissue-cross_latent.covar.tsv data/covariates/$tissue.cross_modality_hybrid.covar.tsv
    rsync -a ../laddr/pheast/gtextcga-full/intermediate/covar/$tissue-latent.covar.plink.tsv data/covariates/$tissue.latent_full.covar.plink.tsv
    rsync -a ../laddr/pheast/gtex-residual/intermediate/covar/$tissue-latent.covar.plink.tsv data/covariates/$tissue.latent_residual.covar.plink.tsv
done
## Geuvadis Pantry
for modality in alt_polyA alt_TSS expression isoforms splicing stability; do
    rsync -a ../pantry/pheast/GEUVADIS/intermediate/covar/$modality.covar.tsv data/covariates/GEUVADIS.$modality.covar.tsv
    rsync -a ../pantry/pheast/GEUVADIS/intermediate/covar/$modality.covar.plink.tsv data/covariates/GEUVADIS.$modality.covar.plink.tsv
done
rsync -a ../pantry/pheast/GEUVADIS/intermediate/covar/cross_modality.covar.tsv data/covariates/GEUVADIS.cross_modality_kdp.covar.tsv
## Geuvadis LaDDR
rsync -a ../laddr/pheast/geuvadis/intermediate/covar/geuvadis-full-Geuvadis-latent.covar.tsv data/covariates/GEUVADIS.latent_full.covar.tsv
rsync -a ../laddr/pheast/geuvadis/intermediate/covar/geuvadis-residual-Geuvadis-cross_latent.covar.tsv data/covariates/GEUVADIS.cross_modality_hybrid.covar.tsv
rsync -a ../laddr/pheast/geuvadis/intermediate/covar/geuvadis-full-Geuvadis-latent.covar.plink.tsv data/covariates/GEUVADIS.latent_full.covar.plink.tsv
rsync -a ../laddr/pheast/geuvadis/intermediate/covar/geuvadis-residual-Geuvadis-latent.covar.plink.tsv data/covariates/GEUVADIS.latent_residual.covar.plink.tsv

###########
## xQTLs ##
###########

## GTEx
cat ../laddr/data/gtex/tissues.gtex.txt | while read tissue; do
    ## Pantry
    for modality in alt_polyA alt_TSS expression isoforms splicing stability; do
        rsync -a ../pantry/pheast/$tissue/output/qtl/$modality.cis_qtl.txt.gz data/qtls/$tissue.$modality.cis_qtl.txt.gz
        rsync -a ../pantry/pheast/$tissue/output/qtl/$modality.cis_independent_qtl.txt.gz data/qtls/$tissue.$modality.cis_independent_qtl.txt.gz
    done
    rsync -a ../pantry/pheast/$tissue/output/qtl/cross_modality.cis_qtl.txt.gz data/qtls/$tissue.cross_modality_kdp.cis_qtl.txt.gz
    rsync -a ../pantry/pheast/$tissue/output/qtl/cross_modality.cis_independent_qtl.txt.gz data/qtls/$tissue.cross_modality_kdp.cis_independent_qtl.txt.gz
    ## LaDDR
    rsync -a ../laddr/pheast/gtextcga-full/output/qtl/$tissue-latent.cis_qtl.txt.gz data/qtls/$tissue.latent_full.cis_qtl.txt.gz
    rsync -a ../laddr/pheast/gtextcga-full/output/qtl/$tissue-latent.cis_independent_qtl.txt.gz data/qtls/$tissue.latent_full.cis_independent_qtl.txt.gz
    rsync -a ../laddr/pheast/gtex-residual/output/qtl/$tissue-cross_latent.cis_qtl.txt.gz data/qtls/$tissue.cross_modality_hybrid.cis_qtl.txt.gz
    rsync -a ../laddr/pheast/gtex-residual/output/qtl/$tissue-cross_latent.cis_independent_qtl.txt.gz data/qtls/$tissue.cross_modality_hybrid.cis_independent_qtl.txt.gz
done
## Geuvadis Pantry
for modality in alt_polyA alt_TSS expression isoforms splicing stability; do
    rsync -a ../pantry/pheast/GEUVADIS/output/qtl/$modality.cis_qtl.txt.gz data/qtls/GEUVADIS.$modality.cis_qtl.txt.gz
    rsync -a ../pantry/pheast/GEUVADIS/output/qtl/$modality.cis_independent_qtl.txt.gz data/qtls/GEUVADIS.$modality.cis_independent_qtl.txt.gz
done
rsync -a ../pantry/pheast/GEUVADIS/output/qtl/cross_modality.cis_qtl.txt.gz data/qtls/GEUVADIS.cross_modality_kdp.cis_qtl.txt.gz
rsync -a ../pantry/pheast/GEUVADIS/output/qtl/cross_modality.cis_independent_qtl.txt.gz data/qtls/GEUVADIS.cross_modality_kdp.cis_independent_qtl.txt.gz
## Geuvadis LaDDR
rsync -a ../laddr/pheast/geuvadis/output/qtl/geuvadis-full-Geuvadis-latent.cis_qtl.txt.gz data/qtls/GEUVADIS.latent_full.cis_qtl.txt.gz
rsync -a ../laddr/pheast/geuvadis/output/qtl/geuvadis-full-Geuvadis-latent.cis_independent_qtl.txt.gz data/qtls/GEUVADIS.latent_full.cis_independent_qtl.txt.gz
rsync -a ../laddr/pheast/geuvadis/output/qtl/geuvadis-residual-Geuvadis-cross_latent.cis_qtl.txt.gz data/qtls/GEUVADIS.cross_modality_hybrid.cis_qtl.txt.gz
rsync -a ../laddr/pheast/geuvadis/output/qtl/geuvadis-residual-Geuvadis-cross_latent.cis_independent_qtl.txt.gz data/qtls/GEUVADIS.cross_modality_hybrid.cis_independent_qtl.txt.gz

###################
## xTWAS weights ##
###################

## GTEx
cat ../laddr/data/gtex/tissues.gtex.txt | while read tissue; do
    ## Pantry
    for modality in alt_polyA alt_TSS expression isoforms splicing stability; do
        rsync -a ../pantry/pheast/$tissue/intermediate/twas/$modality.profile data/twas_weights/$tissue.$modality.profile
        rsync -a ../pantry/pheast/$tissue/output/twas/$modality.tar.bz2 data/twas_weights/$tissue.$modality.tar.bz2
    done
    ## LaDDR
    rsync -a ../laddr/pheast/gtextcga-full/intermediate/twas/$tissue-latent.profile data/twas_weights/$tissue.latent_full.profile
    rsync -a ../laddr/pheast/gtextcga-full/output/twas/$tissue-latent.tar.bz2 data/twas_weights/$tissue.latent_full.tar.bz2
    rsync -a ../laddr/pheast/gtex-residual/intermediate/twas/$tissue-latent.profile data/twas_weights/$tissue.latent_residual.profile
    rsync -a ../laddr/pheast/gtex-residual/output/twas/$tissue-latent.tar.bz2 data/twas_weights/$tissue.latent_residual.tar.bz2
done
## Geuvadis Pantry
for modality in alt_polyA alt_TSS expression isoforms splicing stability; do
    rsync -a ../pantry/pheast/GEUVADIS/intermediate/twas/$modality.profile data/twas_weights/GEUVADIS.$modality.profile
    rsync -a ../pantry/pheast/GEUVADIS/output/twas/$modality.tar.bz2 data/twas_weights/GEUVADIS.$modality.tar.bz2
done
## Geuvadis LaDDR
rsync -a ../laddr/pheast/geuvadis/intermediate/twas/geuvadis-full-Geuvadis-latent.profile data/twas_weights/GEUVADIS.latent_full.profile
rsync -a ../laddr/pheast/geuvadis/output/twas/geuvadis-full-Geuvadis-latent.tar.bz2 data/twas_weights/GEUVADIS.latent_full.tar.bz2
rsync -a ../laddr/pheast/geuvadis/intermediate/twas/geuvadis-residual-Geuvadis-latent.profile data/twas_weights/GEUVADIS.latent_residual.profile
rsync -a ../laddr/pheast/geuvadis/output/twas/geuvadis-residual-Geuvadis-latent.tar.bz2 data/twas_weights/GEUVADIS.latent_residual.tar.bz2

#######################
## TWAS associations ##
#######################

cat ../pantry/repo/info/traits.txt | while read trait; do
    echo $trait
    mkdir $trait
    ## GTEx
    cat ../laddr/data/gtex/tissues.gtex.txt | while read tissue; do
        for modality in $modalities; do
            ln -s ../../pantry/twas/output/$tissue/$modality/fusion.$tissue.$modality.$trait.tsv $trait/
        done
        ln -s ../../laddr/twas/output/gtextcga-full-$tissue/fusion.gtextcga-full-$tissue.$trait.tsv $trait/fusion.$tissue.latent_full.$trait.tsv
        ln -s ../../laddr/twas/output/gtex-residual-$tissue/fusion.gtex-residual-$tissue.$trait.tsv $trait/fusion.$tissue.latent_residual.$trait.tsv
    done
    ## Geuvadis Pantry
    for modality in $modalities; do
        ln -s ../../pantry/twas/output/GEUVADIS/$modality/fusion.GEUVADIS.$modality.$trait.tsv $trait/
    done
    ## Geuvadis LaDDR
    ln -s ../../laddr/twas/output/geuvadis-full-Geuvadis/fusion.geuvadis-full-Geuvadis.$trait.tsv $trait/fusion.GEUVADIS.latent_full.$trait.tsv
    ln -s ../../laddr/twas/output/geuvadis-residual-Geuvadis/fusion.geuvadis-residual-Geuvadis.$trait.tsv $trait/fusion.GEUVADIS.latent_residual.$trait.tsv

    ## -h dereferences symlinks to include the actual files
    tar -cjhf data/twas_associations/$trait.tar.bz2 $trait/
    rm -r $trait
done

##################################
## Aggregated results: Geuvadis ##
##################################

## geuvadis.separate_kdp.assoc.tsv.gz
{
    zcat data/qtls/GEUVADIS.alt_polyA.cis_qtl.txt.gz | head -1 | awk 'BEGIN{OFS="\t"} {print "modality", $0}'
    for modality in $modalities; do
        zcat data/qtls/GEUVADIS.$modality.cis_qtl.txt.gz | tail -n +2 | awk -v mod="$modality" 'BEGIN{OFS="\t"} {print mod, $0}'
    done
} | gzip > data/processed/geuvadis.separate_kdp.assoc.tsv.gz

## geuvadis.ddp.assoc.tsv.gz
cp data/qtls/GEUVADIS.latent_full.cis_qtl.txt.gz data/processed/geuvadis.ddp.assoc.tsv.gz

## geuvadis.separate_kdp.qtls.tsv.gz
{
    zcat data/qtls/GEUVADIS.alt_polyA.cis_independent_qtl.txt.gz | head -1 | awk 'BEGIN{OFS="\t"} {print "modality", $0}'
    for modality in $modalities; do
        zcat data/qtls/GEUVADIS.$modality.cis_independent_qtl.txt.gz | tail -n +2 | awk -v mod="$modality" 'BEGIN{OFS="\t"} {print mod, $0}'
    done
} | gzip > data/processed/geuvadis.separate_kdp.qtls.tsv.gz

## geuvadis.cross_modality_kdp.qtls.tsv.gz
zcat data/qtls/GEUVADIS.cross_modality_kdp.cis_independent_qtl.txt.gz \
| awk -F'\t' 'BEGIN{OFS="\t"} 
    NR==1 { print "modality", $0; next } 
    {
        n = split($1, a, ":");
        mod = a[1];
        $1 = a[2];
        print mod, $0
    }' \
| gzip > data/processed/geuvadis.cross_modality_kdp.qtls.tsv.gz

## geuvadis.cross_modality_hybrid.qtls.tsv.gz
zcat data/qtls/GEUVADIS.cross_modality_hybrid.cis_independent_qtl.txt.gz \
| awk -F'\t' 'BEGIN{OFS="\t"} 
    NR==1 { print "modality", $0; next } 
    {
        n = split($1, a, ":");
        mod = a[1];
        $1 = a[2];
        print mod, $0
    }' \
| gzip > data/processed/geuvadis.cross_modality_hybrid.qtls.tsv.gz

## geuvadis.ddp.qtls.tsv.gz
cp data/qtls/GEUVADIS.latent_full.cis_independent_qtl.txt.gz data/processed/geuvadis.ddp.qtls.tsv.gz

## geuvadis.kdp_rddp.hsq.tsv.gz
{
    head -1 data/twas_weights/GEUVADIS.alt_polyA.profile | awk 'BEGIN{OFS="\t"} {print "modality", $0}'
    for modality in $modalities latent_residual; do
        tail -n +2 data/twas_weights/GEUVADIS.$modality.profile | awk -v mod="$modality" 'BEGIN{OFS="\t"} {print mod, $0}'
    done
} | gzip > data/processed/geuvadis.kdp_rddp.hsq.tsv.gz

## geuvadis.ddp.hsq.tsv.gz
gzip -c data/twas_weights/GEUVADIS.latent_full.profile > data/processed/geuvadis.ddp.hsq.tsv.gz

## geuvadis.kdp_rddp.twas_hits.tsv.gz
{
    head -1 ../pantry/twas/output/twas_hits.GEUVADIS.alt_polyA.tsv | awk 'BEGIN{OFS="\t"} {print "modality", $0}'
    for modality in $modalities; do
        tail -n +2 ../pantry/twas/output/twas_hits.GEUVADIS.$modality.tsv | awk -v mod="$modality" 'BEGIN{OFS="\t"} {print mod, $0}'
    done
    tail -n +2 ../laddr/twas/output/twas_hits.geuvadis-residual-Geuvadis.tsv | awk -v mod="latent_residual" 'BEGIN{OFS="\t"} {print mod, $0}'
} | gzip > data/processed/geuvadis.kdp_rddp.twas_hits.tsv.gz

## geuvadis.ddp.twas_hits.tsv.gz
gzip -c ../laddr/twas/output/twas_hits.geuvadis-full-Geuvadis.tsv > data/processed/geuvadis.ddp.twas_hits.tsv.gz

##############################
## Aggregated results: GTEx ##
##############################

## gtex.separate_kdp.assoc.tsv.gz
{
    zcat data/qtls/ADPSBQ.alt_polyA.cis_qtl.txt.gz | head -1 | awk 'BEGIN{OFS="\t"} {print "tissue", "modality", $0}'
    while read tissue; do
        for modality in $modalities; do
            zcat data/qtls/$tissue.$modality.cis_qtl.txt.gz | tail -n +2 | awk -v tis="$tissue" -v mod="$modality" 'BEGIN{OFS="\t"} {print tis, mod, $0}'
        done
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.separate_kdp.assoc.tsv.gz

## gtex.ddp.assoc.tsv.gz
{
    zcat data/qtls/ADPSBQ.latent_full.cis_qtl.txt.gz | head -1 | awk 'BEGIN{OFS="\t"} {print "tissue", $0}'
    while read tissue; do
        zcat data/qtls/$tissue.latent_full.cis_qtl.txt.gz | tail -n +2 | awk -v tis="$tissue" 'BEGIN{OFS="\t"} {print tis, $0}'
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.ddp.assoc.tsv.gz

## gtex.separate_kdp.qtls.tsv.gz
{
    zcat data/qtls/ADPSBQ.alt_polyA.cis_independent_qtl.txt.gz | head -1 | awk 'BEGIN{OFS="\t"} {print "tissue", "modality", $0}'
    while read tissue; do
        for modality in $modalities; do
            zcat data/qtls/$tissue.$modality.cis_independent_qtl.txt.gz | tail -n +2 | awk -v tis="$tissue" -v mod="$modality" 'BEGIN{OFS="\t"} {print tis, mod, $0}'
        done
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.separate_kdp.qtls.tsv.gz

## gtex.cross_modality_kdp.qtls.tsv.gz
{
    zcat data/qtls/ADPSBQ.cross_modality_kdp.cis_independent_qtl.txt.gz \
    | head -1 \
    | awk -F'\t' 'BEGIN{OFS="\t"} {print "tissue", "modality", $0}'
    while read tissue; do
        zcat data/qtls/$tissue.cross_modality_kdp.cis_independent_qtl.txt.gz \
        | tail -n +2 \
        | awk -F'\t' -v tis="$tissue" 'BEGIN{OFS="\t"}
            {
                n = split($1, a, ":");
                mod = a[1];
                $1 = a[2];
                print tis, mod, $0
            }'
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.cross_modality_kdp.qtls.tsv.gz

## gtex.cross_modality_hybrid.qtls.tsv.gz
{
    zcat data/qtls/ADPSBQ.cross_modality_hybrid.cis_independent_qtl.txt.gz \
    | head -1 \
    | awk -F'\t' 'BEGIN{OFS="\t"} {print "tissue", "modality", $0}'
    while read tissue; do
        zcat data/qtls/$tissue.cross_modality_hybrid.cis_independent_qtl.txt.gz \
        | tail -n +2 \
        | awk -F'\t' -v tis="$tissue" 'BEGIN{OFS="\t"}
            {
                n = split($1, a, ":");
                mod = a[1];
                $1 = a[2];
                print tis, mod, $0
            }'
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.cross_modality_hybrid.qtls.tsv.gz

## gtex.ddp.qtls.tsv.gz
{
    zcat data/qtls/ADPSBQ.latent_full.cis_independent_qtl.txt.gz | head -1 | awk 'BEGIN{OFS="\t"} {print "tissue", $0}'
    while read tissue; do
        zcat data/qtls/$tissue.latent_full.cis_independent_qtl.txt.gz | tail -n +2 | awk -v tis="$tissue" 'BEGIN{OFS="\t"} {print tis, $0}'
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.ddp.qtls.tsv.gz

## gtex.kdp_rddp.hsq.tsv.gz
{
    head -1 data/twas_weights/ADPSBQ.alt_polyA.profile | awk 'BEGIN{OFS="\t"} {print "tissue", "modality", $0}'
    while read tissue; do
        for modality in $modalities latent_residual; do
            tail -n +2 data/twas_weights/$tissue.$modality.profile \
            | awk -v tis="$tissue" -v mod="$modality" 'BEGIN{OFS="\t"} {print tis, mod, $0}'
        done
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.kdp_rddp.hsq.tsv.gz

## gtex.ddp.hsq.tsv.gz
{
    head -1 data/twas_weights/ADPSBQ.latent_full.profile | awk 'BEGIN{OFS="\t"} {print "tissue", $0}'
    while read tissue; do
        tail -n +2 data/twas_weights/$tissue.latent_full.profile | awk -v tis="$tissue" 'BEGIN{OFS="\t"} {print tis, $0}'
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.ddp.hsq.tsv.gz

# gtex.kdp_rddp.twas_hits.tsv.gz
{
    head -1 ../pantry/twas/output/twas_hits.ADPSBQ.alt_polyA.tsv | awk 'BEGIN{OFS="\t"} {print "tissue", "modality", $0}'
    while read tissue; do
        for modality in $modalities; do
            tail -n +2 ../pantry/twas/output/twas_hits.$tissue.$modality.tsv | awk -v tis="$tissue" -v mod="$modality" 'BEGIN{OFS="\t"} {print tis, mod, $0}'
        done
        tail -n +2 ../laddr/twas/output/twas_hits.gtex-residual-$tissue.tsv | awk -v tis="$tissue" -v mod="latent_residual" 'BEGIN{OFS="\t"} {print tis, mod, $0}'
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.kdp_rddp.twas_hits.tsv.gz

## gtex.ddp.twas_hits.tsv.gz
{
    head -1 ../laddr/twas/output/twas_hits.gtextcga-full-ADPSBQ.tsv | awk 'BEGIN{OFS="\t"} {print "tissue", $0}'
    while read tissue; do
        tail -n +2 ../laddr/twas/output/twas_hits.gtextcga-full-$tissue.tsv | awk -v tis="$tissue" 'BEGIN{OFS="\t"} {print tis, $0}'
    done < ../laddr/data/gtex/tissues.gtex.txt
} | gzip > data/processed/gtex.ddp.twas_hits.tsv.gz

######################################
## Build database and compute stats ##
######################################

python3 scripts/load_data.py
python3 scripts/compute_stats.py
