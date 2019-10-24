# -----------------------
# 1. Build Image 
FROM golang:1.11-stretch AS builder

RUN mkdir -p /go/app
RUN go get github.com/labstack/echo \
           github.com/labstack/echo/middleware
WORKDIR /go/app
COPY server.go ./server.go

RUN GOOS=linux CGO_ENABLED=0 go build -o server server.go

# ------------------------
# 2. Production Image

FROM node:10.16-alpine

RUN mkdir -p /go/app
WORKDIR /go/app

ADD package.json ./package.json
ADD yarn.lock ./yarn.lock
ADD public/ ./public/
ADD src/ ./src/

RUN yarn install
COPY . .
RUN chmod a+x /go/app/node_modules/.bin/react-scripts
RUN yarn build

COPY --from=builder /go/app/server .

EXPOSE 8080
ENTRYPOINT ["/go/app/server"]
