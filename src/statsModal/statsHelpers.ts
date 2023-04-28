import { IDayStats } from "src/entities/IDayStats";
import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";

export function getAverageMoodRatingByDay(entries: IMoodTrackerEntry[]): IDayStats[] {
    const entriesByDay = entries.reduce((acc, entry) => {
        const day = entry.dateTime.toISOString().split('T')[0];
        const dayEntries = acc.get(day) ?? [];
        dayEntries.push(entry);
        acc.set(day, dayEntries);
        return acc;
    }, new Map<string, IMoodTrackerEntry[]>());

    const dayStats: IDayStats[] = [];
    entriesByDay.forEach((dayEntries, day) => {
        console.log(dayEntries, dayEntries.reduce((acc, entry) => acc + entry.moodRating, 0));
        const dayStat: IDayStats = {
            date: day,
            moodRating: Math.round(dayEntries.reduce((acc, entry) => acc + entry.moodRating, 0) / dayEntries.length * 10) / 10,
            emotions: dayEntries.reduce((acc, entry) => [...acc, ...entry.emotions], [])
        };
        dayStats.push(dayStat);
    });

    return dayStats;
}

export function generateStringDatesForNdays(n: number): string[] {
    // create a new date object for today's date
    const today = new Date();

    // set the time to 00:00:00 to avoid timezone issues
    today.setHours(0, 0, 0, 0);

    // create an array to hold the date strings
    const dates = [];

    // loop through the last 14 days
    for (let i = n-1; i >= 0; i--) {
    // create a new date object for the current date in the loop
    const date = new Date(today);
    
    // subtract i days from the current date
    date.setDate(date.getDate() - i);
    
    // format the date string as yyyy-MM-dd
    const dateString = date.toISOString().split('T')[0];
    
    // add the formatted date string to the array
    dates.push(dateString);
    }

    // print the array of dates to the console
    return dates;
}