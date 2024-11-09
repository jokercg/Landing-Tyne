FROM node:18 AS build

ENV PORT=$PORT

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build --configuration=production --omit=dev

FROM nginx:alpine
EXPOSE $PORT
COPY --from=build /app/dist/tyne-v2/browser /usr/share/nginx/html

COPY ./nginx.config /etc/nginx/nginx.template
COPY ./nginx.config /etc/nginx/conf.d/default.conf

CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
