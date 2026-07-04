#!/bin/bash

echo "🔧 Setting up THREATWEAVE environment..."

# Check for .env file
if [ ! -f .env ]; then
  echo "⚠️ .env file not found. Creating from .env.example..."
  cp .env.example .env
fi

# Prompt for Clerk keys
read -p "Enter Clerk Publishable Key (optional, press enter to skip): " clerk_pub_key
read -p "Enter Clerk Secret Key (optional, press enter to skip): " clerk_secret_key

# Prompt for OSINT API keys
read -p "Enter Shodan API Key (optional): " shodan_key
read -p "Enter VirusTotal API Key (optional): " virustotal_key
read -p "Enter AbuseIPDB API Key (optional): " abuseipdb_key
read -p "Enter GreyNoise API Key (optional): " greynoise_key
read -p "Enter GitHub Token (optional): " github_token

# Update .env file
if [ ! -z "$clerk_pub_key" ]; then
  sed -i "s/VITE_CLERK_PUBLISHABLE_KEY=.*/VITE_CLERK_PUBLISHABLE_KEY=$clerk_pub_key/" .env
fi
if [ ! -z "$clerk_secret_key" ]; then
  sed -i "s/CLERK_SECRET_KEY=.*/CLERK_SECRET_KEY=$clerk_secret_key/" .env
fi
if [ ! -z "$shodan_key" ]; then
  sed -i "s/SHODAN_API_KEY=.*/SHODAN_API_KEY=$shodan_key/" .env
fi
if [ ! -z "$virustotal_key" ]; then
  sed -i "s/VIRUSTOTAL_API_KEY=.*/VIRUSTOTAL_API_KEY=$virustotal_key/" .env
fi
if [ ! -z "$abuseipdb_key" ]; then
  sed -i "s/ABUSEIPDB_API_KEY=.*/ABUSEIPDB_API_KEY=$abuseipdb_key/" .env
fi
if [ ! -z "$greynoise_key" ]; then
  sed -i "s/GREYNOISE_API_KEY=.*/GREYNOISE_API_KEY=$greynoise_key/" .env
fi
if [ ! -z "$github_token" ]; then
  sed -i "s/GITHUB_TOKEN=.*/GITHUB_TOKEN=$github_token/" .env
fi

echo "✅ Environment setup complete!"
echo "Run 'npm run dev' to start the application."
