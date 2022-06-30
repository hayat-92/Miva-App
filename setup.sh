mongo imagedb --eval "db.dropDatabase()" 
# mongoimport -d imagedb -c users --file data/users.json
# mongoimport -d imagedb -c crops --file data/crops.json