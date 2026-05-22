# all the steps to build the Docker image

FROM node:22

# set the working directory in the container
WORKDIR /app 
# default is /, but we want to set it to /app

# copy the package.json and package-lock.json to the container
COPY package*.json ./

# install the dependencies in the container
RUN npm install

# copy the rest of the application code to the container
COPY . .

# expose the port that the application will run on
EXPOSE 3000

# start the application
CMD ["npm", "start"]
# CMD ["npm", "run", "dev"]