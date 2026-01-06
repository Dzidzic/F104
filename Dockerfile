# Bazowy obraz Node.js
FROM node:20

# Ustawienie katalogu roboczego w kontenerze
WORKDIR /usr/src/app

# Kopiujemy pliki package.json i package-lock.json
COPY package*.json ./

# Instalacja zależności
RUN npm install

# Kopiujemy całą aplikację
COPY . .

# Port, na którym działa serwer
EXPOSE 8080

# Domyślne polecenie (produkcyjne)
CMD ["npm", "run", "start"]

# Jeśli chcesz używać nodemon w trybie deweloperskim:
#CMD ["npm", "run", "dev"]
