# mc-modmanager

An application for managing minecraft mods.

Currently users can:
- see currently installed mods
- add mods
- delete (all) mods

## Todo

- replace mod(s)
- read archive info json
- modify values inside archive info json

## Live Development

To run in live development mode, run `wails dev` in the project directory. In another terminal, go into the `frontend`
directory and run `npm run dev`. The frontend dev server will run on http://localhost:34115. Connect to this in your
browser and connect to your application.

## Building

To build a redistributable, production mode package, use `wails build`.
