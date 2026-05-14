Act as a senior UX/UI designer, front-end developer, and product designer specialized in premium but accessible digital interfaces.

The latest overhaul is much better, especially the card interaction where users can click a dish/card and see more information. Keep that direction. However, the current menu page still feels too cluttered and has too many visible buttons, options, and competing UI elements.

Your task is to redesign and simplify the menu interface so it feels more minimalistic, elegant, aesthetic, and easier to use while preserving the existing functionality.

---

## Reference Website

Use this website mainly as a **style and interaction reference**:

```txt
https://www.gucciosteria.com/en/florence/menu/a-la-carte/
```

Study how this website handles:

* Menu layout.
* Spacing.
* Typography.
* Visual hierarchy.
* Elegant minimalism.
* Dish presentation.
* Navigation between menu categories.
* Reduced visual clutter.
* Premium editorial feeling.

Important: do **not** copy the Gucci Osteria website directly. Use it as inspiration for a more refined, universal, and adaptable restaurant menu experience.

The reference site feels very premium and high-end. Our website should keep some of that elegance, but it must be more universal and suitable for different types of restaurants and customers, not only luxury/high-paying customers.

---

## Main Goal

Make the menu interface:

* More minimalistic.
* More elegant.
* Less cluttered.
* More universal.
* Easier to scan.
* More visually balanced.
* More focused on the dishes and menu content.
* Still customizable for different restaurant styles.
* Consistent with the current app design system.

The user should be able to open the menu page and immediately understand the restaurant menu without being overwhelmed by buttons, filters, and competing actions.

---

## Current Problems to Fix

### 1. Too Many Buttons

The current menu page has too many visible buttons and actions. This makes the interface feel busy.

Examples of actions that currently feel redundant or too prominent:

* Ask.
* Search.
* Get recommendations.
* Signature dishes.
* Traditional menu.
* Printed menu.
* Photo cards.

Some of these actions overlap or belong in a secondary menu instead of being displayed as primary buttons.

### 2. Redundant Actions

Some options appear to do similar things.

For example:

* “Ask”
* “Search”
* “Get recommendations”

These should not all appear as equally important buttons. Combine, simplify, or reorganize them into a cleaner interaction model.

### 3. Cluttered Section

The section shown in the provided screenshot feels overloaded with information and controls.

Simplify this section so it has fewer visible controls and more breathing room.

### 4. Visual Hierarchy Needs Improvement

The menu content should be the focus. Secondary actions should support the experience without competing with the food categories, dish cards, and dish details.

---

## Design Direction

Create a cleaner, more editorial menu experience inspired by premium restaurant websites, but adapted to a more universal product.

### Preferred Style

* Minimalistic.
* Elegant.
* Spacious.
* Slightly premium.
* Clear and universal.
* Customizable.
* Easy to scan.
* Not overly luxurious or exclusive.
* Not overloaded with controls.

### Layout Direction

Use a simpler page structure, such as:

1. Restaurant/menu header.
2. Minimal category navigation.
3. Dish cards or menu list.
4. Optional view toggle.
5. Dish detail panel/modal/card interaction.
6. Secondary tools hidden in a compact icon-only toolbar or overflow menu.

---

## Specific UI Improvements

### 1. Simplify the Action Buttons

Reduce the number of primary buttons.

Instead of showing many text buttons, use a cleaner system such as:

* One primary action, for example:

  * “Ask AI”
  * or “Menu assistant”
* One search icon button.
* One compact view/settings icon button.
* One overflow menu for secondary actions.

Secondary actions can be moved into:

* An icon-only toolbar.
* A three-dot menu.
* A compact floating control.
* A bottom sheet on mobile.
* A subtle segmented control, only if needed.

Do not display every feature as a large button.

---

### 2. Combine Similar AI/Search Actions

Simplify these actions:

* Ask.
* Search.
* Get recommendations.

Possible improved structure:

```txt
Primary: Ask AI
Secondary inside Ask AI or overflow:
- Search menu
- Get recommendations
- Find dishes by preference
```

or:

```txt
One compact assistant/search bar:
“What are you craving?”
```

This should give users access to AI/search functionality without cluttering the interface.

---

### 3. Reorganize Menu View Options

Options such as:

* Signature dishes.
* Traditional menu.
* Printed menu.
* Photo cards.

should not all compete visually as large buttons.

Reorganize them into a cleaner view system.

Possible structure:

```txt
View selector:
- Classic
- Photos
- Highlights
```

or:

```txt
Icon-only toolbar:
- List view
- Photo view
- Highlights
- Print/PDF
```

Use icons with tooltips or short labels where appropriate.

Keep the interface clean but still discoverable.

---

### 4. Preserve the Card Interaction

The current card interaction is good. Keep and improve it.

When users click a dish card:

