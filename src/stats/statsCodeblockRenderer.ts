import MoodTrackerPlugin from "src/main";
import { IStatsCodeblockConfig } from "./IStatsCodeblockConfig";
import { generateDatasetForDateRange, getMostCommonEmotions, getMostCommonMoodRating, getTotalAverageMoodRating } from "src/stats/statsHelpers";
import BarChart from "./charts/BarChart.svelte";
import LineChart from "./charts/LineChart.svelte";
import { IMoodTrackerEntry } from "src/entities/MoodTrackerEntry";
import { IDayStats } from "src/entities/IDayStats";

export const STATS_CODEBLOCK_NAME = "mood-tracker-stats";

const defaultConfig: IStatsCodeblockConfig = {
	daysBeforeEnd: 14,
	end: "today",
	showAverage: false,
	showMostCommonMood: false,
	showCommonEmotionsList: false,
    height: "350px",
    width: "100%",
    chartType: "bar"
};

export class StatsCodeblockRenderer {
	private _config: IStatsCodeblockConfig;
    private _stats: IDayStats[];

	constructor(
		code: string,
		private parentEl: HTMLElement,
		private _plugin: MoodTrackerPlugin
	) {
		const config = this.parseConfig(code);
		if (config === null) {
			return;
		}

        this._config = config;
	}



	render(): void {
		const rawData: IMoodTrackerEntry[] = this._plugin?.entries ?? [];
		const endDate = this.getEndDate(this._config.end);
		const startDate = window
			.moment(endDate)
			.subtract(this._config.daysBeforeEnd, "days")
			.toDate();
		const processedData = generateDatasetForDateRange(
			rawData,
			startDate,
			endDate
		);

        this._stats = processedData;

        const containerEl = this.parentEl.createDiv("mood-tracker-stats-codeblock");

        containerEl.style.height = this._config.height;
        containerEl.style.width = this._config.width;

		new (this._config.chartType === 'line' ? LineChart : BarChart)({
			target: containerEl,
			props: {
				data: processedData,
				plugin: this._plugin
			},
		});

        if (this._config.showAverage) {
            this.renderAverage(this.parentEl);
        }

        if (this._config.showMostCommonMood) {
            this.renderMostCommonMood(this.parentEl);
        }

        if (this._config.showCommonEmotionsList) {
            this.renderCommonEmotionsList(this.parentEl);
        }
	}


	getEndDate(rangeEndRaw: string): Date {
		switch (rangeEndRaw) {
			case "today":
				return new Date();
			case "previous-month":
				return window
					.moment()
					.subtract(1, "months")
					.endOf("month")
					.toDate();
			case "current-month":
				return window.moment().endOf("month").toDate();
			case "previous-week":
				return window
					.moment()
					.subtract(1, "weeks")
					.endOf("isoWeek")
					.toDate();
			case "current-week":
				return window.moment().endOf("isoWeek").toDate();
			default:
				try {
					return new Date(rangeEndRaw);
				} catch (error) {
					this._plugin.showNotice(
						`Mood Tracker: error parsing date ${rangeEndRaw}.`
					);
					throw error;
				}
		}
	}

    renderAverage(containerEl: HTMLElement): void {
        const averageMoodRating = getTotalAverageMoodRating(this._stats);
        const text = `Average mood: ${this._plugin.settings.moodRatingLabelDict[Math.round(averageMoodRating)]} (${averageMoodRating})`;
        containerEl.createDiv({text: text})
    }

    renderMostCommonMood(containerEl: HTMLElement) {
        const mostCommonMood = getMostCommonMoodRating(this._plugin.entries);
        const text = `Most common mood: ${this._plugin.settings.moodRatingLabelDict[mostCommonMood]}`;
        containerEl.createDiv({text: text})
    }

    renderCommonEmotionsList(containerEl: HTMLElement) {
        const mostCommonEmotions = getMostCommonEmotions(this._stats, 3);
        const text = `Common emotions: ${mostCommonEmotions.join(', ')}`;
        containerEl.createDiv({text: text})
    }


    parseConfig(configStr: string): IStatsCodeblockConfig | null {
		const configLines = configStr
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line);
		const config = defaultConfig;

		for (const line of configLines) {
			const [key, value] = line.split(":").map((part) => part.trim());

			// You might want to handle the possibility of an invalid line here

			switch (key) {
                case "end":
                    config.end = value;
                    break;
				case "daysBeforeEnd":
					config.daysBeforeEnd = Number.parseInt(value);
					break;
				case "showAverage":
					config.showAverage = value.toLowerCase() === "true";
					break;
				case "showMostCommonMood":
					config.showMostCommonMood = value.toLowerCase() === "true";
					break;
				case "showCommonEmotionsList":
					config.showCommonEmotionsList = value.toLowerCase() === "true";
					break;
				case "chartType":
					if (value === "line" || value === "bar") {
						config.chartType = value;
					}
					break;
				// Here you may want to handle any unexpected keys or provide error handling
			}            
		}

		return config;
	}
}
