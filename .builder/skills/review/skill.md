# Code Review Skill

This document outlines the detailed steps for performing a thorough code review.

## Pre-Review Preparation

1. **Understand the Context**
   - Read the PR/commit description and linked issues
   - Understand the business requirements and user story
   - Review any design documents or technical specifications
   - Check the scope of changes (files modified, additions, deletions)

2. **Set Up Local Environment**
   - Pull the latest changes from the branch
   - Run `npm install` or equivalent to ensure dependencies are up to date
   - Verify the application builds without errors
   - Run the development server to test changes locally

## Code Review Checklist

### 1. Functionality & Logic

- [ ] Code accomplishes the stated requirements
- [ ] Edge cases are handled appropriately
- [ ] Business logic is correct and makes sense
- [ ] Error handling is comprehensive and appropriate
- [ ] No obvious bugs or logical errors
- [ ] Null/undefined checks are in place where needed
- [ ] API calls handle success and failure cases

### 2. Code Quality & Standards

- [ ] Code follows project conventions and style guide
- [ ] Variable and function names are descriptive and meaningful
- [ ] Code is DRY (Don't Repeat Yourself) - no unnecessary duplication
- [ ] Functions are small and focused (single responsibility)
- [ ] Complex logic is broken down into smaller, testable units
- [ ] No commented-out code or debug statements (console.log, debugger)
- [ ] Magic numbers/strings are replaced with named constants
- [ ] Code is readable and self-documenting

### 3. TypeScript/Type Safety

- [ ] No use of `any` type (unless absolutely necessary with justification)
- [ ] Props interfaces are properly defined
- [ ] Function return types are specified
- [ ] Type assertions are used sparingly and safely
- [ ] Generic types are used appropriately
- [ ] Null/undefined handling with proper type guards
- [ ] Enums or union types used for fixed sets of values

### 4. React Best Practices

- [ ] Components use functional components with hooks (no class components)
- [ ] Components are small and single-purpose (< 200 lines)
- [ ] State management is appropriate (local vs global)
- [ ] useEffect dependencies are correct and complete
- [ ] No unnecessary re-renders (proper use of useMemo/useCallback)
- [ ] Props are not mutated directly
- [ ] Keys are properly used in lists (not array indices unless static)
- [ ] Custom hooks follow naming convention (use prefix)
- [ ] Hooks are called in the correct order (top-level only)

### 5. Performance

- [ ] No unnecessary API calls or data fetching
- [ ] Expensive computations are memoized when appropriate
- [ ] Large lists use virtualization if needed
- [ ] Images are optimized and lazy-loaded where appropriate
- [ ] Bundle size impact is reasonable
- [ ] No memory leaks (cleanup in useEffect)

### 6. Security

- [ ] No hardcoded secrets or API keys
- [ ] User input is properly validated and sanitized
- [ ] XSS vulnerabilities are prevented
- [ ] Sensitive data is not logged
- [ ] HTTPS is used for external API calls
- [ ] Authentication/authorization checks are in place
- [ ] SQL injection risks are mitigated (if applicable)

### 7. Accessibility

- [ ] Semantic HTML elements are used appropriately
- [ ] ARIA attributes are used when necessary
- [ ] Keyboard navigation works correctly
- [ ] Focus management is handled properly
- [ ] Color contrast meets WCAG standards
- [ ] Alt text for images
- [ ] Form labels are associated with inputs

### 8. Testing

- [ ] Unit tests cover new functionality
- [ ] Edge cases are tested
- [ ] Tests are meaningful and not just for coverage
- [ ] Integration tests for critical flows
- [ ] All tests pass (`npm test` or equivalent)
- [ ] Mock data is realistic and comprehensive

### 9. Styling & UI

- [ ] UI matches design specifications
- [ ] Responsive design works on different screen sizes
- [ ] CSS variables are used instead of hardcoded values
- [ ] No inline styles (use classes)
- [ ] Class names are descriptive and meaningful
- [ ] Media queries maintain existing breakpoints
- [ ] Design system components are used consistently
- [ ] Styles don't leak or conflict with other components

### 10. Dependencies & Configuration

- [ ] New dependencies are necessary and well-maintained
- [ ] Package versions are compatible
- [ ] No unnecessary dependencies added
- [ ] Environment variables are documented
- [ ] Configuration changes are backward compatible

## Review Process

### 1. First Pass - High Level

- Skim through all changed files
- Understand the overall architecture and approach
- Identify major concerns or design issues
- Check if the solution aligns with project architecture

### 2. Detailed Review

- Review each file line by line
- Use the checklist above systematically
- Leave inline comments on specific lines
- Test the functionality locally
- Run the build process: `npm run check`
- Verify linting passes: `npm run lint`
- Run tests: `npm test`

### 3. Manual Testing

- Test the feature in the browser
- Try different user flows and scenarios
- Test on different screen sizes (responsive)
- Verify error states and edge cases
- Check console for errors or warnings
- Test keyboard navigation and accessibility

### 4. Provide Feedback

- **Critical Issues**: Must be fixed before merge
  - Security vulnerabilities
  - Breaking changes
  - Incorrect functionality
  - Data loss risks

- **Major Issues**: Should be fixed before merge
  - Performance problems
  - Accessibility violations
  - Code quality concerns
  - Missing error handling

- **Minor Issues**: Nice to have improvements
  - Code style inconsistencies
  - Naming suggestions
  - Refactoring opportunities
  - Documentation improvements

- **Suggestions**: Optional enhancements
  - Alternative approaches
  - Future optimizations
  - Learning resources

### 5. Feedback Best Practices

- Be constructive and respectful
- Explain the "why" behind suggestions
- Provide examples or code snippets when possible
- Acknowledge good work and improvements
- Ask questions if something is unclear
- Distinguish between blocking issues and suggestions
- Prioritize feedback (critical → nice-to-have)

## Automated Checks

Before completing the review, ensure these automated checks pass:

```bash
# Install dependencies
npm install

# Run linting
npm run lint

# Run type checking
tsc --noEmit

# Run tests
npm test

# Run build
npm run build

# Or use the combined check command if available
npm run check
```

## Final Approval Criteria

- [ ] All critical and major issues are resolved
- [ ] All automated checks pass
- [ ] Functionality works as expected
- [ ] Code quality meets project standards
- [ ] No security or performance concerns
- [ ] Tests provide adequate coverage
- [ ] Documentation is updated if needed

## Post-Review

- Monitor the PR for author responses
- Re-review after changes are made
- Approve when all concerns are addressed
- Consider leaving a summary comment highlighting key improvements or remaining considerations
