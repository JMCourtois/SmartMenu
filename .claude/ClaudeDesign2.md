Act as a senior UX/UI designer, product designer, front-end developer, and SaaS dashboard architect. The current redesign is moving in the right direction, but the restaurant menu experience still needs refinement, especially the printed/a-la-carte menu view, contextual category navigation, dish information hierarchy, recommendation behavior, and the business backend/admin pages.

Your goal is to make the menu experience feel more elegant, premium, lightweight, contextual, and usable, while also creating the business management backend pages needed for restaurants to manage the application.

---

## Main Goals

Improve two major areas:

1. **Restaurant Menu Frontend**

   * Refine the a-la-carte / printed menu view.
   * Remove the boxed/card container around the printed menu.
   * Improve typography, spacing, dish descriptions, ingredient information, and dish detail content.
   * Add a contextual sticky category navigation system.
   * Make recommendations appear only inside the AI menu assistant, not directly inside the printed or photo menu views.
   * Improve visual treatment of dish tags, icons, allergens, and metadata.

2. **Business Backend / Admin Area**

   * Create or complete all backend/admin pages that appear in the backend navigation.
   * Design them as polished SaaS-style management pages for restaurant/business owners.
   * Include the features restaurants would realistically need to manage menus, dishes, categories, recommendations, analytics, settings, and business operations.

Do not redesign the entire website from scratch. Refine the current direction and improve the unfinished or poorly structured areas.

---

# Part 1: Improve the Printed / A-La-Carte Menu View

## Current Problem

The a-la-carte / printed menu is currently displayed inside a large box or card-like container. This makes it feel like a component placed on the page instead of an elegant restaurant menu.

The printed menu should not be inside a heavy box. It should sit naturally on the page, at the same visual level as the rest of the website, while still being structured like a real menu.

## Requirements

* Remove the large boxed/card wrapper around the printed menu.
* Present the menu content directly on the page in an elegant, editorial way.
* Keep enough structure so it still reads clearly as a menu.
* Use refined spacing, typography, and hierarchy to separate categories, dishes, descriptions, prices, and metadata.
* Make the layout feel premium but still universal for many restaurant types.
* Preserve responsive behavior on desktop, tablet, and mobile.

## Design Direction

The printed menu should feel like a modern digital version of a restaurant menu:

* Clean background.
* Elegant typography.
* Clear category sections.
* Well-spaced dish rows or dish blocks.
* Subtle dividers instead of heavy cards.
* Minimal visual noise.
* Strong readability.
* Premium but not overly luxurious.

Avoid:

* Heavy card containers around the entire menu.
* Excessive pills.
* Random colors for categories.
* Too many visible controls.
* Overly rounded badge styles.
* Visual clutter around each dish.

---

# Part 2: Update the Page Background

## Current Problem

The default website background does not feel right for this menu experience. It should be lighter and cleaner.

## Requirements

* Update the relevant menu page background to something lighter, close to:

```txt
#f5f5f5
```

* Use this as a base direction, but adjust slightly if needed to match the design system.
* Make sure the lighter background improves readability and makes the menu feel cleaner.
* Ensure all text, cards, dividers, and interactive elements still have enough contrast.
* Check both desktop and mobile layouts.

---

# Part 3: Improve Menu Typography

## Current Problem

The typography in the menu does not feel premium or intentional enough.

## Requirements

Improve the typography specifically for the menu experience:

* Make category titles feel elegant and easy to scan.
* Make dish names clear and visually prominent.
* Make prices easy to find without overpowering the dish name.
* Improve dish descriptions so they feel more editorial and appetizing.
* Use better hierarchy between:

  * Category title.
  * Dish name.
  * Description.
  * Ingredients.
  * Price.
  * Allergens/tags.
  * Detail links or interaction cues.
* Avoid making the text too dense.
* Avoid overusing bold weights.
* Use font sizes, weights, spacing, and letter spacing intentionally.

The goal is a premium menu reading experience, not a generic card grid.

---

# Part 4: Improve Dish Descriptions in the Menu View

## Current Problem

In the normal menu view, dishes need better visible descriptions. Users should understand the dish before opening the detailed view.

## Requirements

For each dish in the non-detailed menu view, show:

* A better short description.
* Key ingredients.
* Basic preparation style if useful.
* Price.
* Important dietary/allergen indicators if available.
* A subtle cue that users can click to learn more.

