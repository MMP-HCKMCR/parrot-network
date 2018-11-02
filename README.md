# Parrot Network

To run locally:

```powershell
docker-compose up --force-recreate --build
```

or :

```powershell
docker run -p 27017:27017 --name mongo -d mongo
$env:MONGO_CONN = "mongodb://localhost:27017/parrots"

yarn install
gulp
npm start
```