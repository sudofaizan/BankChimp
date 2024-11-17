FROM node:23-alpine3.19
COPY . .
EXPOSE 80
RUN cat cred.b64 |base64 -d >credentials.json
CMD node app.js