export const MOOD_DATA = {
    1: {
        label: "Rough Day",
        emoji: "😔",
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        quotes: [
            "This too shall pass. Hang in there.",
            "Stars can't shine without darkness.",
            "It's okay not to be okay sometimes.",
            "Take a deep breath. You've got this.",
            "Tomorrow is a fresh start.",
            "You are stronger than you know.",
            "Storms don't last forever.",
            "Be gentle with yourself today.",
            "One step at a time.",
            "Sending you a virtual hug.",
            "Your feelings are valid.",
            "Rest if you must, but don't you quit.",
            "Every day may not be good, but there's something good in every day.",
            "You have survived 100% of your bad days.",
            "Treat yourself with kindness today."
        ]
    },
    2: {
        label: "Not Great",
        emoji: "😕",
        color: "text-orange-500",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        quotes: [
            "Keep going, you're doing better than you think.",
            "Small steps are still progress.",
            "Don't let a bad moment ruin a good day.",
            "Focus on the good.",
            "You are capable of amazing things.",
            "Head up, heart open.",
            "Believe in yourself.",
            "Today is just one chapter, not the whole story.",
            "Be patient with your growth.",
            "You are enough just as you are.",
            "Inhale courage, exhale fear.",
            "Progress, not perfection."
        ]
    },
    3: {
        label: "Okay",
        emoji: "😐",
        color: "text-yellow-500",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/20",
        quotes: [
            "Peace is a priority.",
            "Balance is key.",
            "Keep moving forward.",
            "Stay focused on your goals.",
            "A calm mind is a powerful weapon.",
            "Serenity comes from within.",
            "You are doing just fine.",
            "Consistency is the key to success.",
            "Stay grounded.",
            "Embrace the ordinary moments."
        ]
    },
    4: {
        label: "Good",
        emoji: "🙂",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        quotes: [
            "Keep that smile!",
            "You're on the right track.",
            "Spread the positivity.",
            "Great job today!",
            "Your energy is contagious.",
            "Keep up the good work.",
            "Happiness looks good on you.",
            "Enjoy this moment.",
            "You are glowing!",
            "Positive vibes only."
        ]
    },
    5: {
        label: "Amazing",
        emoji: "🤩",
        color: "text-green-500",
        bg: "bg-green-500/10",
        border: "border-green-500/20",
        quotes: [
            "You are unstoppable!",
            "Radiate that energy!",
            "The world is your oyster!",
            "Keep shining!",
            "You are on fire!",
            "Nothing can stop you now.",
            "Celebrate your wins!",
            "You are a superstar!",
            "Keep crushing it!",
            "Your potential is endless!"
        ]
    }
};

export const getRandomQuote = (rating) => {
    const data = MOOD_DATA[rating];
    if (!data) return "How are you feeling today?";
    const quotes = data.quotes;
    return quotes[Math.floor(Math.random() * quotes.length)];
};
