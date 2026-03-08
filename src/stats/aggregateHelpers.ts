import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import { EmotionGroup } from "src/entities/IEmotionGroup";

export interface IAggregateData {
    labels: string[];
    values: number[];
    colors: string[];
}

const PALETTE = [
    "#36a2eb", "#ff6384", "#ffce56", "#4bc0c0", "#9966ff",
    "#ff9f40", "#c9cbcf", "#7bc67e", "#e06eaa", "#56b4d3",
];

function colorFromPalette(index: number): string {
    return PALETTE[index % PALETTE.length];
}

/**
 * Count of entries per mood rating (1-5).
 */
export function aggregateByMoodRating(
    entries: IMoodTrackerEntry[],
    moodRatingLabelDict: { [key: number]: string },
): IAggregateData {
    const ratings = Object.keys(moodRatingLabelDict)
        .map(Number)
        .sort((a, b) => a - b);

    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];

    ratings.forEach((r, i) => {
        labels.push(moodRatingLabelDict[r] ?? String(r));
        values.push(entries.filter((e) => e.moodRating === r).length);
        colors.push(colorFromPalette(i));
    });

    return { labels, values, colors };
}

/**
 * Top N emotions by frequency.
 */
export function aggregateByEmotion(
    entries: IMoodTrackerEntry[],
    topN = 10,
): IAggregateData {
    const counts = new Map<string, number>();
    for (const entry of entries) {
        for (const emotion of entry.emotions) {
            counts.set(emotion, (counts.get(emotion) ?? 0) + 1);
        }
    }

    const sorted = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN);

    return {
        labels: sorted.map(([e]) => e),
        values: sorted.map(([, c]) => c),
        colors: sorted.map((_, i) => colorFromPalette(i)),
    };
}

/**
 * Count of emotion occurrences grouped by emotion group.
 * Uses each group's own color.
 */
export function aggregateByEmotionGroup(
    entries: IMoodTrackerEntry[],
    emotionGroups: EmotionGroup[],
): IAggregateData {
    const allEmotions: string[] = entries.flatMap((e) => e.emotions);

    const labels: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];

    for (const group of emotionGroups) {
        const groupEmotionSet = new Set(group.emotions.map((e) => e.toLowerCase()));
        const count = allEmotions.filter((e) => groupEmotionSet.has(e.toLowerCase())).length;
        labels.push(group.name);
        values.push(count);
        colors.push(group.color);
    }

    return { labels, values, colors };
}

/**
 * Average mood rating per day of the week. (Mon-Sun)
 */
export function aggregateByDayOfWeek(
    entries: IMoodTrackerEntry[],
): IAggregateData {
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const sums = new Array(7).fill(0);
    const counts = new Array(7).fill(0);

    for (const entry of entries) {
        const date = new Date(entry.dateTime);
        // JS getDay(): 0=Sun … 6=Sat → shift to Mon=0 … Sun=6
        const dow = (date.getDay() + 6) % 7;
        sums[dow] += entry.moodRating;
        counts[dow] += 1;
    }

    const values = sums.map((s, i) =>
        counts[i] > 0 ? Math.round((s / counts[i]) * 10) / 10 : 0,
    );

    return {
        labels: dayNames,
        values,
        colors: dayNames.map((_, i) => colorFromPalette(i)),
    };
}
