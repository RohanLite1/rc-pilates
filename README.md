# Aura Pilates — Android & Laptop Studio App

A mindful movement and pilates studio application designed with a light, calm, ambient aesthetic.

---

## 📅 Calendar-Only Timeslots & Reschedule Feature

- **Interactive Monthly Calendar**: Timeslots are displayed purely in calendar form. Members navigate months, view day badges, and tap any date to inspect session details.
- **Visual Session Indicators**:
  - 🟢 **Present**: Marked by instructor
  - 🔴 **Absent**: Marked by instructor
  - 🟢 **Scheduled**: Upcoming assigned class
  - 🟡 **Reschedule Requested**: Pending instructor confirmation
- **Request Reschedule (No "Book Appointment")**: Members cannot randomly book open slots; their schedule is curated by Instructor Sarah. Members can tap **"Request Reschedule"** on any session to select a preferred new date, timeslot, and note.
- **Instructor Approval Flow**: When a client requests a reschedule, an alert card appears on Sarah's dashboard where she can **Approve** (which automatically shifts the session to the new date/time) or **Decline**.

---

## 📱 Testing on Your Phone (Zero Installation / Immediate)

Your Vite development server is broadcasting on your local Wi-Fi:

👉 **`http://192.168.1.14:5173/`**

1. Make sure your phone is connected to the same Wi-Fi network.
2. Open Chrome (or your default browser) on your phone and go to:
   **`http://192.168.1.14:5173/`**
3. **Native Feel / Fullscreen**: In Chrome on Android, tap the three dots `⋮` &rarr; tap **"Add to Home screen"** or **"Install app"**. It will launch like a native mobile app without the browser address bar!

---

## 💻 Testing on Your Laptop

Open: **`http://localhost:5173/`**
- Use the **Phone Frame Toggle** on top to view the authentic Android device mockup.
- Use the **Quick Persona Switcher** to jump between **Instructor Sarah** and **Client Elena** to test rescheduling and attendance live!
