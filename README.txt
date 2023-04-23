Run mongo in docker:

docker run --name mongo-for-prf -p 27017:27017 -v ./mongo:/data/db -d mongo