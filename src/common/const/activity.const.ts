import { Activity } from '../enum/activity.enum';

interface IActivityValue {
	[key: string]: number;
}

export const ActivityValue: IActivityValue = {
	[Activity.SEDENTARY]: 1.2,
	[Activity.LIGHTLY]: 1.375,
	[Activity.MODERATELY]: 1.55,
	[Activity.VERY]: 1.725,
	[Activity.EXTRA]: 1.9,
};
