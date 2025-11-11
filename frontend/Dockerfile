FROM node:20
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build the frontend
RUN npm run build

# Run vite preview (serves dist)
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
