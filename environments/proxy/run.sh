trap 'docker kill proxy' 2

docker build -t proxy:latest .
docker run --rm -d --name proxy -p 80:80 proxy:latest

sleep 999999999
