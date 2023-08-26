# THIS IS JUST A PLACEHOLDER DOCKERFILE.  WE DO NOT HAVE A DOCKER COMPOSE SERVICE
# FOR E2E TESTS YET, AND THE TESTS BEING HTML GOLDEN FILE BASED  ARE NOT YET
# VIABLE DUE TO THE INSTABILITY OF PRIMO VE HTML.

FROM mcr.microsoft.com/playwright:v1.27.1-focal

WORKDIR /e2e

COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

RUN npx playwright install

# Copy over remaining e2e files
COPY . .

# Entrypoint ensures $PLAYWRIGHT_BASE_URL has started
ENTRYPOINT [ "./docker-entrypoint.sh" ]

# Run playwright tests
CMD ["yarn", "test:e2e:dev"]
