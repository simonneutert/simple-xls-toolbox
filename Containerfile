FROM denoland/deno:latest AS builder

WORKDIR /app

COPY . .

RUN deno install --allow-import

RUN deno compile --allow-all \
    --exclude test \
    --exclude ai_logo.jpg \
    --exclude .github \
    --exclude .git \
    --exclude .vscode \
    --output dist/simple-xls-toolbox \
    main.ts

RUN chmod +x dist/simple-xls-toolbox

FROM gcr.io/distroless/nodejs22-debian12

COPY --from=builder /app/dist/simple-xls-toolbox /app/simple-xls-toolbox

WORKDIR /app

ENTRYPOINT ["./simple-xls-toolbox"]

CMD ["--help"]
