FROM node:18-slim

ENV IN_CONTAINER true
ENV INSTALL_PATH /app

COPY test/unit/package.json test/unit/yarn.lock /tmp/

RUN cd /tmp && yarn install --frozen-lockfile \
  && mkdir -p ${INSTALL_PATH} \
  && cd ${INSTALL_PATH} \
  && cp -R /tmp/node_modules ${INSTALL_PATH} \
  && rm -r /tmp/* && yarn cache clean

WORKDIR ${INSTALL_PATH}

COPY test/unit/ .
COPY custom/00_common/js/01-config-helpers.js .

# Run playwright tests
CMD ["yarn", "test:unit"]

