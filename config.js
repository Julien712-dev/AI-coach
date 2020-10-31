module.exports = {
    constants: {
        midnight: {
            startAt: 0,
            endAt: 6
        },
        morning: {
            startAt: 6,
            endAt: 11
        },
        afternoon: {
            startAt: 11,
            endAt: 15
        },
        evening: {
            startAt: 15,
            endAt: 18
        },
        night: {
            startAt: 18,
            endAt: 24
        }
    },
    messages: {
        diet: [
            {
                time: `midnight`,
                meal: null,
                startAt: 0,
                endAt: 6,
                message: `Time for a good-night sleep and prepare for the amazing journey tomorrow!`,
            },
            {
                time: `morning`,
                meal: `breakfast`,
                startAt: 6,
                endAt: 11,
                message: `Good morning!! There's a new day upon you!`,
            },
            {
                time: `afternoon`,
                meal: `lunch`,
                startAt: 11,
                endAt: 15,
                message: `Yay it's lunch time! Better treat yourself better!`,
            },
            {
                time: `evening`,
                meal: `snack`,
                startAt: 15,
                endAt: 18,
                message: `Your're probably hungry at the moment. Grab some snack if you want!`,
            },
            {
                time: `night`,
                meal: `dinner`,
                startAt: 18,
                endAt: 24,
                message: `Dinner's ready, and we're all excited for that!`,
            }
        ]
    }
}