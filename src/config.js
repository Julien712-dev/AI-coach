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
        }],
        exerciseHabitOptions: [
            {
                label: 'Sedentary (Little to none).',
                value: 'sedentary',
            },
            {
                label: 'Medium (Daily walk/basic workout).',
                value: 'medium',
            },
            {
                label: 'Extensive (Regular exercise habits).',
                value: 'extensive',
            },
        ],
        dietHabitOptions: [
            {
                label: 'Lose Weight',
                value: 'loseWeight',
            },
            {
                label: 'Stay in Shape',
                value: 'stayInShape',
            },
            {
                label: 'Gain Muscles',
                value: 'gainMuscles',
            }
        ],
        dietRestrictions: [
            {
                label: 'Vegetarian',
                value: 'vegetarian',
                disableIfSelected: ['meat']
            },
            {
                label: 'Meat Lover',
                value: 'meat',
                disableIfSelected: ['vegetarian']
            },
            {
                label: 'No Fasting',
                value: 'noFasting',
            }
        ],
        foodAllergies: [
            {
                label: 'Lactose Intolerant',
                value: 'lactose',
            },
            {
                label: 'Nuts',
                value: 'nuts',
            },
            {
                label: 'Seafood',
                value: 'seafood',
            }
        ]
    },
    messages: {
        diet: [
            {
                time: `midnight`,
                meal: `breakfast`,
                startAt: 0,
                endAt: 6,
                title: ``,
                message: `Time for a good-night sleep and prepare for the amazing journey tomorrow!`,
                weight: 0.25
            },
            {
                time: `morning`,
                meal: `breakfast`,
                startAt: 6,
                endAt: 11,
                title: `Good morning!`,
                message: `We got you. It's time for a nice breakfast!`,
                weight: 0.25
            },
            {
                time: `afternoon`,
                meal: `lunch`,
                startAt: 11,
                endAt: 15,
                title: `Yay! Lunch time!`,
                message: `Just treat yourself better!`,
                weight: 0.3,
            },
            {
                time: `evening`,
                meal: `snack`,
                startAt: 15,
                endAt: 18,
                title: `Tea time!`,
                message: `Grab a snack if you feel like having one.`,
                weight: 0.15
            },
            {
                time: `night`,
                meal: `dinner`,
                startAt: 18,
                endAt: 24,
                title: `Dinner's ready!`,
                message: `Feel like a feast? Or planning to go clean?`,
                weight: 0.3
            }
        ]
    },
    palValueMap: {
        'sedentary': 1.4,
        'medium': 1.6,
        'extensive': 1.8
    },
    nutritionPerGramToKcal: {
        'protein': 4,
        'carb': 4,
        'fat': 9
    },
    referenceNuritionValues: {
        1.4: {
            6: {
                M: 1500,
                F: 1500
            },
            11: {
                M: 2300,
                F: 1600
            },
            15: {
                M: 2600,
                F: 2000
            },
            19: {
                M: 2400,
                F: 1900
            },
            25: {
                M: 2300,
                F: 1800
            }, 
            51: {
                M: 2200,
                F: 1700
            },
            65: {
                M: 2100,
                F: 1600
            }
        }, 
        1.6: {
            6: {
                M: 1600,
                F: 1600
            },
            11: {
                M: 2400,
                F: 1800
            },
            15: {
                M: 3000,
                F: 2300
            },
            19: {
                M: 2800,
                F: 2200
            },
            25: {
                M: 2700,
                F: 2100
            }, 
            51: {
                M: 2500,
                F: 2000
            },
            65: {
                M: 2500,
                F: 1900
            }
        },
        1.8: {
            6: {
                M: 1700,
                F: 1700
            },
            11: {
                M: 2500,
                F: 1900
            },
            15: {
                M: 3400,
                F: 2600
            },
            19: {
                M: 3100,
                F: 2500
            },
            25: {
                M: 3000,
                F: 2400
            }, 
            51: {
                M: 2800,
                F: 2300
            },
            65: {
                M: 2800,
                F: 2200
            }
        }
    }
}