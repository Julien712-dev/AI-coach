import React, { useState, useEffect, useRef } from 'react';
import config from '../config';
import moment from 'moment';

export function computeNutritionValues(profile) {

    let dailyRecommendedCalories = 1600;

    try {
        let {
            age,
            sex,
            dietHabit
        } = profile;
        let exerciseHabit = 'sedentary'; // DEBUG

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

        switch(dietHabit) {
            case 'loseWeight' : {
                dailyRecommendedCalories -= 550;
                break;
            }
            case 'gainMuscles' : {
                dailyRecommendedCalories += 550;
                break;
            }
            default: break;
        }

        // get calorie & maco range for query search
        let currentTime = new Date();
        let meal = config.messages.diet.find(message => (message.startAt <= moment(currentTime).hour() && message.endAt > moment(currentTime).hour()));

        return {
            dailyRecommendedCalories,
            minimunDailyProteinInGrams: dailyRecommendedCalories * config.nutritionDailyRecommendedRange['protein']['min'] / config.nutritionPerGramToKcal['protein'],
            maximumDailyProteinInGrams: dailyRecommendedCalories * config.nutritionDailyRecommendedRange['protein']['max'] / config.nutritionPerGramToKcal['protein'],
            minimumDailyCarbsInGrams: dailyRecommendedCalories * config.nutritionDailyRecommendedRange['carb']['min'] / config.nutritionPerGramToKcal['carb'],
            maximumDailyCarbsInGrams: dailyRecommendedCalories * config.nutritionDailyRecommendedRange['carb']['max'] / config.nutritionPerGramToKcal['carb'],
            minimumDailyFatsInGrams: dailyRecommendedCalories * config.nutritionDailyRecommendedRange['fat']['min'] / config.nutritionPerGramToKcal['fat'],
            maximumDailyFatsInGrams: dailyRecommendedCalories * config.nutritionDailyRecommendedRange['fat']['max'] / config.nutritionPerGramToKcal['fat'],
        }

    } catch (error) {
        console.log(error);
    }

}

export function getCoachAdvice(profile) {

    let coachAdvice = '';
    try {

        let {
            age,
            sex,
            exerciseHabit,
            dietHabit
        } = profile;

        switch(dietHabit) {
            case 'loseWeight', 'gainMuscles' : {
                coachAdvice += 'Protein is an essential nutrient. You should ensure enough protein intake.'
                break;
            }
            default: {
                coachAdvice += 'To stay in shape, make sure you take all kinds of nutrients evenly.'
                break;
            }
        }

        switch(exerciseHabit) {
            case 'sedentary': {
                if (dietHabit != 'gainMuscles') {
                    coachAdvice += `\nYou activity level is rather low. Avoid eating too much so that you don't gain weight. `;
                }
                break;
            }
            case 'moderate', 'extensive': {
                coachAdvice += `\nDo not skip meals or under eat. You need sufficient energy to maintain your activity.`;
                break;
            }
            default: break;
        }
        
        return coachAdvice;
    } catch (error) {

    }
}