The dish preview should be useful but not overloaded.

## Example Structure

```txt
Dish Name — Price
Short, appetizing description of the dish.
Key ingredients: ingredient, ingredient, ingredient.
Small metadata row: vegetarian / spicy / contains nuts / gluten-free, if relevant.
```

Use real existing dish data if available. If the current data is incomplete, improve the mock/sample content in a realistic and consistent way.

---

# Part 5: Improve Dish Detail Information

## Current Problem

When users click a dish for more information, the detail view should provide richer, more useful content.

## Requirements

The dish detail view should include well-structured information such as:

* Dish name.
* Price.
* Image, if available.
* Full description.
* Main ingredients.
* Flavor profile.
* Cooking method or preparation style.
* Cultural or regional origin, if relevant.
* When or where people usually eat this dish, if relevant.
* Pairing suggestions, if useful.
* Allergy information.
* Dietary labels.
* Spice level, if relevant.
* Recommendation notes, if relevant.
* A clear close/back action.

The content should be interesting and useful for users who want to explore the dish more deeply.

## Important

Avoid inventing overly specific cultural claims unless the app uses mock data and the claim is clearly generic/sample content. If real restaurant data is unavailable, use tasteful placeholder/sample content that can later be replaced by backend content.

---

# Part 6: Create Contextual Sticky Category Navigation

## Current Problem

The navigation bar with categories like snacks, drinks, desserts, etc. needs to be improved.

It should be centered at the top of the menu area and become sticky when the user scrolls to it. It must also be contextual to the current menu page and the categories/dishes available on that page.

## Requirements

* Create a contextual category navigation bar for each menu page.
* Generate the category items dynamically from the categories available on that specific page.
* Examples:

  * A-la-carte page: starters, mains, desserts, drinks, etc.
  * Drinks page: cocktails, wine, beer, non-alcoholic, coffee, etc.
  * Dessert page: cakes, pastries, ice cream, seasonal sweets, etc.
* The nav should scroll/jump to the selected category section within the printed menu.
* It should become sticky when the user scrolls to its position.
* It should remain visually elegant and minimal.
* It should work on desktop and mobile.
* It should highlight the currently active section while scrolling, if feasible.
* It should not feel like a heavy button group.
* It should not use random colored pills.

## Visual Direction

The category nav can be:

* Centered or naturally aligned depending on what looks best.
* Minimal text links.
* Subtle underline or active state.
* Thin dividers.
* Small icons only if they improve clarity.
* Sticky under the main navbar when scrolling.

Avoid:

* Large colored pills.
* Overly rounded category buttons.
* Too many competing styles.
* A nav that is the same on every page regardless of content.

---

# Part 7: Improve Dish Metadata / Tags / Pills

## Current Problem

The current printed menu uses pills or tags with different colors and inconsistent border-radius. This does not feel elegant enough.

## Requirements

Replace colorful pill-style metadata with a more seamless, refined system.

Use a cleaner metadata unit such as:

* Small icon + short text.
* Subtle monochrome label.
* Small uppercase or semi-bold descriptor.
* Light divider between metadata items.
* Consistent spacing and typography.

## Examples

Instead of colorful rounded pills like:

```txt
[ Spicy ] [ Vegan ] [ Popular ]
```

Use something more subtle:

```txt
🌶 Spicy · Vegan · Popular
```

or:

```txt
Icon + SPICY
Icon + VEGAN
Icon + CONTAINS NUTS
```

The exact style should match the website design system, but the goal is to make metadata recognizable without making it look like a set of loud buttons.

Apply this to:

* Printed menu dish metadata.
* Dish detail metadata.
* Photo menu metadata, if present.
* Any category or dish labels that currently feel too pill-heavy.

---

# Part 8: Adjust Recommendation Behavior

## Current Problem

Recommendations are currently visible inside the photo menu and/or printed menu, which makes the page feel cluttered and distracts from the menu itself.

Recommendations should be available through the AI assistant, not displayed directly in the menu views.

## Requirements

* Remove visible recommendation sections from the printed menu view.
* Remove visible recommendation sections from the photo menu view.
* Keep recommendations accessible through the AI menu assistant/chat experience.
* Create or improve the recommendation CTA so it feels natural and useful.
* The CTA should not say something generic if a better label is possible.

## Recommended CTA Options

Use a better call to action such as:

```txt
Ask the Menu Assistant
```

