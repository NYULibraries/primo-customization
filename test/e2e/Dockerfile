FROM mcr.microsoft.com/playwright:v1.37.0-jammy AS builder

ENV CONTAINER_MODE true

WORKDIR /e2e

COPY test/e2e/package.json test/e2e/yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile \
    && yarn cache clean \
    # Install only the Chromium browser, as it is the only browser needed for the project:
    # Reduce build time and size: no need to install other browser binaries, reduces the size of the image.
    && npx playwright install chromium

ENV PATH /e2e/node_modules/.bin:$PATH

# Copy over remaining e2e files
COPY test/e2e/ .

FROM node:18-slim

RUN apt-get update -y && apt-get install -y curl

WORKDIR /e2e

# Install Chromium dependencies using the Playwright CLI
# Separation of concerns: The build stage is primarily focused on building and preparing the application,
# including installing dependencies required for the application to run.
# Installing Chromium dependencies in the production stage ensures that only the necessary dependencies
# for running the application are included in the final image, reducing the overall image size
RUN npx playwright install-deps chromium

# Copy dependencies and the app
COPY --from=builder /e2e .

# Copy the browser binaries
# https://github.com/microsoft/playwright/blob/1f209204cd18bce7d1bfae50f5af105dec752df8/utils/docker/Dockerfile.focal#L33
COPY --from=builder /ms-playwright /ms-playwright

# Set the PLAYWRIGHT_BROWSERS_PATH environment variable to tell Playwright where to look for the browser binaries
# https://github.com/microsoft/playwright/blob/1f209204cd18bce7d1bfae50f5af105dec752df8/utils/docker/Dockerfile.focal#L24
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# Entrypoint ensures $PLAYWRIGHT_BASE_URL has started
ENTRYPOINT [ "./docker-entrypoint.sh" ]

# Run playwright tests
CMD ["yarn", "test:e2e"]
