# mc-modmanager

An application for managing minecraft mods.

Currently users can:
- See currently installed mods
- Add mods
- Delete (all) mods
- Replace mod(s)

## Todo

- Read archive info json
- Modify values inside archive info json
- Show errors to user
- Show progess bar when adding, deleting or replacing mods.

## Live Development

To run in live development mode, run `wails dev` in the project directory. In another terminal, go into the `frontend`
directory and run `npm run dev`. The frontend dev server will run on http://localhost:34115. Connect to this in your
browser and connect to your application.

## Building

To build a redistributable, production mode package, use `wails build`.
