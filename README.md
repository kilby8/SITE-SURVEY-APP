# Site Survey App

A web application for managing telecom and infrastructure site surveys.

## Features

- Create, view, edit, and delete site surveys
- Track survey status (Planned, In Progress, Completed, Cancelled)
- Search and filter surveys by name, ID, location, or surveyor
- Capture site details: location, coordinates, site type, survey type
- Record technical information: structure height, antenna height, power availability
- Add notes, access requirements, equipment lists, and recommendations
- Survey statistics dashboard
- Fully responsive design

## Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Lint code with ESLint |
| `npm run preview` | Preview production build |

## Tech Stack

- [React 19](https://react.dev/)
- [Vite 8](https://vite.dev/)
- Browser `localStorage` for data persistence

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ConfirmDialog.jsx
│   ├── Navbar.jsx
│   ├── StatusBadge.jsx
│   └── Toast.jsx
├── hooks/
│   └── useToast.js
├── pages/            # View pages
│   ├── SurveyDetail.jsx
│   ├── SurveyForm.jsx
│   └── SurveyList.jsx
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── storage.js
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```
