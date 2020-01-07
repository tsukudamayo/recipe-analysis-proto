FROM node:10.16-alpine
ENV LANG ja_JP.UTF-8

RUN apk update \
  && apk add --no-cache git ca-certificates emacs fontconfig \
  && git clone https://github.com/tsukudamayo/dotfiles.git \
  && cp -r ./dotfiles/linux/.emacs.d ~/ \
  && cp -r ./dotfiles/.fonts /usr/share/fonts \
  && fc-cache -fv

RUN mkdir -p /app
WORKDIR /app

ADD package.json ./package.json
ADD yarn.lock ./yarn.lock
ADD public/ ./public/
ADD src/ ./src/

RUN yarn install
COPY . .
RUN chmod a+x /app/node_modules/.bin/react-scripts

EXPOSE 3000
CMD ["yarn", "start"]
