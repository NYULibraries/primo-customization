FROM mcr.microsoft.com/playwright:v1.37.0-jammy

ENV IN_CONTAINER true

WORKDIR /e2e

COPY test/e2e/package.json test/e2e/yarn.lock ./

# Install dependencies
RUN yarn install

RUN npx playwright install

# Copy over remaining e2e files
COPY test/e2e/ .

# Entrypoint ensures $PLAYWRIGHT_BASE_URL has started
ENTRYPOINT [ "./docker-entrypoint.sh" ]

# Run playwright tests
CMD ["yarn", "test:e2e"]
