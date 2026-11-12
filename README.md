# RC Pilates & Fitness Studio

Mindful movement, contemporary reformer management, and client scheduling application.

## Overview

RC Pilates & Fitness Studio is a digital studio management platform designed for both lead instructors and studio members. The system centralizes class attendance, batch-level time scheduling, client rosters, fee tracking, and automated reminder notifications.

## Key Features

### 1. Instructor Operations
- Lead Instructor: Radhika Chopra
- Daily attendance tracking with status indicators: Present, Absent, Scheduled
- Categorized batch views:
  - Morning Batches: 7:00 AM - 12:00 PM (Hourly slots: 07:00-08:00, 08:00-09:00, 09:00-10:00, 10:00-11:00, 11:00-12:00)
  - Evening Batches: 4:00 PM - 12:00 AM (Hourly slots: 04:00-05:00, 05:00-06:00, 06:00-07:00, 11:00-12:00)
- Slot availability toggles allowing the instructor to open or close specific studio hours
- Fee tracking dashboard to record payment statuses, due dates, and send reminders
- Reschedule request approval workflow

### 2. Client and Member Experience
- Google authentication with automatic role identification
- Step-by-step new member onboarding flow (Profile, contact, Reformer experience, and dietary preferences)
- Interactive timeslot schedule and class information
- Studio nutrition and hydration tracker
- Reschedule request submission directly from booked slots

### 3. Notification and Reminder System
- 45-minute pre-class reminders with action options for members to confirm attendance ("Attending" / "Not attending")
- Fee due alerts scheduled in advance of payment deadlines
- Built-in notification test panel for immediate demonstration and verification

### 4. Navigation and User Interface
- Minimalist, serene design system built with calming neutral tones
- Smooth hardware-accelerated drawer transitions with staggered cascade animations
- Hardware and swipe-based back navigation support to move between batch details and overview screens without closing the application

### 5. Multi-Platform Delivery
- Progressive Web App (PWA) configuration with Apple standalone display meta tags and custom icons for iOS Home Screen installation
- Native Android support packaged via Capacitor for local APK installation

## Tech Stack

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Capacitor (Native Android runtime and local notifications)
- Lucide React (Iconography)

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
npm install
```

### Local Development Server
```bash
npm run dev
```

### Production Web Build
```bash
npm run build
```

### Android Native Sync and Build
```bash
npx cap sync android
```
Navigate to the `android/` directory and build via Gradle:
```bash
cd android
./gradlew assembleDebug
```

## Deployment

The repository is configured for deployment on Vercel with single-page application routing rules defined in `vercel.json`.
