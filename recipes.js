
// TASK 2.2 - Keyboard Event Handling

const navLinks = document.querySelectorAll(
    "#mainNav .navbar-nav .nav-link"
);

navLinks.forEach(function (link, index) {
    link.addEventListener("keydown", function (event) {
        let nextIndex;

        if (event.key === "ArrowRight") {
            nextIndex = (index + 1) % navLinks.length;
        } else if (event.key === "ArrowLeft") {
            nextIndex = (index - 1 + navLinks.length) % navLinks.length;
        } else {
            return;
        }

        event.preventDefault();
        navLinks[nextIndex].focus();
    });
});


// TASK 3.2 - Arrays and Loops
// TASK 3.3 - Higher-Order Functions

const ramenNames = [
    { name: "Spicy Buldak Ramen 🌶️", type: "Spicy" },
    { name: "Creamy Cheese Ramen 🧀", type: "Creamy" },
    { name: "Classic Shin Ramen 🍜", type: "Classic" }
];

const ramenList = document.getElementById("ramenList");
const filterButtons = document.querySelectorAll(".filter-btn");

// Display recipes
// TASK 3.5 - Animations

function displayRamen(recipes) {
    ramenList.innerHTML = "";

    for (let i = 0; i < recipes.length; i++) {
        const listItem = document.createElement("li");

        listItem.textContent = recipes[i].name;

        // Add animation
        listItem.classList.add("ramen-animate");

        ramenList.appendChild(listItem);
    }
}

// Handle filter buttons
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {

        playClickSound();

        const selectedType = button.dataset.type;

        const filteredRecipes = ramenNames.filter(function (recipe) {
            return selectedType === "All" ||
                recipe.type === selectedType;
        });

        displayRamen(filteredRecipes);
    });
});

// Show all recipes when page loads
displayRamen(ramenNames);

// TASK 3.4 - Play Sounds

let audioContext;

function playClickSound() {
    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    if (!AudioContextClass) {
        return;
    }

    if (!audioContext) {
        audioContext = new AudioContextClass();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.value = 600;

    gainNode.gain.setValueAtTime(
        0.08,
        audioContext.currentTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioContext.currentTime + 0.15
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
}