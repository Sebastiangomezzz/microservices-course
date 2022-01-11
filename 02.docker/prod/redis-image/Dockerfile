# Usar una imagen existente como base
FROM alpine
# Descargar y instalar una dependencia
RUN apk add --update redis
# Decir a la imagen qué hacer cuando empieza como contenedor
CMD ["redis-server"]