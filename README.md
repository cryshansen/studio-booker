# 📸 Studio Booker App

A streamlined Angular application for photographers to browse, book, and confirm studio rentals. Built with performance, usability, and modularity in mind, this app allows users to view studios, select time slots, add bookings to a cart, and complete checkout with confirmation and PDF generation.

## 🚀 Features
🏢 Studio Listings – Browse a list of available studios with descriptions, pricing, and features.

📅 Calendar View – View availability for each studio using FullCalendar. Click a day or event to book.

📝 Booking Form – Slide-out booking form auto-fills selected date and allows choosing time slots.

🛒 Cart System – Add multiple bookings, remove items, see total cost, and access cart at any time.

💵 Checkout Process – Enter billing and payment details with promo code support and validation.

✅ Confirmation Page – Review final booking, with option to generate a downloadable PDF invoice.

♻️ Cart Persistence – Cart is stored in localStorage to maintain items during navigation.

✨ Responsive UI – Built using Bootstrap 5 and FontAwesome icons.

📄 PDF Export – Generate clean confirmation receipts using html2pdf.js.

## 📂 Project Structure
```
    src/
    │
    ├── app/
    │   ├── studios/           # Landing page to list studios
    │   ├── calendar/          # Calendar view and booking handler
    │   ├── booking-form/      # Reactive form for bookings
    │   ├── cart/              # Shopping cart view
    │   ├── checkout/          # Billing, payment, and validation
    │   ├── confirmation/      # Final confirmation and PDF export
    │   ├── header/            # App-wide header with navigation
    │   ├── spinner/           # Loading spinner component
    │   ├── services/
    │   │   └── cart.service.ts   # Cart management and persistence
    │   └── app.component.ts     # Root component and routing
```

## 🛠️ Tech Stack
    Angular 17+ (Standalone Components)

    FullCalendar Angular Plugin

    Bootstrap 5 (via CDN or styles import)

    FontAwesome

    Reactive Forms

    LocalStorage API

    html2pdf.js for printable/downloadable confirmations

## ✅ Booking Flow
    User lands on /studios

    Selects a studio and is routed to /calendar/:id?price=...&name=...

    Clicks a date → Booking form slides open

    Selects a time slot → Submits booking → Added to cart

    Views cart and clicks Checkout

    Enters billing info → Clicks Book it!

    Lands on Confirmation Page

    Option to print or download PDF confirmation

    Cart is cleared on confirmation load

## 📌 Notes
    Studios are currently hardcoded; can be connected to an API.

    Promo code (EXAMPLECODE) applies a static discount.

    Country → State/Province is dynamically populated for Canada/US.

    Cart uses localStorage to persist across refresh/navigation.

## 📄 License
MIT

## Further info:
This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.15.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

