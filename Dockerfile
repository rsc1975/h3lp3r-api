FROM dvlprtech/bun:canary

RUN mkdir /app
WORKDIR /app

COPY src/ ./src/
COPY package.json ./
RUN bun install

ENV QUIET ""
ENV PORT 3003
ENV HOST 0.0.0.0
EXPOSE $PORT

RUN echo -e '#!/bin/sh\n\
set -e\n\
if [ "${1#-}" != "${1}" ] || [ -z "$(command -v "${1}")" ]; then\n\
  set -- bun run src/index.ts "$@"\n\
fi\n\
exec "$@"\n ' > /entrypoint.sh
RUN chmod +x /entrypoint.sh 

ENTRYPOINT [ "/entrypoint.sh" ]
