# Gifted

Gifted is a React Native app for keeping track of gift ideas. Gifts are intended to be grouped by a person or an event, with room for descriptions, prices, and product links. This is an educational side project: the frontend uses Expo and TypeScript, with the longer-term goal of connecting it to a Java/Spring backend.

## Start the app

### First-time setup

1. Install [Node.js 22.13 or newer](https://nodejs.org/). Expo SDK 57 requires Node.js 22.13.x or newer.
2. Open a terminal in the project folder (the folder containing `package.json`).
3. Install the dependencies from the lockfile:

	```sh
	npm ci
	```

### Start or resume development

1. In the project folder, start Expo:

	```sh
	npm run start
	```

2. Leave this terminal running. When the Expo menu appears, choose a target:
	- Press `w` to open the web app in a browser.
	- Press `i` to open the iOS Simulator (macOS with Xcode and a simulator installed).
	- Press `a` to open an Android emulator (with Android Studio and an emulator installed).
	- To use a device, scan the displayed QR code with the Expo app. Your computer and device should be on the same Wi-Fi network.
3. Edit a file under `src/`; Expo Fast Refresh applies most changes while the server is running.
4. To stop the development server, focus its terminal and press `Ctrl+C`. Next time, return to the project folder and run `npm run start` again.

If the device cannot reach the development server on your network, start it in tunnel mode instead:

```sh
npm run start -- --tunnel
```

Tunnel mode can be slower than a local network connection. The project also has convenience scripts: `npm run ios`, `npm run android`, and `npm run web` start Expo for those targets directly. Run `npm run lint` to check the project with Expo's lint command.

## Where to start working

The app uses Expo Router file-based routing. Screens live in `src/app/`, and the route files are the quickest place to begin:

| File | Start here to... |
| --- | --- |
| [`src/app/index.tsx`](src/app/index.tsx) | Change the Home screen. It currently renders mock gift groups. |
| [`src/app/explore.tsx`](src/app/explore.tsx) | Explore the starter/demo screen and its UI examples. |
| [`src/app/_layout.tsx`](src/app/_layout.tsx) | Change the shared app layout, theme provider, or tab setup. |
| [`src/components/app-tabs.tsx`](src/components/app-tabs.tsx) | Change the native iOS/Android tab bar. |
| [`src/components/app-tabs.web.tsx`](src/components/app-tabs.web.tsx) | Change the web tab bar. |
| [`src/services/gifted-data-source.ts`](src/services/gifted-data-source.ts) | The shared contract for loading events, people, gift ideas, and the temporary dashboard projection. |
| [`src/services/data-source.ts`](src/services/data-source.ts) | Select the mock or REST data source. |
| [`src/services/mock-gifted-data-source.ts`](src/services/mock-gifted-data-source.ts) | Sample groups, people, and gifts for backend-free development. |
| [`src/services/rest-gifted-data-source.ts`](src/services/rest-gifted-data-source.ts) | Provisional REST implementation; update its assumptions to match Spring later. |
| [`docs/api-contract-draft.md`](docs/api-contract-draft.md) | App-first sample JSON payloads and proposed REST requests/responses to use as the Spring API starting point. |

For supporting code, start with these files:

| File | Responsibility |
| --- | --- |
| [`src/api/client.ts`](src/api/client.ts) | Shared Axios client for backend requests. |
| [`src/constants/apiConfig.ts`](src/constants/apiConfig.ts) | Backend base URL, endpoint paths, and timeout. |
| [`src/types/event.ts`](src/types/event.ts) | Event and participant resource types. |
| [`src/types/gift.ts`](src/types/gift.ts) | Gift idea resource, enums, and create/update request types. |
| [`src/types/group.ts`](src/types/group.ts) | Temporary dashboard card projection; not a backend resource. |
| [`src/types/money.ts`](src/types/money.ts) | Currency and minor-unit amount used by budgets and gift prices. |
| [`src/constants/theme.ts`](src/constants/theme.ts) | Shared colors, typography, and layout values. |
| [`app.json`](app.json) | Expo app identity, platform settings, and plugins. |
| [`package.json`](package.json) | Dependencies and the available npm scripts. |

The Home screen calls `getGroups()` through the shared data-source contract. It displays a loading state, an empty state, and a retryable error when the selected source fails. Mock data is selected by default, and API errors do not silently switch back to sample data.

## Backend connection

To opt into the provisional REST implementation, create a root-level `.env.local` file with:

```env
EXPO_PUBLIC_DATA_SOURCE=rest
EXPO_PUBLIC_API_BASE_URL=http://localhost:8080
```

Restart Expo after changing environment variables. The provisional REST implementation expects `GET /api/events`, `GET /api/people`, and `GET /api/gift-ideas` to return JSON arrays matching the app-first models documented in [docs/api-contract-draft.md](docs/api-contract-draft.md). These paths and shapes are a starting point to revise as the Spring API is designed. Until the dashboard is redesigned, it combines those resources into a temporary person/event card list. The default API base URL is `http://localhost:8080`; on a physical device, `localhost` points to the device itself, so use your development computer's LAN IP address and keep both devices on the same network. If the backend is not ready, remove `EXPO_PUBLIC_DATA_SOURCE=rest` or set it to `mock` to use sample data.

## Project overview

- **Frontend:** React Native, Expo SDK 57, TypeScript
- **Targets:** iOS, Android, and web
- **Backend direction:** Java/Spring with a Domain-Driven Design architecture
- **Planned capabilities:** Custom gift descriptions, product links and details, and groups organized by person or event

## Planned implementation phases

1. Project setup and navigation structure
2. Core UI components and styling
3. API integration and data fetching
4. Gift management features
5. Product-link integration
6. Testing and deployment