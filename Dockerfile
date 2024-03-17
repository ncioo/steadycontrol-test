FROM node:latest

WORKDIR /app
EXPOSE 4000
COPY . .
RUN npm install
CMD ["node", "."]