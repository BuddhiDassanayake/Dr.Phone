#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1

echo "===== STARTING SERVER SETUP ====="

# Update system
sudo apt-get update -y

# Install required packages
sudo apt-get install -y \
  openjdk-11-jdk \
  docker.io \
  docker-compose-v2 \
  git \
  curl

# Enable Docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Wait for Docker
until docker info; do
  echo "Waiting for Docker..."
  sleep 5
done

echo "===== INSTALLING JENKINS ====="

# Jenkins repo
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2026.key | sudo tee /etc/apt/keyrings/jenkins-keyring.asc > /dev/null

echo "deb [signed-by=/etc/apt/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/" | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update -y
sudo apt-get install -y jenkins

# Start Jenkins
sudo systemctl enable jenkins
sudo systemctl start jenkins

echo "===== CLONING APPLICATION ====="

# Clone project
git clone https://github.com/BuddhiDassanayake/Dr.Phone.git /home/ubuntu/app
cd /home/ubuntu/app

# Create docker-compose file
cat <<EOF > docker-compose.yml
services:
  backend:
    build: ./backend
    container_name: drphone_backend
    restart: unless-stopped
    volumes:
      - ./backend/data:/app/data
    environment:
      - NODE_ENV=production
    ports:
      - "3000:3000"

  frontend:
    build: ./frontend
    container_name: drphone_frontend
    restart: unless-stopped
    depends_on:
      - backend
    ports:
      - "80:5173"
EOF

# Run app
sudo docker compose up -d --build

echo "===== SETUP COMPLETE ====="
