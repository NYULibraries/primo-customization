FROM node:16.17.0-bullseye

ENV TOP_LEVEL_NODE_MODULES_PATH /app/
ENV PRIMO_EXPLORE_DEVENV_NODE_MODULES_PATH /app/primo-explore-devenv/

WORKDIR /app

COPY primo-explore-devenv/package.json primo-explore-devenv/yarn.lock /tmp/
RUN cd /tmp/ && yarn install --frozen-lockfile \
  && mkdir -p ${PRIMO_EXPLORE_DEVENV_NODE_MODULES_PATH} \
  && cd ${PRIMO_EXPLORE_DEVENV_NODE_MODULES_PATH} \
  && cp -R /tmp/node_modules ${PRIMO_EXPLORE_DEVENV_NODE_MODULES_PATH} \
  && rm -r /tmp/* && yarn cache clean

COPY package.json yarn.lock /tmp/
RUN cd /tmp/ && yarn install --frozen-lockfile \
  && mkdir -p ${TOP_LEVEL_NODE_MODULES_PATH} \
  && cd ${TOP_LEVEL_NODE_MODULES_PATH} \
  && cp -R /tmp/node_modules ${TOP_LEVEL_NODE_MODULES_PATH} \
  && rm -r /tmp/* && yarn cache clean

COPY bookmarklets ./bookmarklets
COPY custom ./custom
COPY scripts ./scripts
COPY tools ./tools
COPY tmp ./tmp

COPY .eslintrc.cjs .
COPY eslint.config.js .
COPY package.json .

COPY primo-explore-devenv/addons ./primo-explore-devenv/addons
COPY primo-explore-devenv/app.css ./primo-explore-devenv/app.css
COPY primo-explore-devenv/colors.json ./primo-explore-devenv/colors.json
COPY primo-explore-devenv/gulp ./primo-explore-devenv/gulp
COPY primo-explore-devenv/gulpfile.js ./primo-explore-devenv/gulpfile.js
COPY primo-explore-devenv/help_files ./primo-explore-devenv/help_files
COPY primo-explore-devenv/images ./primo-explore-devenv/images
COPY primo-explore-devenv/package.json ./primo-explore-devenv/package.json
COPY primo-explore-devenv/packages ./primo-explore-devenv/packages
COPY primo-explore-devenv/parse_css.js ./primo-explore-devenv/parse_css.js
COPY primo-explore-devenv/primo-explore ./primo-explore-devenv/primo-explore
COPY primo-explore-devenv/tests ./primo-explore-devenv/tests

EXPOSE 8003

CMD ["sh", "-c", "yarn primo-explore-devenv:run $VIEW"]
