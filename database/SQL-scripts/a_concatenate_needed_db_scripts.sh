rm -f 000__CreateALLdb.sql
cat 01__create_tables.sql 02__insert_test_data.sql > 000__CreateALLdb.sql