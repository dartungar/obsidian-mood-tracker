export type ChartType = 'bar' | 'line';

export interface IStatsCodeblockConfig {
    end: string;
    daysBeforeEnd: number;
    showAverage: boolean;
    showMostCommonMood: boolean;
    showCommonEmotionsList: boolean;
    height: string;
    width: string;
    chartType: ChartType;
}