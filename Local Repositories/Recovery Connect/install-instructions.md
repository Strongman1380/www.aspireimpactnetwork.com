# Firebase NPM Installation Instructions

## Step 1: Install Firebase

Run the following command in your terminal while in the `/app/user_site/src` directory:

```bash
npm install firebase
```

This will:
- Create a `node_modules` folder with the Firebase SDK
- Update your `package.json` with the Firebase dependency
- Create a `package-lock.json` file

## Step 2: Choose Your Implementation

You have two options for using Firebase:

### Option A: Use CDN Version (Current Implementation)
- Continue using the current `firebase-example.html` file
- No changes needed - works with CDN links already included

### Option B: Use NPM Module Version (Recommended for Development)
- Use the updated files created for you:
  - `firebase-npm-example.html` - Uses bundled Firebase modules
  - `assets/js/firebase-npm.js` - Module-based Firebase utilities

## Step 3: Set Up Module Bundler (For NPM Version)

If you choose Option B, you'll need a module bundler to use the NPM version in the browser:

### Using Webpack:
```bash
npm install --save-dev webpack webpack-cli webpack-dev-server
```

### Using Vite (Recommended):
```bash
npm install --save-dev vite
```

Then update your `package.json` scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

## Step 4: Run Your Development Server

### For CDN Version:
```bash
npm run dev
```

### For NPM Version with Vite:
```bash
npm run dev
```

## File Structure After Installation

```
src/
├── node_modules/           # NPM packages (including Firebase)
├── package.json           # Project configuration
├── package-lock.json      # Dependency lock file
├── firebase-example.html  # CDN version (current)
├── firebase-npm-example.html  # NPM version (new)
├── assets/js/
│   ├── firebase-data.js   # CDN utilities (current)
│   └── firebase-npm.js    # NPM utilities (new)
└── ...other files
```

## Security Note

Make sure to add `node_modules/` to your `.gitignore` file:

```
node_modules/
package-lock.json
.env.local
```

## Next Steps

1. Run `npm install firebase` in your terminal
2. Choose between CDN or NPM implementation
3. If using NPM version, set up a bundler
4. Test your Firebase connection

The CDN version will continue to work without any changes. The NPM version provides better development experience and build optimization.