# Use Node LTS
FROM node:18

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV

RUN if [ "$NODE_ENV" = "production" ]; then npm ci --omit=dev; else npm install; fi

# Copy the rest of the app
COPY . .

# Build only in production
RUN if [ "$NODE_ENV" = "production" ]; then npm run build; fi

EXPOSE 3000

# Run command based on environment
CMD if [ "$NODE_ENV" = "production" ]; then npm run start; else npm run dev; fi
