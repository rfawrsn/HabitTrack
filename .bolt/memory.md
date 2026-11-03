# Project memory

## Product intent & audience

- **HabitTrack** is a beginner-friendly Expo mobile app for university students to track daily habits, monitor completion and streaks, and document achievements with photos.
- Designed for a simple university presentation/demo and real Android testing through Expo Go.
- Core areas: authentication, home progress overview, habit management, history, camera documentation, and profile/logout.

## Brand personality & voice

- Modern, approachable, motivating, and practical.
- Indonesian is used for visible interface text, including authentication, navigation, empty states, errors, and fallback screens.
- Copy should remain concise and understandable for students; avoid overly technical or formal language.
- README and developer-facing code may remain in English where appropriate.

## Visual design & UX direction

- Minimalist green-and-white visual system with rounded cards and clear hierarchy.
- Use bottom navigation for the main sections and reusable components for headers, cards, fields, banners, dialogs, segmented controls, progress/stat tiles, and habit rows.
- Prioritize readable text, comfortable touch targets, clear completion states, and responsive layouts on phone-sized screens.
- Main flows should be straightforward:
  - Authenticated users land in the protected tab experience.
  - Home emphasizes today’s habits, completion percentage, and progress.
  - Habits supports create, edit, delete, and completion actions.
  - History presents daily progress and streak information.
  - Camera supports permission state, live preview, camera flip, capture, retake, save with caption/optional habit association, gallery viewing, and deletion.
  - Profile includes session logout.
- Camera is the only device sensor used. Handle unavailable/denied permissions with an understandable fallback.
- Prefer explicit loading, success, empty, error, offline, and retry states rather than silent failures.
- Keep interactions demonstration-friendly and avoid unnecessary complexity.

## Decisions, constraints & rationale

- Stack: Expo, React Native, TypeScript, Expo Go-compatible libraries, Axios, AsyncStorage, Expo SecureStore, and Expo Camera.
- A separate Axios-backed mock API/service layer is used because there is no real backend. It provides typed DTOs/interfaces, JSON-style responses, request routing, bearer-token handling, protected endpoint behavior, status/error mapping, timeout, retry, and cached/offline support.
- AsyncStorage stores local accounts, habits, history, and photo metadata/data as needed. Passwords must not be stored in plain text; authentication tokens use SecureStore and are cleared on logout.
- Auth includes registration/login validation, duplicate-email prevention, session restoration, protected screens, and logout/session clearing.
- Existing implementation includes the root layout, auth context/hooks, protected tab guard, five tab screens, reusable UI and habit components, photo hook, camera flow, gallery/full-size viewer, app naming, camera permission text, and an Indonesian not-found screen.
- TypeScript checking passes and the web export/build passes. The app has not been physically tested on an Android device in Expo Go; camera permissions and sign-in/storage behavior remain especially important to verify.
- Keep implementation simple and easy to explain. Avoid introducing a real database/backend unless requirements change; the README documents the local mock-storage decision and future backend direction.
- README includes setup instructions, feature information, and storage architecture. The expected launch command is `npx expo start`.

## Open questions & assumptions

- Android Expo Go testing is still required to confirm camera permissions, preview/capture/retake behavior, local persistence, token restoration, and the complete auth flow.
- Confirm whether photo files remain reliably accessible across app restarts on the target Expo Go environment; adjust file handling if only temporary URIs are currently retained.
- Confirm the intended package identifier and any required production build configuration beyond the updated app display name.
- No real backend, server-side password hashing, or production-grade account security is currently available because the app uses a local mock API.