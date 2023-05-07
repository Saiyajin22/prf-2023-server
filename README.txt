Steps to run project:

1. Run the below command (You need running docker for this, --name can be different):
docker run --name mongo-for-prf -p 27017:27017 -v ./mongo:/data/db -d mongo

2. Go to prf-2023-server folder, and run these commands (You need NodeJS on your machine):
- npm install
- node app.js

3. Go to prf-2023-frontend folder, and run these commands(You need angular CLI Installed):
- npm install
- ng serve