import { writable } from "svelte/store";
import type MoodTrackerPlugin from "./main";

const plugin = writable<MoodTrackerPlugin>();
export default { plugin };