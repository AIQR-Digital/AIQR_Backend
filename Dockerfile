# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV production
ENV PORT 3000
ENV SALT 10
ENV CONTACTS 1234567890,1234567899
ENV DATABASE mongodb+srv://<USERNAME>:<PASSWORD>@cluster0.oewz9xn.mongodb.net/<DATABASE_NAME>?retryWrites=true&w=majority
ENV DATABASE_USERNAME mohammedshafi1010
ENV DATABASE_PASSWORD Shafi2001
ENV DATABASE_NAME DEVELOPMENT

WORKDIR /src/app

COPY package*.json ./

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN npm install

#RUN #--mount=type=bind,source=package.json,target=package.json \
##    --mount=type=bind,source=package-lock.json,target=package-lock.json \
##    --mount=type=cache,target=/root/.npm \
##    npm ci --omit=dev

# Run the application as a non-root user.
#USER node:wq

# Copy the rest of the source files into the image.
COPY . .

# Expose the port that the application listens on.
EXPOSE 3000

# Run the application.
CMD npm start
