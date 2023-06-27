FROM node:16.17.0-bullseye

ENV NODE_MODULES_PATH /app/primo-explore-devenv/

WORKDIR /app

COPY custom ./custom
COPY package.json .

COPY primo-explore-devenv/package.json primo-explore-devenv/yarn.lock /tmp/
RUN cd /tmp/ && yarn install --frozen-lockfile \
  && mkdir -p ${NODE_MODULES_PATH} \
  && cd ${NODE_MODULES_PATH} \
  && cp -R /tmp/node_modules ${NODE_MODULES_PATH} \
  && rm -r /tmp/* && yarn cache clean

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

CMD ["yarn", "primo-explore-devenv:run"]
