# Mood Tracker
Mood Tracker for Obsidian.md, inspired by [Amazing Marvin's](https://amazingmarvin.com/) Mood Tracker.

## Why this plugin?
While you definitely can build a mood tracking system in Obsidian with markdown files, metadata and Dataview, it can be tedious to maintain and use.
This plugin provides a clean, user-friendly alternative with a lot of "batteries included".
The data is stored in your vault, in plain JSON.

## Track Your Moods & Emotions
Track your overall mood with "mood rating"; customize mood labels.
Add nuanced emotions, if needed (fully customizable).
Add notes to entries.

[See demo](#mood-tracking)

## The history at a glance
Visualize your mood history on a graph.
See your average and most common moods and emotions.
Click on a point on a graph to see that day's details.
[See demo](#history-and-stats)
You can also edit past entries and add new entries for past days.
[See demo](#edit-past-entries)

#### Embeddable graph
You can embed the graph into a note with codeblock:
```mood-tracker-stats
end: current-week
daysBeforeEnd: 90
showAverage: true
showMostCommonMood: true
showCommonEmotionsList: true
height: 500px
```

Options:
- end: date in "YYYY-MM-DD" format, or dynamic date ("today", "current-week" (end of), "previous-week" (end of), "current-month" (end of), "previous-month" (end of))
- daysBeforeEnd: number of days to show
- showAverage: show average mood rating (defaults to false)
- showMostCommonMood: show the most common emotion (defaults to false)
- showCommonEmotionsList: show a list of the most common emotions (defaults to false)
- height: height of the graph (pixels, %, anything that `style` attribute of HTML element would support) (defaults to 350px)
- width: the same as height (defaults to 100%)

For example, this codeblock will render records for the current month, with no additional info:

```mood-tracker-stats
end: current-month
daysBeforeEnd: 39
```



## Roadmap
- [x] Customize mood emojis
- [ ] Customize graph colors
- [ ] More chart types
- [x] Edit past entries
- [x] Emotion sections / blocks
- [ ] Export data
- [ ] Import data
- [ ] Add data to daily notes

## Demos
#### Mood tracking
![mood-tracker-sections-demo](https://github.com/dartungar/obsidian-mood-tracker/assets/36126057/cdef3563-dbee-4bb6-b52e-78c09ba4d826)

#### History and stats
![mood-tracker-stats-demo](https://github.com/dartungar/obsidian-mood-tracker/assets/36126057/7031bf7b-3e5d-4bfc-89bb-099d5f3c32fa)

#### Edit past entries
![mood-tracker-edit-history-demo](https://github.com/dartungar/obsidian-mood-tracker/assets/36126057/2a5b325d-8737-4c94-9aee-de2476feebbc)
