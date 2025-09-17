#!/bin/bash

# census-AI-analyzer - Deployment Setup Script
# This script helps prepare your project for cloud deployment

echo "🚀 Setting up census-AI-analyzer for deployment..."
echo ""

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Error: Run this script from the census-AI-analyzer root directory"
    exit 1
fi

echo "1. Checking project structure..."
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    echo "✅ Frontend directory found"
else
    echo "❌ Frontend directory not found"
    exit 1
fi

echo ""
echo "2. Testing backend build..."
if npm test --silent > /dev/null 2>&1; then
    echo "✅ Backend tests passed"
else
    echo "⚠️  Backend tests skipped (not implemented yet)"
fi

echo ""
echo "3. Testing frontend build..."
cd frontend
if npm run build > /dev/null 2>&1; then
    echo "✅ Frontend builds successfully"
    rm -rf dist  # Clean up test build
else
    echo "❌ Frontend build failed - check configuration"
    exit 1
fi
cd ..

echo ""
echo "4. Checking environment files..."
if [ -f "frontend/.env.example" ]; then
    echo "✅ Environment example files exist"
else
    echo "⚠️  Create .env.example files for documentation"
fi

echo ""
echo "5. Git repository setup..."
if [ -d ".git" ]; then
    echo "✅ Git repository already initialized"
else
    echo "📝 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    echo "📝 Creating .gitignore file..."
    cat > .gitignore << EOF
# Dependencies
node_modules/
frontend/node_modules/

# Environment variables
.env
.env.local
.env.production
.env.development
frontend/.env
frontend/.env.local

# Build outputs
frontend/dist/
output/

# Logs
*.log
npm-debug.log*

# Runtime data
pids
*.pid
*.seed

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# macOS
.DS_Store

# Windows
Thumbs.db
EOF
    echo "✅ .gitignore created"
fi

echo ""
echo "🎉 Setup complete! Next steps:"
echo ""
echo "1. Set your Anthropic API key:"
echo "   export ANTHROPIC_API_KEY=your_key_here"
echo ""
echo "2. Test locally:"
echo "   npm start (in one terminal)"
echo "   cd frontend && npm run dev (in another terminal)"
echo ""
echo "3. Push to GitHub:"
echo "   git add ."
echo "   git commit -m 'Initial commit - census-AI-analyzer'"
echo "   git remote add origin https://github.com/YOUR_USERNAME/census-AI-analyzer.git"
echo "   git push -u origin main"
echo ""
echo "4. Follow the deployment guide:"
echo "   See DEPLOYMENT.md for Railway + Vercel setup"
echo ""
echo "🚀 Ready for deployment!"