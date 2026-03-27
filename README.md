# illenium-appearance

A replacement for clothing resources for various frameworks

<div align='center'><h1><a href='https://docs.illenium.dev/free-resources/illenium-appearance/installation/'>Documentation</a></h3></div>
<br>

<img src="https://r2.fivemanage.com/m4VWZLZoULSXNOFGfRETN/Screenshot2026-03-27075003.png" alt="illenium-appearance with Tattoos" />
<img src="https://r2.fivemanage.com/m4VWZLZoULSXNOFGfRETN/Screenshot2026-03-27074948.png" alt="illenium-appearance with Tattoos" />
<img src="https://r2.fivemanage.com/m4VWZLZoULSXNOFGfRETN/Screenshot2026-03-27074927.png" alt="illenium-appearance with Tattoos" />
<img src="https://r2.fivemanage.com/m4VWZLZoULSXNOFGfRETN/Screenshot2026-03-27074121.png" alt="illenium-appearance with Tattoos" />
<img src="https://r2.fivemanage.com/m4VWZLZoULSXNOFGfRETN/Screenshot2026-03-27075057.png" alt="illenium-appearance with Tattoos" />

Discord: https://discord.illenium.dev

**Note:** Do **NOT** use the `main` branch as it will most likely be broken for you. NO SUPPORT WILL BE PROVIDED IF YOU USE IT. Only use the [latest release](https://github.com/iLLeniumStudios/illenium-appearance/releases/latest)

## Supported Frameworks

- qb-core
- ESX
- ox_core

## Dependencies

- [qb-core](https://github.com/qbcore-framework/qb-core) (Latest) (Only for qb-core based servers)
- [es_extended](https://github.com/esx-framework/esx-legacy) (Latest) (Only for ESX based servers)
- [ox_core](https://github.com/overextended/ox_core) (experimental) (Only for ox_core based servers)
- [ox_lib](https://github.com/overextended/ox_lib)
- [qb-target](https://github.com/BerkieBb/qb-target) (Optional) (Only for qb-core based servers)

## Features

- Everything from standalone fivem-appearance
- UI from OX Lib
- Player outfits
- Rank based Clothing Rooms for Jobs / Gangs
- Job / Gang locked Stores
- Tattoo's Support
- Hair Textures
- Polyzone Support
- Ped Menu command (/pedmenu) (Configurable)
- Reload Skin command (/reloadskin)
- Improved code quality
- Plastic Surgeons
- qb-target Support
- Skin migration support (qb-clothing / old fivem-appearance / esx_skin)
- Player specific outfit locations (Restricted via CitizenID)
- Makeup Secondary Color
- Blacklist / Limit Components & Props to certain Jobs / Gangs / CitizenIDs / ACEs (Allows you to have VIP clothing on your Server)
- Blacklist / Limit Peds to certain Jobs / Gangs / CitizenIDs / ACEs
- Persist Job / Gang Clothes on reconnects / logout
- Themes Support (Default & QBCore provided out of the box)
- Disable Components / Props Entirely (Clothing as items support)

## Custom Server Changes (This Build)

This server has significant custom work beyond upstream `illenium-appearance`.  
Use this section as the source of truth for what was added/changed.

### 1) Internal UI System (Menu/TextUI/Notify)

- Added internal menu mode: `Config.MenuSystem = "internal"` (or `"ox_lib"` fallback)
- Added full internal menu NUI bridge in `client/client.lua`:
  - open/close/select
  - internal import/save/generate outfit flows
  - internal store admin create/edit/delete submit callbacks
- Added React internal menu UI in `web/src/components/InternalMenu/index.tsx`:
  - inline dropdown submenu behavior
  - inline forms for import/save/generate
  - inline forms for store create/edit and delete confirm
- Added internal TextUI prompt system:
  - `web/src/components/InternalTextUI/index.tsx`
  - `client/zones.lua` sends `internal_textui_show` / `internal_textui_hide` in internal mode
- Added internal notification system:
  - `web/src/components/InternalNotify/index.tsx`
  - `client/client.lua` + `server/server.lua` route notify payloads to NUI in internal mode

### 2) Store Admin System (`/storeadmin`)

- Added runtime DB-backed store system:
  - `server/database/stores.lua`
  - SQL schema: `sql/appearance_stores.sql`
- Added store admin command and permissions:
  - command: `/storeadmin`
  - config: `Config.EnableStoreAdminMenu`, `Config.StoreAdminAce`
  - permission check: `isStoreAdmin(source)` in `server/server.lua`
- Added dynamic store CRUD server events:
  - `illenium-appearance:server:addStore`
  - `illenium-appearance:server:updateStore`
  - `illenium-appearance:server:deleteStore`
- Added store callbacks:
  - `illenium-appearance:server:getStores`
  - `illenium-appearance:server:getDynamicStores`
- Added client admin menus:
  - `client/admin_stores.lua`
  - create/manage/edit/delete DB stores
- Added live client sync (no full restart needed after CRUD):
  - `syncStoresToClients()` pushes merged stores (static + DB) to all clients
- Added dynamic store usage in client systems:
  - zones, blips, and target read server-provided store set

### 3) Camera + Drag + Zoom Controls

- Added web drag controls in `web/src/components/Appearance/index.tsx`:
  - `Drag L/R` rotates ped
  - `Drag U/D` moves camera up/down
  - `Wheel` zoom in/out
- Added NUI camera callbacks in `game/nui.lua`:
  - `appearance_rotate_ped`
  - `appearance_pan_camera`
  - `appearance_zoom_camera`
- Added backend camera control methods in `game/customization.lua`:
  - `client.rotatePed(...)`
  - `client.panCamera(...)`
  - `client.zoomCamera(...)`
- Camera stability fix:
  - pan now uses stable world-space camera base tracking to avoid angle snapping after ped rotation

### 4) UI/Visual Overhaul

- Applied custom neon/glass styling across web UI:
  - appearance panels, sidebar, controls, modal surfaces
- Added global style customizations in `web/src/styles/global.tsx`:
  - transparent page/base layers for CEF compatibility
  - custom font mapping (`Grift` + fallback)
  - global white text and icon rules
- Updated slider/input UX:
  - steppers converted to sliders
  - right-side numeric value editing support
- Added internal section scrolling behavior for long component lists

### 5) Internal Outfit Flow Updates

- Internal versions of:
  - Import Outfit
  - Save Outfit
  - Generate Outfit Code
- Kept compatibility with existing outfit backend callbacks/events
- Added inline behavior so actions happen inside the same internal card flow

### 6) Other Runtime Behavior Updates

- Added internal mode zone prompt behavior (instead of ox_lib text UI)
- Added internal mode notification routing for store admin feedback
- Kept upstream compatibility paths for non-internal (`ox_lib`) mode

### 7) Feature Removed During Iteration

- The temporary clothing whitelist system that was prototyped in a previous pass was removed from runtime/manifest/database wiring.
- Current build does **not** include active clothing whitelist management features.

### 8) Important Config Values in This Build

- `Config.MenuSystem = "internal"` (current default in this repo)
- `Config.EnableStoreAdminMenu = true`
- `Config.StoreAdminAce = "group.admin"`

## New Preview (with Tattoos)

https://streamable.com/qev2h7

## Documentation

Read the docs here: https://docs.illenium.dev

## Credits
- Original Script: https://github.com/pedr0fontoura/fivem-appearance
- Tattoo's Support: https://github.com/franfdezmorales/fivem-appearance
- Last Maintained Fork for QB: https://github.com/mirrox1337/aj-fivem-appearance
