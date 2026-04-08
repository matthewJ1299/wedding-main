#!/bin/bash

# Wedding Application Production Build Script for cPanel Deployment
# This script prepares both frontend and backend for production deployment

echo "🚀 Starting production build for cPanel deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in the right directory
if [ ! -d "Wedding" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Create deployment directories
echo "📁 Creating deployment directories..."
mkdir -p deployment/frontend
mkdir -p deployment/backend

# Build Frontend
echo "🔨 Building frontend for production..."
cd Wedding/frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    npm install
fi

# Build with production environment variables
print_status "Building frontend with production URLs..."
GENERATE_SOURCEMAP=false \
REACT_APP_API_URL=https://api.matthewandsydney.co.za \
REACT_APP_SITE_URL=https://matthewandsydney.co.za \
npm run build

if [ $? -eq 0 ]; then
    print_status "Frontend build completed successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Copy frontend build files
echo "📦 Copying frontend build files..."
cp -r build/* ../../deployment/frontend/
cp .htaccess ../../deployment/frontend/

cd ../..

# Prepare Backend (Next.js must be built locally; .next is required on the server)
echo "🔨 Preparing backend for production..."
rm -rf deployment/backend
mkdir -p deployment/backend

cd Wedding/backend

if [ ! -d "node_modules" ]; then
    print_warning "Installing backend dependencies..."
    npm install
fi

print_status "Building backend (Next.js production)..."
NODE_ENV=production npm run build

if [ $? -ne 0 ]; then
    print_error "Backend build failed"
    exit 1
fi

print_status "Backend build completed successfully"

# Copy backend files (includes .next — do not strip it for FTP deployment)
echo "📦 Copying backend files to deployment/backend..."
cp -r . ../../deployment/backend/

# Drop node_modules from the deployment copy only; reinstall on the server with npm ci --omit=dev
cd ../../deployment/backend
rm -rf node_modules
rm -rf build

# Copy environment file
if [ -f "env.production.txt" ]; then
    cp env.production.txt .env
    print_status "Environment file copied to .env"
else
    print_warning "No env.production.txt found, you'll need to create .env manually"
fi

cd ../..

# Create deployment package
echo "📦 Creating deployment package..."
tar -czf wedding-deployment-$(date +%Y%m%d-%H%M%S).tar.gz deployment/

print_status "Deployment package created: wedding-deployment-$(date +%Y%m%d-%H%M%S).tar.gz"

echo ""
echo "🎉 Production build completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Upload the contents of 'deployment/frontend/' to your frontend domain's public_html"
echo "2. Upload the contents of 'deployment/backend/' to your backend domain's public_html"
echo "   (must include the .next folder from the local build)"
echo "3. On the server: cd to the app folder, run: npm ci --omit=dev  (or npm install --omit=dev)"
echo "4. Set up Node.js application in cPanel for the backend"
echo "5. Configure environment variables in the backend .env file"
echo "6. Test the deployment using the URLs:"
echo "   - Frontend: https://matthewandsydney.co.za"
echo "   - Backend: https://api.matthewandsydney.co.za/health"
echo ""
echo "📖 See CPANEL_DEPLOYMENT.md for detailed deployment instructions"
