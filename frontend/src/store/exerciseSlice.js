import { createSlice } from '@reduxjs/toolkit';
import PushUpVideo from '~/assets/video/push-up.mp4';
import DreamFeetVideo from '~/assets/video/dream-feet.mp4';
import { constants } from '~/src/config';
import { capitalize } from '~/src/Util';

const exerciseLibrary = {
    'Push ups': {
        video: PushUpVideo,
        lengthUnit: 'reps',
        normalLength: 20,
        averageTime: 20,
        intensity: 4,
        focuses: ['arm'],
        instructions: [
            'Get down on all fours, placing your hands slightly wider than your shoulders.',
            'Straighten your arms and legs.',
            'Lower your body until your chest nearly touches the floor.',
            'Pause, then push yourself back up.',
            'Repeat.'
        ]
    },
    'Squats': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        focuses: ['leg', 'glute'],
        instructions: [
            'Stand up with your feet shoulder-width apart.',
            'Bend your knees, press your hips back and stop the movement once the hip joint is slightly lower than the knees.',
            'Press your heels into the floor to return to the initial position.',
            'Repeat.'
        ]
    },
    'Plank': {
        video: DreamFeetVideo,
        lengthUnit: 'seconds',
        normalLength: 60,
        averageTime: 60,
        intensity: 4,
        focuses: ['glute', 'core'],
        instructions: [
            'Get in the pushup position, only put your forearms on the ground instead of your hands. Your elbows should line up directly underneath your shoulders. Toes on the ground.',
            'Squeeze your glutes and tighten your abdominals. Keep a neutral neck and spine.',
            'Create a straight, strong line from head to toes – a plank, if you will.',
            'Hold that position.'
        ]
    },
    'Arm circles': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['arm'],
        normalLength: 30,
        averageTime: 30,
        intensity: 2,
        instructions: [
            'Stand with your feet shoulder-width apart. Extend both arms out straight to your sides to form a T with your body.',
            'Slowly rotate your shoulders and arms to make forward circles about 1 foot in diameter.',
            'Repeat'
        ]
    },
    'Tricep dips': {
        video: DreamFeetVideo,
        lengthUnit: 'seconds',
        focuses: ['arm'],
        normalLength: 20,
        averageTime: 30,
        intensity: 4,
        instructions: [
            'Place your hands shoulder-width apart on the furniture you’re propping yourself up on.',
            'Shift your pelvis and bottom forward so there’s a 3- to 6-inch gap between your back and the object — giving you clearance as you dip down.',
            'Bend your legs in a 90-degree angle with your feet planted firmly on the ground, or extend them out in front of you (but don’t lock your knees).',
            'Slowly lower your body down and back up, focusing on engaging your triceps.',
            'Repeat'
        ]
    },
    'Plank sidewalk': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['arm', 'core'],
        normalLength: 20,
        averageTime: 30,
        intensity: 3,
        instructions: [
            'Begin in an elevated plank position with your arms extended beneath your shoulders and your palms planted firmly on the ground.',
            'Extend your legs behind you with your toes pressing into the floor. Your core should be engaged and in-line with the rest of your body.',
            'Rather than remaining stationary, walk your hands and feet to one side. Take 2 or 3 steps in one direction (or as much as your space allows).',
            'Then, return to your starting spot and take the same amount of steps in the other direction.',
            'Repeat'
        ]
    },
    'Kickboxing punches': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['arm'],
        normalLength: 30,
        averageTime: 30,
        intensity: 3,
        instructions: [
            'Begin your stance with your feet hip-width apart.',
            'Bring your right arm up in a 45-degree angle with your fist just below your jawline.',
            'Extend your arm across your body as you punch your fist at an imaginary target in front of you. Put force behind your punch but don’t overextend your shoulder muscles.',
            'Repeat'
        ]
    },
    'Rolling push ups': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['arm'],
        normalLength: 20,
        averageTime: 20,
        intensity: 5,
        instructions: [
            'Begin in an elevated plank and lower down for a traditional pushup.',
            'Upon returning to your starting position, lift one arm off of the ground, and extend your hand toward the ceiling. Rotate to your back by planting your free arm onto the ground on the opposite side behind you. Lift your other hand toward the sky as you rotate toward an elevated front plank position.',
            'Lower down into a pushup.',
            'Repeat'
        ]
    },
    'Superman': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['arm', 'glute'],
        normalLength: 20,
        averageTime: 25,
        intensity: 3,
        instructions: [
            'Lie on your stomach with your arms and legs extended.',
            'Engage your glutes and shoulders as you simultaneously lift your arms, chest, and legs off of the floor.',
            'Hold this upward position for 3 seconds. You’ll look like superman or superwoman flying through the air.',
            'Slowly come back down to starting position.',
            'Repeat'
        ]
    },
    'Bird dog crunches': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['core', 'glute'],
        normalLength: 20,
        averageTime: 20,
        intensity: 2,
        instructions: [
            'Start on your hands and knees in tabletop position with your wrists stacked under your shoulders and your knees stacked under your hips.',
            'Extend your right arm forward and left leg back, maintaining a flat back and keeping your hips in line with the floor. Think about driving your foot toward the wall behind you.',
            'Squeeze your abs and draw your right elbow and left knee in to meet near the center of your body.',
            'Reverse the movement and extend your arm and leg back out.',
            'Repeat'
        ]
    },
    'Leg lifts': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['core', 'leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Lie faceup with your legs extended and your arms on the floor by your sides. If your lower back needs some extra support, you can place your hands right underneath your butt on each side. This is the starting position.',
            'Slowly lift your legs up and toward your face, keeping them together and stopping when they are about vertical.',
            'Then, slowly lower them back down to the ground. Be sure to keep your back flat on the floor. If you\'re having trouble with that or feel tension in your lower back, don\'t lower your legs as far down.',
            'Repeat'
        ]
    },
    'Dead bug': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['core'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Lie face up with your arms extended toward the ceiling and your legs in a tabletop position (knees bent 90 degrees and stacked over your hips). This is the starting position.',
            'Slowly extend your right leg out straight, while simultaneously dropping your left arm overhead. Keep both a few inches from the ground. Squeeze your butt and keep your core engaged the entire time, lower back pressed into the floor.',
            'Bring your arm and leg back to the starting position.',
            'Repeat on the other side, extending your left leg and your right arm.'
        ]
    },
    'Roll up': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['core'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Lie faceup with your arms extended above your head, resting on the floor.',
            'Float your arms up so your wrists are directly over your shoulders, and begin to slowly curl your spine up and off the floor, starting with your shoulders and ending with your lower back.',
            'Curl up to a seated position, and then continue to fold your torso over your legs, keeping your core tight the entire time.',
            'Reverse the movement to roll back down to the floor, lowering from your lower back to your shoulders.',
            'Repeat'
        ]
    },
    'Bicycle crunches': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['core'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Lie faceup with your legs in tabletop position (knees bent 90 degrees and stacked over your hips). Place your hands behind your head, elbows bent and pointing out to the sides. Use your abs to curl your shoulders off the floor. This is the starting position.',
            'Twist to bring your right elbow to your left knee, while simultaneously straightening your right leg.',
            'Then, twist to bring your left elbow to your right knee, simultaneously straightening your left leg.',
            'Repeat'
        ]
    },
    'Plank up down': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['core', 'glute', 'arm'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Start in high plank with your palms flat on the floor, hands shoulder-width apart, shoulders stacked directly above your wrists, legs extended behind you, and your core and glutes engaged. Place your feet hip-width apart.',
            'Lower your left arm down so that your forearm is on the floor. Then, do the same with your right. You should know be in forearm plank position.',
            'Place your left hand back on the floor to extend your arm, and follow with your right arm, so that you end back in high plank.',
            'Repeat'
        ]
    },
    'Squat Jumps': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'With your feet hip-width apart, squat until your thighs are parallel to the floor.',
            'Jump as high as you can.',
            'Allow your knees to bend 45 degrees when you land, pause in deep squat position for one full second.',
            'Repeat'
        ]
    },
    'Side lunges': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Stand with your feet about twice shoulder-width apart',
            'Keeping your right leg straight, push your hips back and to the left.',
            'Pause for two seconds, and then return to the starting position.',
            'Repeat on the other side.'
        ]
    },
    'Scissor box jumps': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Place your left foot on a box or bench with your right foot on the floor.',
            'In one movement, jump up and switch leg positions in midair.',
            'Pause for one second.',
            'Repeat on the other side.'
        ]
    },
    'Drop lunges': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Stand with your feet hip-width apart, hands on hips. Keep your chest and eyes up, shoulders squared.',
            'Cross your right leg behind your left, and bend both knees, lowering your body until your left thigh is nearly parallel to the floor.',
            'Return to start.',
            'Repeat on the other side.'
        ]
    },
    'Reverse lunges with knee lifts': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Start standing with your feet about shoulder-width apart.',
            'Step backwards with your left foot, landing on the ball of your foot and bending both knees to create two 90-degree angles.',
            'Push through your right heel to return to standing. As you stand up, thrust your left knee toward your chest.',
            'Repeat on the other side.'
        ]
    },
    'High knee toe taps': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Stand facing a bench or box (or a chair if that\'s all you have), hands on hips or by your sides.',
            'Tap your left foot on the bench, then swap legs and tap your right foot, quickly alternating sides.',
            'Keep your back straight and chest lifted the entire time.',
        ]
    },
    'Reverse leg lifts': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['glute'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Lie facedown on the ground, resting your face on your arms bent in front of you.',
            'Using your glute, raise your right leg off of the ground, taking it as high as you can while keeping your hips square to the ground. Flex your ankle throughout the movement.',
            'Repeat on the other side.',
        ]
    },
    'Curtsy squats': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['glute', 'leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Start with your feet shoulder-width apart and your arms down at your hips.',
            'Begin to bend your knees and, on the way down, step your right leg back and to the left in a curtsy motion.',
            'When your left thigh is parallel to the ground, push up through your left heel and back to start.',
            'Repeat on the other side.',
        ]
    },
    'Step ups': {
        video: DreamFeetVideo,
        lengthUnit: 'reps',
        focuses: ['glute', 'leg'],
        normalLength: 20,
        averageTime: 20,
        intensity: 3,
        instructions: [
            'Stand with a bench or step in front of you.',
            'Starting with your right foot, step up onto the bench, lightly tapping your left foot to the surface while keeping your weight in your right heel.',
            'Step your left foot back down to the floor while keeping your right foot on the bench.',
            'Repeat on the other side.',
        ]
    }
}

