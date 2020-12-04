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
        },
        heightUnits: [{
            label: 'cm', 
            value: 'cm'
        }, {
            label: 'inches', 
            value: 'inches'
        }],
        weightUnits: [{
            label: 'kg',
            value: 'kg'
        }, {
            label: 'lbs', 
            value: 'lbs'
        }],
        genderValues: [{
            label: 'Male',
            value: 'M',
        }, {
            label: 'Female',
            value: 'F',
        }]
    },
    messages: {
        diet: [
            {
                time: `midnight`,
                meal: null,
                startAt: 0,
                endAt: 6,
                title: ``,
                message: `Time for a good-night sleep and prepare for the amazing journey tomorrow!`,
            },
            {
                time: `morning`,
                meal: `breakfast`,
                startAt: 6,
                endAt: 11,
                title: `Good morning!`,
                message: `We got you. It's time for a nice breakfast!`,
            },
            {
                time: `afternoon`,
                meal: `lunch`,
                startAt: 11,
                endAt: 15,
                title: `Yay! Lunch time!`,
                message: `Just treat yourself better!`,
            },
            {
                time: `evening`,
                meal: `snack`,
                startAt: 15,
                endAt: 18,
                title: `Tea time!`,
                message: `Grab a snack if you feel like having one.`,
            },
            {
                time: `night`,
                meal: `dinner`,
                startAt: 18,
                endAt: 24,
                title: `Dinner's ready!`,
                message: `Feel like a feast? Or planning to go clean?`,
            }
        ]
    }
}