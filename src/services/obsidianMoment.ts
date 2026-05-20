import { moment as obsidianMoment } from "obsidian";

interface MomentLike {
	format(format?: string): string;
	subtract(amount: number, unit: string): MomentLike;
	endOf(unit: string): MomentLike;
	toDate(): Date;
}

type ObsidianMoment = (input?: Date | string) => MomentLike;

export const moment = obsidianMoment as unknown as ObsidianMoment;
