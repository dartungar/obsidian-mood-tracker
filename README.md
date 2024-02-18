# Mood Tracker
Mood Tracker for Obsidian.md, inspired by [Amazing Marvin's](https://amazingmarvin.com/) Mood Tracker.

> The data is stored in your vault, in plain JSON, in case you need to use it in another application. 

## Track Your Moods & Emotions
Track your overall mood and more nuanced emotions.
Add notes to entries.

![mood-tracker-sections-demo](https://github.com/dartungar/obsidian-mood-tracker/assets/36126057/cdef3563-dbee-4bb6-b52e-78c09ba4d826)


## See The History
Visualize your mood history on a graph.
See your average and most common moods and emotions.
Click on a point on a graph to see that day's details.

![mood-tracker-stats-demo](https://github.com/dartungar/obsidian-mood-tracker/assets/36126057/7031bf7b-3e5d-4bfc-89bb-099d5f3c32fa)

#### Embed the graph into notes
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

## Edit The History
Edit past entries.
Add new entries for past days.

![mood-tracker-edit-history-demo](https://github.com/dartungar/obsidian-mood-tracker/assets/36126057/2a5b325d-8737-4c94-9aee-de2476feebbc)


## Roadmap
- [ ] Customize mood emojis
- [ ] Customize graph colors
- [ ] More chart types
- [x] Edit past entries
- [x] Emotion sections / blocks
- [ ] Export data
- [ ] Import data
- [ ] Add data to daily notes
- [ ] Read data from daily notes
