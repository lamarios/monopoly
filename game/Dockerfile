FROM node AS build

RUN mkdir /src

ADD . /src/
WORKDIR /src/client
RUN  npm install && npm run build

WORKDIR /src
RUN npm install



FROM node:alpine
RUN mkdir /app
WORKDIR /app
COPY --from=build /src/static /app/static
COPY --from=build /src/node_modules /app/node_modules
COPY --from=build /src/server /app/server
COPY --from=build /src/package.json /app/
COPY --from=build /src/package-lock.json /app/
COPY --from=build /src/key.pem /app/
COPY --from=build /src/cert.pem /app
RUN ls /app

CMD npm start
