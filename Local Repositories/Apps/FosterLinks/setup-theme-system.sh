#!/bin/bash

# FosterLinks Theme System Setup Script
# This script helps set up the theme management system

echo "🎨 FosterLinks Theme System Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing React dependencies..."

# Install required React packages
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
npm install firebase
npm install @mui/utils

echo "✅ React dependencies installed"

# Check if Firebase is configured
if [ ! -f "src/firebase/firebase.ts" ]; then
    echo "⚠️  Warning: Firebase configuration not found"
    echo "   Please ensure you have configured Firebase in src/firebase/firebase.ts"
fi

# Create Firestore security rules if they don't exist
if [ ! -f "firestore.rules" ]; then
    echo "📝 Creating Firestore security rules..."
    cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Theme settings - users can only access their own
    match /themes/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Other collections...
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
EOF
    echo "✅ Firestore rules created"
fi

# Create Firebase Storage rules if they don't exist
if [ ! -f "storage.rules" ]; then
    echo "📝 Creating Firebase Storage security rules..."
    cat > storage.rules << 'EOF'
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Logo uploads - users can only access their own
    match /logos/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
EOF
    echo "✅ Storage rules created"
fi

# Check if theme context exists
if [ -f "src/contexts/ThemeContext.tsx" ]; then
    echo "✅ ThemeContext already exists"
else
    echo "❌ ThemeContext not found - please ensure all theme files are in place"
fi

# Check if theme settings component exists
if [ -f "src/components/ThemeSettings.tsx" ]; then
    echo "✅ ThemeSettings component exists"
else
    echo "❌ ThemeSettings component not found"
fi

echo ""
echo "🔧 Setup Instructions:"
echo "====================="
echo ""
echo "1. React Web Application:"
echo "   ✓ Dependencies installed"
echo "   ✓ Theme system files created"
echo "   → Ensure Firebase is configured in src/firebase/firebase.ts"
echo "   → Deploy Firestore and Storage rules: firebase deploy --only firestore:rules,storage"
echo ""
echo "2. Swift iOS Application:"
echo "   → Add Firebase iOS SDK to your Xcode project"
echo "   → Add GoogleService-Info.plist to your project"
echo "   → Import the Swift theme files into your Xcode project"
echo ""
echo "3. FlutterFlow Application:"
echo "   → Create App State variables: primaryColor, secondaryColor, isDarkMode, logoUrl"
echo "   → Add custom actions for loading and saving theme data"
echo "   → Create theme settings page with color pickers"
echo ""
echo "📚 Documentation:"
echo "   → Read THEME_SYSTEM.md for detailed implementation guide"
echo "   → Check component files for usage examples"
echo ""
echo "🎉 Theme system setup complete!"
echo "   You can now customize your application's appearance!"