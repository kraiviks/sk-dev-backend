# Use Node.js 20 Alpine as the base image
FROM node:20-alpine

WORKDIR /app

# Copy only package.json and yarn.lock for caching dependencies
COPY package*.json yarn.lock ./

# Copy Prisma schema
COPY prisma ./prisma

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy all the code after the dependencies have been installed
COPY . .

# Expose the necessary port
EXPOSE 3001

# Command for local development
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed && yarn start:dev"]
