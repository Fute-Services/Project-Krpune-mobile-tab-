# KRPUNE Native - Architecture and Data Flow

Derived from a static review of the app source code on 2026-07-16. This shows what the app actually does, based on reading the code, not an assumed design.

## Network / Component Diagram

```mermaid
flowchart LR
    User["User\n(Android / iOS device)"]

    subgraph App["KRPUNE Native App (Expo / React Native)"]
        Screens["Screens\n(Home, Amenities, VR, Location, etc.)"]
        LocalClient["localClient.ts\n(reads bundled JSON, no network call)"]
        BundledData["Bundled JSON data\nfloors, amenities, mobility,\ntransport, gallery, vr-tour"]
        WebViewer["In-app WebView\n(Panorama / VR viewer)"]
        Cache["Device cache directory\n(expo-file-system)"]
    end

    Cloudinary["Cloudinary CDN\n(public media hosting)"]

    User --> Screens
    Screens --> LocalClient
    LocalClient --> BundledData
    Screens -- "HTTPS: fetch images/video" --> Cloudinary
    Screens --> WebViewer
    WebViewer -- "reads/writes local HTML + media" --> Cache
```

## Data Flow Diagram

```mermaid
flowchart TD
    A["App bundle\n(built-in JSON files)"] -->|"read locally, no network"| B["localClient.ts"]
    B --> C["Screens render content\n(floor plans, amenities, mobility, etc.)"]
    C -->|"HTTPS request"| D["Cloudinary CDN"]
    D -->|"image / video response"| C
    C -->|"generate viewer HTML"| E["Device cache directory"]
    E --> F["WebView renders\nPanorama / VR tour"]

    style A fill:#e8f4ea,stroke:#2f7a3d
    style D fill:#fdeaea,stroke:#b03a3a
    style E fill:#eef1fb,stroke:#3a4fb0
```

## What this shows

- The app has no backend server or API of its own. Everything except images/video is bundled inside the app at build time.
- The only outbound network call the code makes is to Cloudinary, over HTTPS, purely to fetch public images and video for display. Nothing is sent to Cloudinary, only requested from it.
- No user data is collected, stored, or transmitted. No login, no forms, no AsyncStorage/SecureStore usage found in the code.
- The VR/panorama viewer writes a self-generated HTML file into the device's local cache and loads it into an in-app WebView. This stays entirely on-device; nothing here leaves the phone.

This is the same conclusion documented in `1. Network Architecture Diagram Template.txt`, `2. Data Flow Diagram Template.txt`, and `4. Mobile App Source Code Review Report Template.txt` - this file just gives it as a visual diagram alongside those write-ups.
