# Taekwon-do Ailingen Website (TKD-AI)

Official website for Taekwon-do Ailingen martial arts club. A static, mobile-first Angular application designed for easy maintenance and optimal performance.

## Project Overview

Modern, accessible website for the Taekwon-do Ailingen club, built with Angular to showcase club information, training schedules, events, and facilitate member communication.

### Core Values

- **Mobile-First**: Optimized for smartphones and tablets
- **Performance**: Fast loading on all connections (FCP <1.5s on 3G)
- **Accessibility**: WCAG 2.1 AA compliant
- **Maintainability**: Minimal dependencies, clear component architecture
- **Static-First**: Pre-rendered content for instant page loads

## Technology Stack

- **Framework**: Angular 18+ (LTS)
- **Language**: TypeScript 5.x
- **Styling**: CSS3 with Custom Properties
- **Deployment**: Static hosting (GitHub Pages / Netlify / Vercel)
- **Testing**: Jasmine/Jest + Playwright/Cypress

## Project Structure

```
src/
├── app/
│   ├── core/          # Singleton services, guards
│   ├── shared/        # Reusable components
│   ├── features/      # Feature modules
│   ├── pages/         # Routed pages
│   └── layouts/       # Layout components
├── assets/            # Images, translations, static data
└── styles/            # Global styles, variables
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Run E2E tests
npm run e2e
```

## Development Workflow

This project follows the [Speckit](https://github.com/specify/speckit) development methodology. All features are developed through:

1. **Specification** (`/speckit.specify`) - Define user stories and requirements
2. **Planning** (`/speckit.plan`) - Research and design
3. **Tasks** (`/speckit.tasks`) - Break down into actionable items
4. **Implementation** - Build following constitution principles

See [`.specify/memory/constitution.md`](.specify/memory/constitution.md) for project governance and core principles.

## Constitution Principles

All development must adhere to these [core principles](.specify/memory/constitution.md):

1. **Mobile-First Design** (NON-NEGOTIABLE)
2. **Minimal Dependencies**
3. **Component-First Architecture**
4. **Static-First Content Strategy**
5. **Accessibility & Inclusive Design**

## Performance Standards

- First Contentful Paint: <1.5s (3G)
- Time to Interactive: <3.5s (3G)
- JavaScript Bundle: <200KB (gzipped)
- Lighthouse Score: ≥90

## Browser Support

- Last 2 versions: Chrome, Firefox, Safari, Edge
- Mobile: iOS Safari 13+, Android Chrome 90+

## Contributing

1. Check existing specifications in `specs/` directory
2. Follow constitution principles
3. Create feature branch following naming convention
4. Submit PR with reference to specification

## License

[To be determined]

## Contact

Taekwon-do Ailingen  
[Club contact information]