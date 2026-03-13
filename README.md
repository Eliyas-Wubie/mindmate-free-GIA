# MindMate

MindMate is a React + Vite web app for practicing three fast-paced cognitive mini-games inspired by GIA-style aptitude tasks. The app focuses on speed, accuracy, and simple repetition-based training in a clean single-page interface.

## Games

### 1. Spatial Visualisation
- Shows transformed versions of the same image.
- The player answers how many of the displayed items match after rotation only.
- Mirrored or flipped versions do not count as matches.

### 2. Perceptual Speed
- Shows four letter pairs.
- The player counts how many pairs represent the same letter regardless of case.
- Designed to test fast visual scanning and comparison.

### 3. Number Speed & Accuracy
- Shows three numbers.
- The player selects the number that is furthest from the other two.
- Focuses on quick numeric comparison under time pressure.

## Features

- Responsive layout with a desktop sidebar and mobile drawer
- Trial limit control in the top navigation
- Per-game progress tracking
- Average speed and accuracy feedback
- In-app help dialogs explaining each game
- Built with Material UI components

## Tech Stack

- React 19
- Vite
- Material UI
- Emotion
- ESLint

## Getting Started

### Prerequisites
- Node.js 18+ recommended
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173`.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## How to Use

1. Start the app.
2. Choose a game from the sidebar or home screen.
3. Set the `Limit` field to control how many rounds to play.
4. Answer each prompt as quickly and accurately as possible.
5. Review the live speed, accuracy, and progress indicators during the session.

## Project Structure

```text
src/
  component/
    nav.jsx            # Main layout and game navigation
    nav.module.css
  games/
    SpaceVis.jsx       # Spatial visualisation game
    PercSpeed.jsx      # Perceptual speed game
    NumSpeed.jsx       # Number speed and accuracy game
  App.jsx
  main.jsx
public/
  pics/                # Game and branding images
```

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build
- `npm run lint` - run ESLint

## Notes

- The app currently runs entirely on the client side.
- Game state resets when the page is refreshed.
- Branding and image assets are stored in `public/pics`.
