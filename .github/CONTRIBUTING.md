# Contributing to Flight Price Tracker

Thank you for your interest in contributing! Here's how you can help.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/flight-price-tracker.git`
3. Create a feature branch: `git checkout -b feature/your-feature-name`
4. Install dependencies: `npm install && cd backend && npm install && cd ..`
5. Make your changes
6. Test thoroughly
7. Submit a pull request

## Development Workflow

### Local Setup
```bash
npm install
cd backend && npm install && cd ..
cp .env.example .env
# Fill in .env with test credentials
```

### Running Development
```bash
# Terminal 1: Backend
npm run dev:backend

# Terminal 2: Extension
npm run watch:extension

# Terminal 3: Load in Chrome
# chrome://extensions → Load unpacked → select dist/
```

### Code Style

- Use TypeScript for type safety
- Follow existing code conventions
- Use Tailwind CSS for styling
- No console.log in production code
- Meaningful commit messages

### Testing

Before submitting a PR:
1. Test the feature locally
2. Check browser console (no errors)
3. Test on multiple browsers if possible
4. Verify database updates correctly
5. Test on both free and pro tiers

## Feature Requests

Have an idea? Open an issue with:
- Clear description of the feature
- Why it's useful
- Any mockups or examples
- Which tier it belongs to (free/pro)

## Bug Reports

Found a bug? Open an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Browser/OS version

## Pull Request Process

1. Update the README if adding features
2. Update DEPLOYMENT.md if changing deployment
3. Add tests if applicable
4. Ensure no TypeScript errors
5. Write a clear PR description
6. Link related issues

## Code Review

Your PR will be reviewed for:
- Code quality and style
- Test coverage
- Documentation
- Breaking changes
- Security issues

## Reporting Security Issues

Found a security vulnerability? Please don't open a public issue.
Email support@flightpricetracker.com with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Questions?

Open an issue or contact support@flightpricetracker.com

Thank you for contributing! 🚀
