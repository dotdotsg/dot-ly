docker exec -it dot-ly-db bash

docker exec -it dot-ly-db psql -U postgres -d dotlydb


## For your dot-ly app:

urls.id: keep as VARCHAR(50) (short link IDs must be custom)

users.id:
Use VARCHAR(50) + app-generated ID (e.g., nanoid) → if you want portability and full control
Use SERIAL → if you want simplicity and DB-controlled PK