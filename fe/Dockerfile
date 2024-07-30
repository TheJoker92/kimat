# Stage 1: Build the Angular application
FROM node:18.13.0 AS build

WORKDIR /app

# Install Angular CLI
RUN npm install -g @angular/cli@17.0.0

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN ng build --configuration production

# Stage 2: Serve the Angular application with Nginx
FROM nginx:latest

# Copy the built Angular app from the previous stage
COPY --from=build /app/dist/fe/browser /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for the web server
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]