# Defining Source Image
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json into the container
COPY ["package.json", "package-lock.json*", "./"]

# Install Node.js dependencies
RUN npm install --production --silent && mv node_modules ../

# Copy the rest of the application code
COPY . .

# Expose the port your Node.js application listens on
EXPOSE 3000

ENV PORT=3000
# Start the Node.js application
CMD ["npm", "start"]