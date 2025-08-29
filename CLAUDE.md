# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server (port 3000)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Overview

This is a Next.js 14 application that generates randomized Magic: The Gathering-style booster packs with color and rarity restrictions. The app generates 14-card boosters following a specific distribution pattern and saves them to local storage for review.

## Architecture

### Core Logic (`src/lib/booster.ts`)
- **Card Types**: Defines enums for `CARD_COLORS` (7 colors including multicolor/colorless) and `CARD_RARITY` (4 rarities)
- **Booster Generation**: `generateBooster()` creates 14-card packs with distribution: 4 mythic, 4 rare, 3 uncommon, 3 common
- **Color Restriction**: `checkAndGenerateCard()` ensures max 2 cards per color per booster via recursive generation
- **Storage**: Local storage functions for persisting/retrieving booster history

### Component Structure
- **Main Page** (`src/app/page.tsx`): Single-page app with generate button and loading state
- **BoosterCarousel**: Displays current booster as swipeable card carousel using Embla Carousel
- **BoosterCard**: Individual card component with dynamic color styling via Tailwind
- **PastBooster**: Shows history of generated boosters with delete functionality
- **UI Components**: Uses shadcn/ui components (Button, Carousel, Dialog) with Radix primitives

### Styling
- **Tailwind CSS**: Primary styling framework with custom color system
- **Dark Mode**: Hardcoded dark theme (`className="dark"`)
- **Card Colors**: Dynamic background colors mapped to MTG color identity
- **Responsive**: Mobile-first design with carousel navigation

### State Management
- React hooks for local component state only
- No global state management
- Local storage for data persistence

## Key Files
- `src/lib/booster.ts` - Core booster generation and card logic
- `src/app/page.tsx` - Main application page
- `src/components/BoosterCarousel/` - Card display carousel
- `src/components/BoosterCard/` - Individual card component
- `src/components/PastBooster/` - Booster history management

## Tech Stack
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Embla Carousel
- Lucide React (icons)