* Show dish information clearly.
* Keep the interaction smooth and elegant.
* Use a modal, side panel, expanded card, or detail section depending on what works best with the current architecture.
* Make the details easy to read.
* Avoid adding too many buttons inside the dish detail view.
* Highlight key dish information such as:

  * Name.
  * Short description.
  * Price.
  * Dietary information, if available.
  * Allergens, if available.
  * Image, if available.
  * Recommendation label, if relevant.

---

### 5. Improve the Menu Page Composition

Make the page feel more intentional and less component-heavy.

Improve:

* Spacing.
* Alignment.
* Section hierarchy.
* Typography scale.
* Category navigation.
* Dish card density.
* Button hierarchy.
* Empty states.
* Mobile layout.
* Desktop layout.

The page should feel like one coherent menu experience, not a collection of disconnected components.

---

### 6. Make the Design Universal and Customizable

The reference website is elegant, but it is very luxury-focused. This app should work for many restaurant types.

Design the interface so it could work for:

* Casual restaurants.
* Cafés.
* Fine dining.
* Food trucks.
* Bars.
* Hotel restaurants.
* Family restaurants.
* Modern digital menus.

If the current project supports themes or customization, make the new menu layout compatible with different brand colors, images, and restaurant personalities.

Avoid styling that only fits luxury restaurants.

---

## Suggested New Structure

Use this as a possible direction, adapting it to the existing codebase:

```txt
Menu Page
├── Minimal restaurant/menu header
│   ├── Restaurant name
│   ├── Short subtitle or menu description
│   └── Small contextual action, if needed
│
├── Compact menu tools
│   ├── Search / Ask AI input or icon
│   ├── View selector
│   └── Overflow menu for secondary actions
│
├── Category navigation
│   ├── Starters
│   ├── Mains
│   ├── Desserts
│   └── Drinks
│
├── Dish content
│   ├── Elegant dish cards or list rows
│   └── Featured/highlighted dishes shown subtly
│
└── Dish detail interaction
    ├── Opens when clicking a dish/card
    └── Shows focused dish information
```

---

## Implementation Rules

* Preserve the functionality that already works.
* Keep the card-click dish information interaction.
* Reduce the number of visible buttons.
* Move secondary actions into a cleaner menu, toolbar, or view selector.
* Avoid redesigning unrelated pages.
* Keep the interface responsive.
* Make mobile especially clean and easy to use.
* Use the existing design system where possible.
* Use Tailwind CSS and existing components where appropriate.
* Avoid unnecessary new dependencies.
* Keep the code modular.
* If creating new components, make them reusable and future Storybook-friendly.
* Do not copy the reference website directly.
* Use the reference website only for design inspiration.

---

## Acceptance Criteria

The redesign is complete when:

* The menu page has fewer visible buttons.
* Redundant actions are simplified or combined.
* The page feels more minimalistic and elegant.
* The menu content is easier to scan.
* The dish cards/details interaction still works.
* The section shown in the screenshot no longer feels cluttered.
* Search, AI assistance, recommendations, and view options remain accessible but less visually dominant.
* The design feels inspired by premium restaurant interfaces but remains universal.
* The layout works on desktop, tablet, and mobile.
* There are no new console errors, broken routes, or broken interactions.

---

## QA Checklist

After implementation, check:

* Menu page visual hierarchy.
* Number of visible buttons.
* Search/Ask AI accessibility.
* Recommendation access.
* View mode access.
* Dish card click behavior.
* Dish detail display.
* Category navigation.
* Desktop layout.
* Tablet layout.
* Mobile layout.
* Keyboard accessibility.
* Hover/focus states.
* Console errors.
* Build/lint/tests, if available.

Run only the commands that exist in the project, such as:

```bash
npm run lint
npm run build
npm run test
```

---

## Final Response Required

After completing the work, provide a concise report with these sections:

### 1. Summary

Briefly explain how the menu interface was simplified and improved.

### 2. Design Inspiration Applied

Explain how the reference website influenced the design, without copying it directly.

### 3. Clutter Reduction

List which buttons/actions were removed, combined, hidden, or moved into secondary controls.

### 4. Menu Interaction Improvements

Explain how dish cards, dish details, search, AI assistance, recommendations, and view modes now work.

### 5. Universal Design Decisions

Explain how the design remains suitable for many types of restaurants, not only luxury restaurants.

### 6. Files Modified or Created

List the changed files and briefly explain each change.

### 7. Validation Checklist

Confirm what was tested, including responsive behavior, interactions, console errors, and build/lint/test commands if available.

---

## Non-Negotiable Instructions

* Do not simply add more components.
* Do not make the page more cluttered.
* Do not display every action as a large button.
* Do not remove working functionality.
* Do not copy the reference website directly.
* Keep the design elegant, minimal, universal, and easy to use.
* Keep the dish card interaction because that part is working well.

Take your time, study the screenshots and the reference website, simplify the interface thoughtfully, and verify the final result before finishing.

