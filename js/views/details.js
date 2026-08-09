import { store } from "../store.js";
import { getLatestProgression } from "../services/progressionService.js";
import { getExerciseType, parseRepRange, parseDuration, getExerciseRest } from "../domain/exerciseEngine.js";

function formatTargetValue(val, isTime) {
    if (!val) return '—';
    if (isTime) {
        if (typeof val === 'object' && val !== null && val.minSeconds !== undefined) {
            const { minSeconds, maxSeconds } = val;
            if (minSeconds === maxSeconds) return `${minSeconds} sec`;
            if (minSeconds >= 60) return `${Math.round(minSeconds / 60)}–${Math.round(maxSeconds / 60)} min`;
            return `${minSeconds}–${maxSeconds} sec`;
        }
        if (typeof val === 'string') {
            const dur = parseDuration(val);
            if (dur) return formatTargetValue(dur, true);
            return val;
        }
        return String(val);
    } else {
        if (typeof val === 'object' && val !== null && val.min !== undefined && val.max !== undefined) {
            return val.min === val.max ? `${val.min}` : `${val.min}–${val.max}`;
        }
        if (typeof val === 'string') {
            const reps = parseRepRange(val);
            if (reps) return formatTargetValue(reps, false);
            return val.replace(/\s*reps?\b/i, '').trim();
        }
        return String(val);
    }
}

