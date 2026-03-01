# Contributing to Linxy

Thank you for your interest in contributing to Linxy - The Digital Bridge!

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Set up the development environment (see README.md)

## Development Setup

### Backend (Python/FastAPI)
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Frontend (Next.js/TypeScript)
```bash
cd frontend
npm install
npm run dev
```

## Code Style

### Python
- Use strict type hints on all functions
- Format with `ruff format .`
- Lint with `ruff check . --fix`
- Type check with `mypy .`

### TypeScript
- Use explicit interfaces/types (avoid `any`)
- Follow existing component patterns
- Run `npm run lint` before committing

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes with clear commit messages
3. Run linting and type checks
4. Push to your fork and open a PR
5. Ensure CI passes (if configured)

## Reporting Issues

- Use GitHub Issues for bug reports and feature requests
- Include steps to reproduce for bugs
- Check existing issues before creating new ones

## Questions?

Open a GitHub Discussion or Issue for questions about the codebase.
