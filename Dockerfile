# Gunakan image Node.js
FROM node:14

# Buat direktori 
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari proyek ke dalam container
COPY . .

# Ekspos port 3000
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "data/index.js"]
