# Build stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet restore
RUN dotnet publish -c Release -o /app

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .

# Set default port (Cloud Run will override this)
ENV PORT=8181

# Expose port for documentation (not strictly required)
EXPOSE $PORT

ENTRYPOINT ["dotnet", "FleckWebsockets.dll"]