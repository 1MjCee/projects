# Stage 1: Build the application
FROM node:22-alpine3.19 AS build

WORKDIR /app/frontend

# Install pnpm globally
RUN npm install -g pnpm

# Copy the package.json and pnpm-lock.yaml to install dependencies
COPY ./frontend/package.json ./frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy all the necessary files from the frontend directory into the container
COPY ./frontend ./

# Build the Next.js application
RUN pnpm next build

# Stage 2: Prepare the production image
FROM  build AS production

WORKDIR /app/frontend

# Install pnpm globally
RUN npm install -g pnpm

# Copy built files from the build stage
COPY --from=build --chown=nginx:nginx /app/frontend/.next ./.next

#expose port 3000
EXPOSE 3000

# Start the Next.js server (SSR and CSR)
CMD ["pnpm", "start"]