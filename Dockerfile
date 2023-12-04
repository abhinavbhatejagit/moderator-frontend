# Use an official Node.js runtime as a parent image
FROM node:18-alpine3.17

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle your app source
COPY . .

# Expose the port your app runs on
EXPOSE 80
# Define the command to run your app
CMD ["npm", "run", "dev"]