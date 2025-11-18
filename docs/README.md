# Djavacoal Documentation

Welcome to the Djavacoal project documentation! This directory contains comprehensive guides for developers and AI coding agents working with the codebase.

## 📚 Documentation Files

### [AI_AGENT_QUICK_START.md](./AI_AGENT_QUICK_START.md)
**Quick reference guide for AI coding agents**

Essential information to get started quickly:
- Project structure overview
- Common workflows and patterns
- Quick command reference
- Common pitfalls to avoid
- Decision trees for common tasks

👉 **Start here if you're an AI agent or new developer!**

---

### [FEATURES_OVERVIEW.md](./FEATURES_OVERVIEW.md)
**Comprehensive catalog of all application features**

Organized reference of all features:
- Dashboard features (admin)
- Visitor features (public)
- API features
- Feature matrix and dependencies
- Technology stack per feature
- Data flow diagrams

👉 **Use this to understand what features exist and how they relate.**

---

### [AGENTS_MD_GUIDE.md](./AGENTS_MD_GUIDE.md)
**Guidelines for writing and maintaining AGENTS.md files**

Documentation standards and templates:
- Required sections and structure
- Optional sections
- Writing style guidelines
- Code example patterns
- Maintenance procedures
- Quality checklist

👉 **Read this when creating or updating feature documentation.**

---

## 🎯 Documentation Convention

Every feature in `src/features/<feature-name>/` has its own `AGENTS.md` file that provides:

- **Overview** - What the feature does and why
- **Architecture** - Directory structure and organization
- **Technical Implementation** - RPC functions, schemas, database tables
- **Integration Points** - How it connects with other features
- **Usage Examples** - Real-world code examples
- **Best Practices** - Do's and don'ts for AI agents
- **Related Features** - Dependencies and relationships

### Example Feature Documentation

```
src/features/
├── dashboard-product/
│   ├── components/
│   ├── server/
│   ├── AGENTS.md          ← Comprehensive feature docs
│   └── index.ts
├── dashboard-news/
│   ├── components/
│   ├── server/
│   ├── AGENTS.md          ← Comprehensive feature docs
│   └── index.ts
└── public-api/
    ├── router.ts
    ├── AGENTS.md          ← Comprehensive feature docs
    └── index.ts
```

## 🚀 Quick Navigation

### For AI Agents
1. Start with [AI_AGENT_QUICK_START.md](./AI_AGENT_QUICK_START.md)
2. Browse [FEATURES_OVERVIEW.md](./FEATURES_OVERVIEW.md) to understand features
3. Read specific feature's `AGENTS.md` file when working with it
4. Refer to [AGENTS_MD_GUIDE.md](./AGENTS_MD_GUIDE.md) when documenting

### For New Developers
1. Read [AI_AGENT_QUICK_START.md](./AI_AGENT_QUICK_START.md) for project overview
2. Check [FEATURES_OVERVIEW.md](./FEATURES_OVERVIEW.md) to see all features
3. Review `.github/copilot-instructions.md` for complete project details
4. Dive into specific feature `AGENTS.md` files as needed

### For Documentation Maintainers
1. Follow [AGENTS_MD_GUIDE.md](./AGENTS_MD_GUIDE.md) template
2. Keep [FEATURES_OVERVIEW.md](./FEATURES_OVERVIEW.md) updated when adding features
3. Ensure all features have up-to-date `AGENTS.md` files
4. Update this README if adding new documentation files

## 📖 Additional Resources

### Project-Wide Documentation
- **`.github/copilot-instructions.md`** - Complete project architecture, patterns, and conventions
- **`README.md`** (root) - Project setup and getting started
- **`wrangler.jsonc`** - Cloudflare Workers configuration
- **`package.json`** - Scripts and dependencies

### Code Documentation
- **`src/adapters/`** - External service adapters (D1, R2, KV, Auth)
- **`src/features/*/AGENTS.md`** - Feature-specific documentation
- **`src/lib/`** - Shared utilities and helpers
- **`src/components/`** - Global component library

### External References
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Better Auth](https://www.better-auth.com/)
- [oRPC](https://orpc.unnoq.com/)
- [Mantine UI](https://mantine.dev/)
- [next-intl](https://next-intl-docs.vercel.app/)

## 🔄 Keeping Documentation Updated

Documentation should be updated when:
- ✅ Adding a new feature
- ✅ Modifying RPC functions
- ✅ Changing database schemas
- ✅ Updating integration patterns
- ✅ Fixing bugs that reveal missing docs
- ✅ Adding new dependencies

### Update Checklist
- [ ] Feature's `AGENTS.md` file updated
- [ ] `FEATURES_OVERVIEW.md` reflects new feature
- [ ] `.github/copilot-instructions.md` updated if architecture changed
- [ ] Code comments updated
- [ ] Examples tested and working
- [ ] Related features' docs updated

## 💡 Documentation Philosophy

Good documentation is:
- **Clear** - Easy to understand for AI agents and humans
- **Complete** - Covers all aspects of the feature
- **Current** - Always matches the actual code
- **Consistent** - Follows the same structure and style
- **Practical** - Includes real, working examples

Bad documentation is:
- ❌ Outdated or incorrect
- ❌ Missing critical information
- ❌ Inconsistent with codebase
- ❌ Too vague or abstract
- ❌ Lacks examples

## 🤝 Contributing

When contributing to documentation:
1. Follow the guidelines in [AGENTS_MD_GUIDE.md](./AGENTS_MD_GUIDE.md)
2. Test all code examples
3. Update related documentation
4. Keep style consistent
5. Review for clarity and completeness

## 📝 Documentation Standards

### File Naming
- Use `SCREAMING_SNAKE_CASE.md` for meta documentation
- Use `kebab-case.md` for specific guides
- Feature docs are always named `AGENTS.md`

### Markdown Style
- Use ATX-style headers (`#` not underlines)
- Include table of contents for long documents
- Use fenced code blocks with language tags
- Add emoji for visual navigation (sparingly)
- Link to related documentation

### Code Examples
- Always include language tag (```typescript)
- Show complete, runnable code
- Include necessary imports
- Add comments for complex logic
- Test before committing

## 🔗 Related Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| `.github/copilot-instructions.md` | Complete project guide | AI agents, all developers |
| `AI_AGENT_QUICK_START.md` | Quick reference | AI agents, new developers |
| `FEATURES_OVERVIEW.md` | Feature catalog | All developers |
| `AGENTS_MD_GUIDE.md` | Documentation standards | Documentation writers |
| `src/features/*/AGENTS.md` | Feature details | Feature developers |

## 📧 Questions?

If you find gaps in documentation or have suggestions:
1. Check if the feature's `AGENTS.md` has the answer
2. Review this docs folder
3. Check `.github/copilot-instructions.md`
4. Create an issue or PR with improvements

---

**Remember:** Documentation is code too. Keep it clean, tested, and up-to-date! 📚