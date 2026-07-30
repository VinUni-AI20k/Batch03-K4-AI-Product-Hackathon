"""CLI entrypoint for the lecture ingestion pipeline.

Next implementation step:
1. extract PDF pages and transcript sections;
2. normalize metadata;
3. chunk content;
4. create embeddings;
5. persist the configured search index.
"""


def main() -> None:
    print("Ingestion skeleton ready; configure extraction and providers next.")


if __name__ == "__main__":
    main()
