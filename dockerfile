FROM node:16

ARG STAG
ENV STAG ${STAG}

# Install python/pip
ENV PYTHONUNBUFFERED=1

RUN apt-get update
RUN apt-get -y install g++ ffmpeg libfontconfig

WORKDIR /usr/app

COPY package.json .

RUN npm i --quiet

COPY . .

RUN mkdir uploads

RUN npm install pm2 -g

CMD ["pm2-runtime", "pm2.config.js"]
