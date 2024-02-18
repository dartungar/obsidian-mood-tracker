import { IDayStats } from "src/entities/IDayStats";
import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";

export function generateDatasetForDateRange(entries: IMoodTrackerEntry[], start: Date | string, end: Date | string): IDayStats[] {
    // TODO: generate data only if there are entries for the date range
    const dayStats = getAverageMoodRatingByDay(entries);
    const days = generateStringDatesForDateRange(start, end);

    const dataset: IDayStats[] = days.map(day => {
        const stat = dayStats.find(x => x.date == day);

        return {
            date: day, 
            moodRating: stat?.moodRating,
            emotions: stat?.emotions ?? []
        };

    });

    return dataset;
 }

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
        const dayStat: IDayStats = {
            date: day,
            moodRating: Math.round(dayEntries.reduce((acc, entry) => acc + entry.moodRating, 0) / dayEntries.length * 10) / 10,
            emotions: dayEntries.reduce((acc, entry) => [...acc, ...entry.emotions], [])
        };
        dayStats.push(dayStat);
    });

    return dayStats;
}

export function getTotalAverageMoodRating(stats: IDayStats[]): number {
    const daysWithValues = stats.filter((s) => s.moodRating && s.moodRating > 0);
    const totalMoodRating = daysWithValues.reduce((acc, curr) => acc + curr.moodRating!, 0);
    return Math.round(totalMoodRating / daysWithValues.length * 10) / 10;
}

export function getMostCommonMoodRating(entries: IMoodTrackerEntry[]): number {
    const moodRatings = entries.map((e) => e.moodRating);
    const uniqueMoodRatings = [...new Set(moodRatings)];
    const moodRatingCounts = uniqueMoodRatings.map((m) => {
        return {
            moodRating: m,
            count: moodRatings.filter((a) => a === m).length,
        };
    });
    const sortedMoodRatings = moodRatingCounts.sort((a, b) => b.count - a.count);
    const mostCommonMoodRating = sortedMoodRatings.map((m) => m.moodRating);
    return mostCommonMoodRating[0];
}

export function getMostCommonEmotions(stats: IDayStats[], count: number): string[] {
    const allEmotions = stats.map((s) => s.emotions).flat();
    const uniqueEmotions = [...new Set(allEmotions)];
    const emotionCounts = uniqueEmotions.map((e) => {
        return {
            emotion: e,
            count: allEmotions.filter((a) => a === e).length,
        };
    });
    const sortedEmotions = emotionCounts.sort((a, b) => b.count - a.count);
    const mostCommonEmotions = sortedEmotions.map((e) => e.emotion);
    return mostCommonEmotions.splice(0, count);
}


function generateStringDatesForDateRange(start: Date | string, end: Date | string) : string[] {

    const datesArray = [];
    const startDate = new Date(start);
    const startDateCorrected = startDate.getFullYear() > 2000 ? startDate : new Date("2000-01-01");
    const endDate = new Date(end);
    const currentDate = new Date();
    const endDateCorrected = endDate.getFullYear() > currentDate.getFullYear() ? currentDate : endDate; 
  
    while (startDateCorrected <= endDateCorrected) {
      const formattedDate = startDateCorrected.toISOString().split('T')[0];
      datesArray.push(formattedDate);
      startDateCorrected.setDate(startDateCorrected.getDate() + 1);
    }
  
    return datesArray;

}

export function generateStringDatesForNdays(n: number): string[] {
    // create a new date object for today's date
    const today = new Date();

    // set the time to 00:00:00 to avoid timezone issues
    //today.setHours(0, 0, 0, 0);

    // create an array to hold the date strings
    const dates = [];

    for (let i = n-1; i >= 0; i--) {
        // create a new date object for the current date in the loop
        const date = new Date(today.toISOString());
        
        // subtract i days from the current date
        date.setDate(date.getDate() - i);
        
        // format the date string as yyyy-MM-dd
        const dateString = date.toISOString().split('T')[0];
        
        // add the formatted date string to the array
        dates.push(dateString);
    }

    return dates;
}