export const detailsView = {
    exercises: [],
    selectedId: null,

    async render(params) {
        try {
            const res = await fetch("./data/exercises.json");
            this.exercises = await res.json();
        } catch (e) {
            console.error("Failed to load exercises.json", e);
            this.exercises = [];
        }

        this.selectedId = params?.id || null;

        const selectedEx = this.exercises.find(
            (e) => e.id === this.selectedId
        );

        if (selectedEx) {
            return this.renderSingleExercise(selectedEx);
        }

        return this.renderLibrary();
    },

    /* =========================================
       EXERCISE LIBRARY
       ========================================= */

    renderLibrary() {
        return `
            <div class="view-details animate-fade-in">

                <div class="mb-3">
                    <h1>Exercise Library</h1>

                    <p class="text-muted">
                        Explore gentle beginner exercises with step-by-step
                        posture illustrations & safety tips.
                    </p>
                </div>

                <div class="exercise-list">
                    ${this.exercises.map((ex) => {
                        const equipmentText = ex.equipment && typeof ex.equipment === 'string' ? ex.equipment.trim() : '';
                        const validMuscles = Array.isArray(ex.muscles) ? ex.muscles.filter(m => m && typeof m === 'string' && m.trim()) : [];

                        return `
                            <div
                                class="exercise-card card card-interactive"
                                onclick="location.hash='details?id=${ex.id}'"
                                role="button"
                                tabindex="0"
                            >

                                <div class="exercise-card__image">
                                    ${ex.svgIllustration}
                                </div>

                                <div class="exercise-card__content">

                                    <div class="exercise-card__header">

                                        <h3 class="exercise-card__title">
                                            ${ex.name}
                                        </h3>

                                        <span class="badge badge-primary exercise-card__difficulty">
                                            ${ex.difficulty}
                                        </span>

                                    </div>

                                    ${equipmentText ? `
                                        <p class="exercise-card__equipment text-muted">
                                            🏋️ ${equipmentText}
                                        </p>
                                    ` : ''}

                                    ${validMuscles.length > 0 ? `
                                        <div class="exercise-card__tags">
                                            ${validMuscles.map((m) => `
                                                <span class="exercise-card__tag">
                                                    ${m.trim()}
                                                </span>
                                            `).join("")}
                                        </div>
                                    ` : ''}

                                </div>

                            </div>
                        `;
                    }).join("")}
                </div>

            </div>
        `;
    },

    /* =========================================
       SINGLE EXERCISE DETAILS
       ========================================= */

    renderSingleExercise(ex) {
        const latestProgression = getLatestProgression(ex.id);
        const equipmentText = ex.equipment && typeof ex.equipment === 'string' ? ex.equipment.trim() : '';
        const validMuscles = Array.isArray(ex.muscles) ? ex.muscles.filter(m => m && typeof m === 'string' && m.trim()) : [];
        const isTime = getExerciseType(ex) === 'time';
        const targetLabel = isTime ? 'Duration' : 'Reps';
        const restSec = getExerciseRest(ex) || (typeof ex.rest === 'number' ? ex.rest : 45);

        let recommendationHTML = '';

        if (latestProgression) {
            const recSets = latestProgression.recommendedSets || ex.sets || 3;

            let recTargetStr = '—';
            if (isTime) {
                const durObj = latestProgression.recommendedDuration || latestProgression.currentDuration;
                recTargetStr = formatTargetValue(durObj || ex.reps || ex.duration, true);
            } else {
                const repObj = latestProgression.recommendedReps || latestProgression.currentReps;
                recTargetStr = formatTargetValue(repObj || ex.reps, false);
            }

            const prevSets = latestProgression.currentSets || ex.sets || 3;
            let prevTargetStr = '—';
            if (isTime) {
                const curDur = latestProgression.currentDuration;
                prevTargetStr = formatTargetValue(curDur || ex.reps || ex.duration, true);
            } else {
                const curReps = latestProgression.currentReps;
                prevTargetStr = formatTargetValue(curReps || ex.reps, false);
            }

            const rawPerf = latestProgression.performance || 'good';
            const ratingDisplayMap = {
                'easy': 'Easy',
                'good': 'Good',
                'difficult': 'Difficult',
                'too_difficult': 'Too Difficult'
            };
            const perfLabel = ratingDisplayMap[rawPerf.toLowerCase()] || 'Good';

            recommendationHTML = `
                <div class="card card-accent mb-3 exercise-recommendation-card">
                    <div class="text-center font-bold mb-2 text-muted" style="font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                        YOUR NEXT TARGET
                    </div>

                    <div class="exercise-recommendation mb-2">
                        <div class="exercise-recommendation__item">
                            <span class="text-muted exercise-recommendation__label">
                                Sets
                            </span>
                            <div class="font-bold exercise-recommendation__value">
                                ${recSets}
                            </div>
                        </div>

                        <div class="exercise-recommendation__divider"></div>

                        <div class="exercise-recommendation__item">
                            <span class="text-muted exercise-recommendation__label">
                                ${targetLabel}
                            </span>
                            <div class="font-bold exercise-recommendation__value">
                                ${recTargetStr}
                            </div>
                        </div>
                    </div>

                    <div class="text-center text-muted" style="font-size: 0.85rem; border-top: 1px dashed #FFE0B2; padding-top: 0.6rem; margin-top: 0.6rem;">
                        <p class="mb-1" style="font-weight: 600;">
                            Based on your recent performance
                        </p>
                        <div style="font-size: 0.8rem; opacity: 0.9;">
                            <span>Previous: ${prevSets} × ${prevTargetStr}</span>
                            <span style="margin: 0 0.4rem;">•</span>
                            <span>Feedback: ${perfLabel}</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            const defaultTargetStr = formatTargetValue(ex.reps || ex.duration, isTime);

            recommendationHTML = `
                <div class="card card-accent mb-3 exercise-recommendation-card">
                    <div class="text-center font-bold mb-2 text-muted" style="font-size: 0.85rem; letter-spacing: 0.05em; text-transform: uppercase;">
                        RECOMMENDED TRAINING
                    </div>

                    <div class="exercise-recommendation">
                        <div class="exercise-recommendation__item">
                            <span class="text-muted exercise-recommendation__label">
                                Sets
                            </span>
                            <div class="font-bold exercise-recommendation__value">
                                ${ex.sets}
                            </div>
                        </div>

                        <div class="exercise-recommendation__divider"></div>

                        <div class="exercise-recommendation__item">
                            <span class="text-muted exercise-recommendation__label">
                                ${targetLabel}
                            </span>
                            <div class="font-bold exercise-recommendation__value">
                                ${defaultTargetStr}
                            </div>
                        </div>

                        <div class="exercise-recommendation__divider"></div>

                        <div class="exercise-recommendation__item">
                            <span class="text-muted exercise-recommendation__label">
                                Rest
                            </span>
                            <div class="font-bold exercise-recommendation__value">
                                ${restSec} sec
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        return `
            <div class="view-details animate-fade-in">

                <!-- Back Button -->
                <div class="mb-2">
                    <a
                        href="#details"
                        class="exercise-back-link"
                    >
                        ← Back to All Exercises
                    </a>
                </div>

                <!-- Main Exercise Card -->
                <div class="card mb-3">

                    <!-- Illustration -->
                    <div class="svg-illustration-wrapper">
                        ${ex.svgIllustration}
                    </div>

                    <!-- Title + Difficulty -->
                    <div class="exercise-detail-header">

                        <h1 class="exercise-detail-title">
                            ${ex.name}
                        </h1>

                        <span class="badge badge-primary exercise-detail-difficulty">
                            ${ex.difficulty}
                        </span>

                    </div>

                    <!-- Equipment -->
                    ${equipmentText ? `
                        <div class="flex gap-2 text-muted mb-3 exercise-detail-equipment">
                            <span>
                                🏋️
                                <strong>Equipment:</strong>
                                ${equipmentText}
                            </span>
                        </div>
                    ` : ''}

                    <!-- Muscles -->
                    ${validMuscles.length > 0 ? `
                        <div class="mb-3">

                            <h3 class="mb-1 exercise-section-title">
                                Muscles Targeted:
                            </h3>

                            <div class="flex gap-1 flex-wrap">

                                ${validMuscles.map((m) => `
                                    <span class="badge badge-accent">
                                        ${m.trim()}
                                    </span>
                                `).join("")}

                            </div>

                        </div>
                    ` : ''}

                    <!-- Recommendation Card (RECOMMENDED TRAINING or YOUR NEXT TARGET) -->
                    ${recommendationHTML}

                    <!-- Step by Step Instructions -->
                    <div class="mb-3">

                        <h3 class="mb-1 exercise-section-title">
                            Step-by-Step Instructions:
                        </h3>

                        <ol class="exercise-instructions">

                            ${ex.instructions.map((inst) => `
                                <li class="mb-1">
                                    ${inst}
                                </li>
                            `).join("")}

                        </ol>

                    </div>

                    <!-- Common Mistakes -->
                    <div class="mb-3 card exercise-mistakes">

                        <h3 class="mb-1">
                            ⚠️ Common Mistakes to Avoid:
                        </h3>

                        <ul class="exercise-mistakes__list">

                            ${ex.mistakes.map((m) => `
                                <li class="mb-1">
                                    ${m}
                                </li>
                            `).join("")}

                        </ul>

                    </div>

                    <!-- Breathing Tips -->
                    <div class="card exercise-breathing">

                        <h3 class="mb-1">
                            🌬️ Proper Breathing Technique:
                        </h3>

                        <p>
                            ${ex.breathing}
                        </p>

                    </div>

                    <!-- Practice Button -->
                    <button
                        onclick="location.hash='player?exercise=${ex.id}'"
                        class="btn btn-primary ripple mt-3"
                    >
                        ▶ Practice This Exercise Now
                    </button>

                </div>

            </div>
        `;
    }
};