const focuses = ['arm', 'core', 'leg', 'glute'];

function findExercise(focus) {
    const suitableExercises = Object.entries(exerciseLibrary).filter(([key, value]) => 
        value.focuses.includes(focus)
    );
    return suitableExercises[Math.floor(Math.random() * suitableExercises.length)];
}

function generateEmptyPlan(dayPerWeek, minutePerSession) {
    let days;
    switch (dayPerWeek) {
        case 1: days = { workoutDays: ['sun'], recoveryDays: [], restDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'] }; break;
        case 2: days = { workoutDays: ['sun', 'wed'], recoveryDays: [], restDays: ['mon', 'tue', 'thu', 'fri', 'sat'] }; break;
        case 3: days = { workoutDays: ['mon', 'wed', 'sat'], recoveryDays: [], restDays: ['mon', 'tue', 'thu', 'fri'] }; break;
        case 4: days = { workoutDays: ['mon', 'tue', 'sat'], recoveryDays: ['thu'], restDays: ['wed', 'fri', 'sat', 'sun'] }; break;
        case 5: days = { workoutDays: ['mon', 'tue', 'thu', 'fri'], recoveryDays: ['sat'], restDays: ['wed', 'sun'] }; break;
    }
    const plan = {};
    for (const day of days.workoutDays)
        plan[day] = { type: 'workout', time: minutePerSession };
    for (const day of days.recoveryDays)
        plan[day] = { type: 'recovery' };
    for (const day of days.restDays)
        plan[day] = { type: 'rest' };
    
    return plan;
};

function assignIntensity(plan) {
    let high = true;
    for (const day of constants.days)
        if (plan[day].type == 'workout') {
            if (high) {
                plan[day].intensity = 'high';
                high = false;
            } else {
                plan[day].intensity = 'low';
                high = true;
            }
        }
};

function assignFocus(plan) {
    const workoutDays = Object.values(plan).filter(day => day.type == 'workout');
    if (workoutDays.length <= 2)
        for (const day of workoutDays)
            day.focus = 'wholebody';
    else if (workoutDays.length == 3) {
        workoutDays[0].focus = 'arm';
        workoutDays[1].focus = 'leg';
        workoutDays[2].focus = 'core';
    }
    else {
        workoutDays[0].focus = 'arm';
        workoutDays[1].focus = 'leg';
        workoutDays[2].focus = 'core';
        workoutDays[3].focus = 'glute';
    }
}

function assignSequence(plan) {
    for (const day of Object.values(plan)) 
        if (day.type == 'workout') {
            day.sequence = [];
            let accumulatedTime = 0;
            const numFocus = Object.fromEntries(focuses.map(focus => [focus, 0]));
            let lastExerciseDescription;
            while (accumulatedTime < day.time * 60) {
                let exerciseType, exerciseDescription;
                if (lastExerciseDescription == null || !lastExerciseDescription.focuses.includes(day.focus))
                    [exerciseType, exerciseDescription] = findExercise(day.focus);
                else {
                    const focus = Object.entries(numFocus).reduce((prev, curr) => prev[1] < curr[1] ? prev : curr)[0];  // Find the focus with minimum  occurrences
                    [exerciseType, exerciseDescription] = findExercise(focus);
                }
                const exercise = { type: exerciseType, length: exerciseDescription.normalLength };
                day.sequence.push(exercise);
                accumulatedTime += exerciseDescription.averageTime + 30;
                lastExerciseDescription = exerciseDescription;
                for (const focus of exerciseDescription.focuses)
                    numFocus[focus]++;
            }
        }
}

function assignInfo(plan) {
    for (const day of Object.values(plan))
        if (day.type == 'workout') {
            day.name = `${capitalize(day.focus)} Workout`;
            day.level = 4;
        }
}

const exerciseSlice = createSlice({
    name: 'exercise',
    initialState: {
        plan: null,
        planModified: false,
        library: exerciseLibrary,
        ongoingWorkout: {}
    },
    reducers: {
        setPlan: (state, action) => {
            state.plan = action.payload.plan;
            state.draftPlan = action.payload.plan;
            state.planModified = false;
        },
        generatePlan: (state, action) => {
            const { dayPerWeek, minutePerSession, physicalFitness } = action.payload;
            state.plan = generateEmptyPlan(dayPerWeek, minutePerSession);
            assignIntensity(state.plan);
            assignFocus(state.plan);
            assignSequence(state.plan);
            assignInfo(state.plan);
            console.log(JSON.stringify(state.plan));
        },
        resetDraftPlan: state => {
            state.draftPlan = state.plan;
            state.planModified = false;
        },
        saveDraftPlan: state => {
            state.plan = state.draftPlan;
            state.planModified = false;
        },
        swapWorkout: (state, action) => {
            const { fromDay, toDay } = action.payload;
            let temp = state.draftPlan[toDay];
            state.draftPlan[toDay] = state.draftPlan[fromDay];
            state.draftPlan[fromDay] = temp;
            state.planModified = true;
        },
        removeWorkout: (state, action) => {
            delete state.draftPlan[action.payload.day];
            state.planModified = true;
        },
        swapExercise: (state, action) => {
            const { day, fromIndex, toIndex } = action.payload;
            let sequence = state.draftPlan[day].sequence;
            sequence.splice(toIndex, 0, sequence.splice(fromIndex, 1)[0]);
            state.planModified = true;
        },
        changeExerciseLength: (state, action) => {
            const { day, index, length } = action.payload;
            state.draftPlan[day].sequence[index].length = length;
            state.planModified = true;
        },
        startWorkout: (state, action) => {
            const { day } = action.payload;
            state.ongoingWorkout = {
                plan: JSON.parse(JSON.stringify(state.plan[day])),
                progress: { stage: 'exercise', index: 0 },
                videos: [],
            }
        },
        completeRest: state => {
            const { progress } = state.ongoingWorkout;
            progress.stage = 'exercise';
            progress.index++;
        },
        completeExercise: (state, action) => {
            const { video } = action.payload;
            const { plan, progress, videos } = state.ongoingWorkout;
            videos[progress.index] = video;
            progress.stage = 'rest';
        }
    }
});

const { reducer, actions } = exerciseSlice;
export const { setPlan, generatePlan, resetDraftPlan, saveDraftPlan, swapWorkout, removeWorkout, swapExercise, changeExerciseLength, startWorkout, completeExercise, completeRest } = actions;
export default reducer;