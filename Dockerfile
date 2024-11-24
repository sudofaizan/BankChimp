FROM node:23-alpine3.19
COPY . .
EXPOSE 80
RUN cat cred.b64 |base64 -d >credentials.json
RUN npm install
# HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD curl http://localhost/health -f 
CMD [ "node","app.js" ]