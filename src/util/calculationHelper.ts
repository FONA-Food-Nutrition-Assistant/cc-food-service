import { Activity } from '../common/enum/activity.enum';
import { ActivityValue } from '../common/const/activity.const';
import { Gender } from '../common/enum/gender.enum';

export class CalculationHelper {
	calculateAge(dateOfBirth: Date) {
		return new Date().getFullYear() - new Date(dateOfBirth).getFullYear();
	}

	calculateBMI(weight: number, height: number) {
		return weight / Math.pow(height / 100, 2);
	}

	calculateTDEE(
		weight: number,
		height: number,
		age: number,
		gender: Gender,
		activity: Activity,
	) {
		const activityValue = ActivityValue[activity];
		let bmr: number;
		if (gender === Gender.MALE) {
			bmr = 10 * weight + 6.25 * height - 5 * age + 5;
		} else {
			bmr = 10 * weight + 6.25 * height - 5 * age - 161;
		}
		const tdee = bmr * activityValue;
		return tdee;
	}
}
