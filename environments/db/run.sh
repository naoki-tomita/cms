trap 'docker rm -fv cms' 2

docker build -t cms:latest .
docker run \
  --name cms \
  -e POSTGRES_USER=cms \
  -e POSTGRES_PASSWORD=cms \
  -p 8010:5432 \
  -d cms:latest
docker logs cms -f
