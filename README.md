# LeFlux - Language Learning PWA

LeFlux is a Progressive Web App (PWA) designed for language learning through video content and interactive study tools.

## Features

- 📹 Video Study Room with YouTube integration
- 📚 Personal library management
- 📝 Vocabulary tracking and review
- 🎯 Spaced repetition review system
- 🌙 Dark mode support
- 📱 Progressive Web App (installable on mobile and desktop)
- 💾 Offline support with IndexedDB

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/netojmateus-droid/learnleflux.git
cd learnleflux
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open in your browser at [http://localhost:3000](http://localhost:3000).

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Runs the test suite
- `npm run eject` - Ejects from Create React App (one-way operation)

## Deployment

The application can be deployed to various platforms. See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:

- GitHub Pages (with automated deployment)
- Vercel
- Netlify
- Firebase Hosting
- And more...

### Quick Deploy

The easiest way to deploy is to push to the `main` branch, which will automatically trigger deployment to GitHub Pages via GitHub Actions.

## Technology Stack

- **React** - UI library
- **Tailwind CSS** - Styling
- **IndexedDB** (via idb) - Offline data storage
- **React Player** - Video playback
- **Create React App** - Build tooling

## Project Structure

```
learnleflux/
├── public/          # Static files
├── src/
│   ├── components/  # Reusable UI components
│   ├── context/     # Global state management
│   ├── db/          # IndexedDB utilities
│   ├── pages/       # Page components
│   ├── App.js       # Main app component
│   └── index.js     # App entry point
├── .github/
│   └── workflows/   # CI/CD workflows
└── build/           # Production build (generated)
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

## Support

For issues and questions, please use the [GitHub Issues](https://github.com/netojmateus-droid/learnleflux/issues) page.