```txt
Find a dish for me
```

```txt
Help me choose
```

```txt
Get a personalized suggestion
```

Choose the CTA that best fits the UI and product tone.

## AI Recommendation Behavior

When users click the recommendation CTA:

* Open the AI menu assistant/chat box.
* Show recommendations inside the assistant/chat experience.
* Keep the printed/photo menu clean.
* Allow the user to ask follow-up questions about the menu.
* Avoid duplicating recommendations in multiple places.

---

# Part 9: Photo Menu Refinement

## Current Problem

The photo menu should remain centered and visually focused. Recommendations should not appear directly inside the photo menu.

## Requirements

* Keep the photo menu centered and visually balanced.
* Remove recommendation blocks from the photo menu layout.
* Keep dish photos, dish names, prices, and essential information clear.
* Allow users to open dish details from photo cards.
* Move recommendations into the AI assistant flow.
* Make sure the layout remains responsive and elegant.

---

# Part 10: Business Backend / Admin Pages

## Current Problem

The backend/business area needs all pages from the backend navigation to be created or completed. These pages should help businesses manage the application.

## Requirements

Inspect the backend navigation and create or complete every page linked there.

Design these pages as a polished restaurant SaaS admin panel. Think about what restaurant owners, managers, and staff would need to manage their digital menu and customer experience.

## Backend Pages to Create or Complete

Create or complete pages such as:

1. Dashboard

   * Business overview.
   * Key metrics.
   * Recent activity.
   * Quick actions.
   * Menu status.
   * AI assistant usage summary.

2. Menu Management

   * Manage menus.
   * Manage menu categories.
   * Add/edit/delete dishes.
   * Set dish availability.
   * Set prices.
   * Add descriptions, ingredients, allergens, and dietary tags.
   * Upload/manage dish images.

3. Dish Management

   * Dish list.
   * Search/filter dishes.
   * Dish editor.
   * Ingredients.
   * Allergens.
   * Preparation style.
   * Cultural/origin notes.
   * Flavor profile.
   * Pairing suggestions.

4. Categories

   * Create/edit/delete categories.
   * Reorder categories.
   * Assign dishes to categories.
   * Control which categories appear on each menu page.

5. AI Recommendations / Menu Assistant

   * Configure recommendation rules.
   * Set featured dishes.
   * Set dietary preference handling.
   * Configure AI assistant tone.
   * Review common customer questions.
   * Manage suggested answers or prompts.

6. Analytics

   * Menu views.
   * Most viewed dishes.
   * Most clicked dishes.
   * Search queries.
   * AI assistant interactions.
   * Recommendation clicks.
   * Popular categories.

7. Orders or Requests, if relevant

   * Customer requests.
   * Inquiry tracking.
   * Table/order placeholders if ordering is planned.
   * Disabled placeholders if backend/order functionality is not available.

8. Media Library

   * Dish images.
   * Restaurant images.
   * Logo/brand assets.
   * Upload placeholders.
   * Image management UI.

9. Business Profile

   * Restaurant name.
   * Description.
   * Address.
   * Opening hours.
   * Contact information.
   * Cuisine type.
   * Social links.

10. Branding / Appearance

* Logo.
* Brand colors.
* Typography preferences.
* Menu theme.
* Background style.
* Button style.
* Preview panel if possible.

11. Staff / Users

* Team members.
* Roles.
* Permissions.
* Invite user placeholder.
* Access level indicators.

12. Settings

* General settings.
* Account settings.
* Menu settings.
* Language settings.
* Notification preferences.
* Privacy/data settings.
* Integrations placeholders.

13. Billing / Subscription, if shown in the navigation

* Plan overview.
* Usage.
* Payment method placeholder.
* Invoice list placeholder.
* Upgrade/downgrade CTA.

14. Help / Support, if shown in the navigation

* Help center.
* Contact support.
* Documentation links.
* Onboarding checklist.

Only create pages that match the actual backend navigation structure. If the navigation includes different items, follow the existing navigation and create the relevant pages accordingly.

## Backend Implementation Rules

* Use polished SaaS dashboard design.
* Keep the backend consistent with the current app design system.
* Use realistic placeholder/mock data where backend data is not available.
* Make placeholder actions safe and clear.
* Do not implement destructive actions without confirmation UI.
* Keep forms structured and readable.
* Create reusable dashboard components where possible.
* Make pages responsive.
* Avoid empty routes.
* Avoid links that go nowhere unless clearly marked as placeholders.

