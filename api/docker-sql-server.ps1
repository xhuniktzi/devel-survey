docker pull mcr.microsoft.com/mssql/server:2022-latest
docker run -e "ACCEPT_EULA=Y" -e "SA_PASSWORD=BaseDatos2+" -p 1433:1433 --name sqlserver-alpha -d mcr.microsoft.com/mssql/server:2022-latest