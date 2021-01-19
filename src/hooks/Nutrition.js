import React, { useState, useEffect, useRef } from 'react';
import config from '../config';
import moment from 'moment';

export function computeNutritionValues(profile) {

    let dailyRecommendedCalories = 1600;

    try {
        let {
            age,
            sex,
            exerciseHabit,
            dietHabit
        } = profile;

        if ( !age || !sex || !exerciseHabit || !dietHabit ) throw 'invalid_profile';

        let palValue = config.palValueMap[exerciseHabit];
        
        // get daily recommended calorie intake
        switch(true) {
            case (age < 19): { dailyRecommendedCalories = config.referenceNuritionValues[palValue][15][sex]; break; };
            case (age < 25): { dailyRecommendedCalories = config.referenceNuritionValues[palValue][19][sex]; break; };
            case (age < 51): { dailyRecommendedCalories = config.referenceNuritionValues[palValue][25][sex]; break; };
            case (age < 65): { dailyRecommendedCalories = config.referenceNuritionValues[palValue][51][sex]; break; };
            default: { dailyRecommendedCalories = config.referenceNuritionValues[palValue][65][sex]; break; };
        }

        // get calorie & maco range for query search
        let dailyRecommendedProteinsInGrams, dailyRecommendedFatsInGrams, dailyRecommendedCarbohydratesInGrams = 0;

        let currentTime = new Date();
		let meal = config.messages.diet.find(message => (message.startAt <= moment(currentTime).hour() && message.endAt > moment(currentTime).hour()));

        switch(dietHabit) {
            case 'stayInShape' : {
                break;
            }
            case 'loseWeight' : {
                break;
            }
            case 'gainMuscles' : {
                break;
            }
        }

        return {
            dailyRecommendedCalories,
            dailyRecommendedProteinsInGrams,
            dailyRecommendedCarbohydratesInGrams,
            dailyRecommendedFatsInGrams,
        }

    } catch (error) {
        console.log(error);
    }

}