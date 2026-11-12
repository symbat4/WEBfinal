// ===== EXTERNAL API: TheMealDB (free public recipe API, no key needed) =====
// Docs: https://www.themealdb.com/api.php
// Endpoint used: search.php?s=<meal name>

(function () {
    const API_URL = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const TIMEOUT_MS = 8000;

    const form = document.getElementById("apiSearchForm");
    const input = document.getElementById("apiSearchInput");
    const statusBox = document.getElementById("apiStatus");
    const results = document.getElementById("apiResults");
    const chips = document.querySelectorAll(".api-chip");

    if (!form || !input || !statusBox || !results) return;

    let lastQuery = "noodle";
    let requestId = 0; // Ignore stale responses if a newer search has started.

    // ----- Status helpers (loading / error / empty) -----
    function showLoading(query) {
        results.innerHTML = "";
        statusBox.className = "api-status";
        statusBox.innerHTML =
            '<div class="spinner-border text-danger" role="status" aria-hidden="true"></div>' +
            '<p class="mb-0 mt-2"></p>';
        statusBox.querySelector("p").textContent = 'Loading recipes for "' + query + '"...';
    }

    function showMessage(text, withRetry) {
        results.innerHTML = "";
        statusBox.className = "api-status api-status-error";
        statusBox.innerHTML = "<p></p>";
        statusBox.querySelector("p").textContent = text;

        if (withRetry) {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "btn btn-outline-danger btn-sm";
            btn.textContent = "Try again";
            btn.addEventListener("click", function () {
                loadRecipes(lastQuery);
            });
            statusBox.appendChild(btn);
        }
    }

    function clearStatus() {
        statusBox.className = "api-status";
        statusBox.innerHTML = "";
    }

    // ----- Fetch with async/await, timeout and error handling -----
    async function loadRecipes(query) {
        lastQuery = query;
        const thisRequest = ++requestId;
        showLoading(query);

        const controller = new AbortController();
        const timer = setTimeout(function () { controller.abort(); }, TIMEOUT_MS);

        try {
            const response = await fetch(API_URL + encodeURIComponent(query), {
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error("Server responded with status " + response.status);
            }

            const data = await response.json();
            if (thisRequest !== requestId) return;
            const meals = data.meals; // API returns null when nothing is found

            if (!meals || meals.length === 0) {
                showMessage('No recipes found for "' + query + '". Try another word.', false);
                return;
            }

            clearStatus();
            renderMeals(meals.slice(0, 9));
        } catch (error) {
            if (thisRequest !== requestId) return;
            console.error("Recipe API error:", error);
            if (error.name === "AbortError") {
                showMessage("The request took too long. Please check your connection.", true);
            } else {
                showMessage("Sorry, we could not load recipes right now. Please try again.", true);
            }
        } finally {
            clearTimeout(timer);
        }
    }

    // ----- Build ingredient list (API has strIngredient1..20) -----
    function getIngredients(meal) {
        const list = [];
        for (let i = 1; i <= 20; i++) {
            const name = meal["strIngredient" + i];
            const measure = meal["strMeasure" + i];
            if (name && name.trim()) {
                list.push(((measure || "").trim() + " " + name.trim()).trim());
            }
        }
        return list;
    }

    // ----- Render cards (textContent used, so API data can't inject HTML) -----
    function renderMeals(meals) {
        results.innerHTML = "";

        meals.forEach(function (meal) {
            const card = document.createElement("article");
            card.className = "api-card";

            const img = document.createElement("img");
            img.src = meal.strMealThumb || "images/logo.png";
            img.alt = meal.strMeal;
            img.loading = "lazy";
            img.onerror = function () {
                img.onerror = null; // Prevent a loop if the fallback is unavailable.
                img.src = "images/logo.png";
            };

            const title = document.createElement("h3");
            title.textContent = meal.strMeal;

            const meta = document.createElement("p");
            meta.className = "api-meta";
            meta.textContent = [meal.strCategory, meal.strArea].filter(Boolean).join(" • ");

            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.className = "btn btn-outline-danger btn-sm";
            toggle.textContent = "Show ingredients";
            toggle.setAttribute("aria-expanded", "false");

            const details = document.createElement("ul");
            details.className = "api-ingredients";
            details.hidden = true;
            getIngredients(meal).forEach(function (text) {
                const li = document.createElement("li");
                li.textContent = text;
                details.appendChild(li);
            });

            toggle.addEventListener("click", function () {
                const open = details.hidden;
                details.hidden = !open;
                toggle.textContent = open ? "Hide ingredients" : "Show ingredients";
                toggle.setAttribute("aria-expanded", String(open));
            });

            card.append(img, title, meta, toggle, details);

            if (meal.strSource || meal.strYoutube) {
                const link = document.createElement("a");
                link.href = meal.strSource || meal.strYoutube;
                link.target = "_blank";
                link.rel = "noopener noreferrer";
                link.className = "api-link";
                link.textContent = meal.strSource ? "Full recipe ↗" : "Watch video ↗";
                card.appendChild(link);
            }

            results.appendChild(card);
        });
    }

    // ----- Events -----
    form.addEventListener("submit", function (event) {
        event.preventDefault();
        const query = input.value.trim();
        if (!query) {
            showMessage("Please type a dish or ingredient to search.", false);
            return;
        }
        loadRecipes(query);
    });

    chips.forEach(function (chip) {
        chip.addEventListener("click", function () {
            input.value = chip.dataset.query;
            loadRecipes(chip.dataset.query);
        });
    });

    // Initial load
    loadRecipes(lastQuery);
})();
