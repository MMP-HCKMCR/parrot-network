# the image to use
FROM node:latest

# global install yarn package manager
RUN apt-get update && apt-get install -y curl apt-transport-https && \
    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install -y yarn

# create and copy source to the app directory
RUN mkdir -p /usr/src/app
COPY . /usr/src/app

# set the working directory to the app directory
WORKDIR /usr/src/app

# install npm modules
RUN npm config set loglevel warn
RUN npm config set ignore-scripts false
RUN yarn install

# expose the main port for node
EXPOSE 8080

# start the app
CMD ["npm", "start"]
