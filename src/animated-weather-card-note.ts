// Entry point for the lazy-loaded note bundle.
//
// The main bundle doesn't include the note writer. A card with show_note on
// injects a <script> for this bundle the first time it needs it; loading it
// hands the writer class to the card through a window global (the two
// bundles don't share a module scope).

import { NoteWriter } from './note-generator';

window.AnimatedWeatherCardNote = NoteWriter;
