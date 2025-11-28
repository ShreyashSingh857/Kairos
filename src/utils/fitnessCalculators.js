import { differenceInYears } from 'date-fns';

export const ACTIVITY_MULTIPLIERS = {
    sedentary: 1.2,      // Little or no exercise
    light: 1.375,        // Light exercise 1-3 days/week
    moderate: 1.55,      // Moderate exercise 3-5 days/week
    active: 1.725        // Hard exercise 6-7 days/week
};

export const EXERCISE_METS = {
    'Walking (Slow)': 2.5,
    'Walking (Brisk)': 3.5,
    'Running (Jog)': 7.0,
    'Running (Fast)': 10.0,
    'Cycling (Light)': 4.0,
    'Cycling (Vigorous)': 8.0,
    'Gym / Weight Training': 5.0,
    'Swimming': 6.0,
    'Yoga': 2.5,
    'HIIT': 8.0,
    // Gym Exercises
    'Bench Press': 6.0,
    'Squats': 6.0,
    'Deadlifts': 6.0,
    'Overhead Press': 5.0,
    'Pull Ups': 8.0,
    'Dumbbell Rows': 5.0,
    'Bicep Curls': 4.0,
    'Tricep Extensions': 4.0,
    'Leg Press': 5.5,
    'Lat Pulldowns': 5.0,
    'Lunges': 5.5,
    'Calf Raises': 4.0,
    'Chest Fly': 5.0,
    'Tricep Dips': 6.0,
    'Skipping / Jump Rope': 10.0,
    'Elliptical': 5.0
};

export const GYM_EXERCISES = [
    'Bench Press',
    'Squats',
    'Deadlifts',
    'Overhead Press',
    'Pull Ups',
    'Dumbbell Rows',
    'Bicep Curls',
    'Tricep Extensions',
    'Leg Press',
    'Lat Pulldowns',
    'Lunges',
    'Calf Raises',
    'Chest Fly',
    'Tricep Dips'
];

export function calculateBMR(weight, height, gender, dob) {
    if (!weight || !height || !gender || !dob) return 0;

    const age = differenceInYears(new Date(), new Date(dob));

    // Mifflin-St Jeor Equation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age);

    if (gender === 'male') {
        bmr += 5;
    } else {
        bmr -= 161;
    }

    return Math.max(0, Math.round(bmr));
}

export function calculateTDEE(bmr, activityLevel) {
    const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
    return Math.max(0, Math.round(bmr * multiplier));
}

export function calculateExerciseCalories(weight, exerciseType, durationMinutes) {
    if (!weight || !durationMinutes) return 0;

    const met = EXERCISE_METS[exerciseType] || 4.0; // Default to moderate activity
    const durationHours = durationMinutes / 60;

    // Formula: Calories = MET * Weight(kg) * Duration(hr)
    return Math.max(0, Math.round(met * weight * durationHours));
}
