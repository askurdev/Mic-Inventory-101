# Use a specific Node.js version
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy only the package.json and yarn.lock files first to leverage Docker cache
COPY package.json yarn.lock ./

# Cache Node modules
RUN yarn install --frozen-lockfile

# Install TypeScript globally
RUN yarn global add typescript

# Copy the rest of the application code to the working directory
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Run the Yarn build script (adjust this based on your project's structure)
RUN yarn build

# Expose the port your app is running on
EXPOSE 3006

# Set environment variables
ARG PRODUCT_DATABASE_URL
ARG INVENTORY_SERVICE_URL
ENV PRODUCT_DATABASE_URL=$PRODUCT_DATABASE_URL
ENV INVENTORY_SERVICE_URL=$INVENTORY_SERVICE_URL

# Command to run your application in production mode
CMD ["yarn", "start"]