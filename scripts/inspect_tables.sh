# Check first 10 rows of each table

for table in $(sqlite3 data/data.db .tables); do
    echo $table
    sqlite3 data/data.db ".headers on" "SELECT * FROM $table LIMIT 10;"
done
