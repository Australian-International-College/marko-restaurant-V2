# Marko Restaurant Booking Demo

Files are ready for Netlify deploy. Keep all files in the root of the deployed folder.

## Included changes
- Central booking support via Firebase Realtime Database, with local demo fallback.
- Logo updated to `Marko's Logo.jpg`.
- Gallery item changed from Noodle Soup to Tom Yum Noodle using `Tom Yum Noodles.jpg`.
- Facebook and Instagram icons added to the top navigation.
- Breakfast, lunch, dinner menu buttons linked to their PDF files.
- More Photos button added under Food Gallery and linked to `Full Menu 2026.pdf`.
- Booking time dropdown generates 15-minute intervals for 7:00 AM–2:00 PM and 5:00 PM–8:30 PM.

## Staff login
Open `staff.html`. Demo password: `marko2026`.

## Important Firebase setup
Right now, if `firebase-config.js` still contains `PASTE_...`, bookings are stored only in the same browser for demo mode.
For real shared bookings across devices, create a Firebase Realtime Database project and replace the values in `firebase-config.js`.