---

# Implementation Rules

* Preserve the current design direction.
* Do not redesign unrelated sections.
* Use Tailwind CSS and existing components where appropriate.
* Keep components modular and reusable.
* Avoid creating unnecessary complexity.
* Avoid showing recommendations directly inside printed/photo menu views.
* Keep the menu focused on the dishes.
* Use contextual navigation based on actual page categories.
* Improve typography and content hierarchy.
* Make dish details richer and more useful.
* Use realistic mock data when real data is unavailable.
* Leave clear TODO comments for backend integration where necessary.
* Ensure responsive behavior across desktop, tablet, and mobile.
* Check for console errors, broken routes, and broken interactions.

---

# Acceptance Criteria

The task is complete only when:

* The printed/a-la-carte menu is no longer inside a heavy box/card wrapper.
* The printed menu sits naturally on the page and feels like an elegant menu.
* The menu page background is lighter and cleaner.
* Menu typography feels more premium and intentional.
* Dish previews include better descriptions, ingredients, and useful metadata.
* Dish detail views include rich, structured dish information.
* Category navigation is contextual to the page.
* Category navigation scrolls to the correct menu sections.
* Category navigation becomes sticky at the right point while scrolling.
* Metadata/tags are subtle and elegant, not colorful pill-heavy elements.
* Recommendations are removed from printed/photo menu layouts.
* Recommendations are accessible inside the AI menu assistant/chat.
* Photo menu remains centered and focused.
* Backend/admin navigation pages are created or completed.
* Backend pages feel useful, polished, and realistic for restaurant/business management.
* No major responsive, routing, console, or layout regressions are introduced.

---

# QA Checklist

After implementation, verify:

* Printed/a-la-carte menu layout.
* Background color and contrast.
* Typography hierarchy.
* Dish preview descriptions.
* Dish detail content.
* Category nav dynamic generation.
* Category nav sticky behavior.
* Category nav scroll-to-section behavior.
* Active category state, if implemented.
* Metadata/tag styling.
* Recommendation CTA behavior.
* AI assistant recommendation flow.
* Photo menu layout.
* Backend/admin routes.
* Backend navigation links.
* Backend page responsiveness.
* Empty states and placeholders.
* Desktop layout.
* Tablet layout.
* Mobile layout.
* Console errors.
* Build/lint/tests, if available.

Run only commands that exist in the project, such as:

```bash
npm run lint
npm run build
npm run test
```

---

# Final Response Required

After completing the work, provide a concise implementation report with these sections:

## 1. Summary

Briefly explain what was improved across the menu frontend and backend/admin area.

## 2. Printed / A-La-Carte Menu Changes

Explain how the boxed layout was removed and how the menu was restructured.

## 3. Typography and Visual Design Improvements

Describe changes to background, spacing, typography, metadata, and visual hierarchy.

## 4. Dish Content Improvements

Explain what changed in dish previews and dish detail views.

## 5. Contextual Category Navigation

Explain how the sticky category navigation works and how categories are generated per page.

## 6. Recommendation Flow

Explain how recommendations were removed from menu views and moved into the AI assistant/chat experience.

## 7. Photo Menu Changes

Explain how the photo menu was cleaned up and kept centered/focused.

## 8. Backend/Admin Pages Created or Completed

List each backend/admin page created or completed and summarize its purpose.

## 9. Files Modified or Created

List all modified or created files with a short explanation.

## 10. Remaining TODOs

List anything that still requires backend integration, real business data, authentication, file uploads, payments, or product decisions.

## 11. Validation Checklist

Confirm what was tested, including responsive behavior, category navigation, AI recommendation flow, backend routes, console errors, and build/lint/test commands if available.

---

# Non-Negotiable Instructions

* Do not keep the printed menu inside a heavy box/card wrapper.
* Do not show recommendations directly inside the printed menu.
* Do not show recommendations directly inside the photo menu.
* Do not use loud colorful pills for dish metadata.
* Do not make category navigation static if the page has dynamic categories.
* Do not create empty backend routes.
* Do not break the current card/dish detail interaction.
* Do not redesign the entire website.
* Keep the result elegant, minimal, readable, contextual, and useful.

Take your time, inspect the screenshots and current implementation carefully, make the changes, and check the final result before finishing.

