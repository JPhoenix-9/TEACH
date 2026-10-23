# Immersive Library

Owner request October 22, 2026: Library should feel like entering the room depicted by the approved Library icon, comparable to the homepage and My Desk. A room image should occupy almost the full screen beneath the locked shared header; the view is inside the room, not through the entrance doors.

- Preserve the icon's tall warm wooden shelves, arched sunlit window, brass globe and rolling ladder. Include an inviting chair and a reading table with an open book. Keep live controls separate from the room artwork.
- Use the existing locked shared Header unchanged. Measure its rendered height so the room fills the remaining viewport, including when the header wraps on a phone.
- Library remains free, with no account, registration, purchase, marketing consent or entitlement required to read.
- Browse the shelves opens a keyboard-accessible dialog with actual article search, topic filtering, result counts, an empty state and reset. Search includes the existing article text.
- The reading table opens a real article. Existing article links can open a reading view over the room; modifier-click and canonical individual article URLs remain available.
- Reader preserves every original paragraph, author and original publication date. No fabricated new articles, downloads, shelves of unavailable material or reading history.
- Close/Escape returns to the originating control. The reading view can return to the shelves without leaving the Library. Background scrolling is locked while the dialog is open, and the dialog's outer page edge contains its scroll bar.
- Keep all three existing article pages and discoverable direct links. Add a conventional article collection below the room for visitors who prefer ordinary browsing and for graceful no-JavaScript access.
- Keep room labels readable, unobscured, comfortably tappable and responsive. Use restrained cream/brass plaques; no invented leaf ornament or generated header.
- Respect reduced-motion settings; do not add autoplay sound, forced animation or unrequested ambience audio.
- Existing webinars remain separately registered content. Library design does not change their access rules.

Assets: `public/library-room-v1.webp`, generated from `public/Icons/library.png` as the design reference. Artwork has no embedded labels or interface. Source implementation: `app/library/LibraryExperience.js` and `app/library/library.module.css`.
