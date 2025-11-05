# ---- Build stage ----
FROM node:20-alpine AS build
WORKDIR /app

# Copy only package files first for caching
COPY package*.json ./

# Install ALL dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Build the project
RUN npm run build


# ---- Runtime stage ----
FROM node:20-alpine AS runtime
WORKDIR /app

# Copy only production deps and build output
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist

# Install only production deps
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/server.js"]
