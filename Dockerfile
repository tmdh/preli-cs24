# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=21.6.1

FROM node:${NODE_VERSION}-alpine as base
EXPOSE 8000

ENV HOME=/home/app

COPY . $HOME/node_docker

WORKDIR $HOME/node_docker

RUN npm install --silent --progress=false --include=dev

CMD ["npm", "run", "dev"]