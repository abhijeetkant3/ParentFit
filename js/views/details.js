/* Parentfit Exercise Details View Page */

import { store } from "../store.js";

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
                    ${this.exercises.map((ex) => `
                        
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

                                <p class="exercise-card__equipment text-muted">
                                    🏋️ ${ex.equipment}
                                </p>

                                <div class="exercise-card__tags">

                                    ${ex.muscles.map((m) => `
                                        <span class="exercise-card__tag">
                                            ${m}
                                        </span>
                                    `).join("")}

                                </div>

                            </div>

                        </div>

                    `).join("")}
                </div>

            </div>
        `;
    },

    /* =========================================
       SINGLE EXERCISE DETAILS
       ========================================= */

    renderSingleExercise(ex) {
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
                    <div class="flex gap-2 text-muted mb-3 exercise-detail-equipment">
                        <span>
                            🏋️
                            <strong>Equipment:</strong>
                            ${ex.equipment}
                        </span>
                    </div>

                    <!-- Muscles -->
                    <div class="mb-3">

                        <h3 class="mb-1 exercise-section-title">
                            Muscles Targeted:
                        </h3>

                        <div class="flex gap-1 flex-wrap">

                            ${ex.muscles.map((m) => `
                                <span class="badge badge-accent">
                                    ${m}
                                </span>
                            `).join("")}

                        </div>

                    </div>

                    <!-- Recommended Sets / Reps -->
                    <div class="card card-accent mb-3 exercise-recommendation-card">

                        <div class="exercise-recommendation">

                            <div class="exercise-recommendation__item">

                                <span class="text-muted exercise-recommendation__label">
                                    RECOMMENDED SETS
                                </span>

                                <div class="font-bold exercise-recommendation__value">
                                    ${ex.sets} Sets
                                </div>

                            </div>

                            <div class="exercise-recommendation__divider"></div>

                            <div class="exercise-recommendation__item">

                                <span class="text-muted exercise-recommendation__label">
                                    REPETITIONS
                                </span>

                                <div class="font-bold exercise-recommendation__value">
                                    ${ex.reps}
                                </div>

                            </div>

                        </div>

                    </div>

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