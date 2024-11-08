# Gunakan image Node.js resmi
FROM node:18

# Buat dan gunakan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Salin semua file ke dalam container
COPY . .

# Ekspose port 3000
EXPOSE 3000

# Jalankan aplikasi
CMD ["node", "index.js"]
