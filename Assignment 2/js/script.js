/* ============================================================
   GLOBAL HELPER FUNCTIONS
   ============================================================ */

function showErrors(container, errors) {
    container.innerHTML = errors.map(err => `<p>${err}</p>`).join("");
}

/* ============================================================
   MAIN SCRIPT – RUNS WHEN PAGE LOADS
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ============================================================
       1. REGISTRATION FORM VALIDATION
       ============================================================ */
    const regForm = document.getElementById("registerForm");

    if (regForm) {
        regForm.addEventListener("submit", event => {
            const errors = [];
            const errorBox = document.getElementById("errorMessages");

            const username = document.getElementById("username").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const password = document.getElementById("password").value;
            const confirmPassword = document.getElementById("confirmPassword").value;
            const gender = document.getElementById("gender").value;

            if (!/^[A-Za-z0-9_]{5,}$/.test(username)) {
                errors.push("Username must be at least 5 characters and contain only letters, numbers, and underscores.");
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                errors.push("Please enter a valid email address.");
            }

            if (!/^\d{8,15}$/.test(phone)) {
                errors.push("Phone number must contain 8–15 digits only.");
            }

            if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{10,}$/.test(password)) {
                errors.push("Password must be at least 10 characters and include uppercase, lowercase, numbers, and special characters.");
            }

            if (password !== confirmPassword) {
                errors.push("Passwords do not match.");
            }

            if (gender === "") {
                errors.push("Please select your gender.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                showErrors(errorBox, errors);
            }
        });
    }

    /* ============================================================
       2. RESERVATION FORM LOGIC + VALIDATION
       ============================================================ */
    const resForm = document.getElementById("reservationForm");

    if (resForm) {

        const restaurantSelect = document.getElementById("restaurant");
        const depositField = document.getElementById("deposit");
        const paymentSelect = document.getElementById("payment");
        const voucherSection = document.getElementById("voucherSection");
        const cardSection = document.getElementById("cardSection");
        const billingEmail = document.getElementById("billingEmail");
        const sameEmail = document.getElementById("sameEmail");
        const errorBox = document.getElementById("errorMessages");

        const deposits = {
            "Zambrero Australia": 10,
            "Ember & Oak Grillhouse": 20,
            "Sakura Blossom Sushi Bar": 15,
            "Spice Route Indian Kitchen": 10,
            "Bella Roma Trattoria": 18,
            "GreenLeaf Vegan Bistro": 12
        };

        restaurantSelect.addEventListener("change", () => {
            depositField.value = "$" + (deposits[restaurantSelect.value] || 0);
        });

        paymentSelect.addEventListener("change", () => {
            voucherSection.classList.add("hidden");
            cardSection.classList.add("hidden");

            if (paymentSelect.value === "voucher") {
                voucherSection.classList.remove("hidden");
            } else if (paymentSelect.value === "online") {
                cardSection.classList.remove("hidden");
            }
        });

        sameEmail.addEventListener("change", () => {
            billingEmail.value = sameEmail.checked
                ? document.getElementById("email").value
                : "";
        });

        resForm.addEventListener("submit", event => {
            const errors = [];

            const fullname = document.getElementById("fullname").value.trim();
            const email = document.getElementById("email").value.trim();
            const phone = document.getElementById("phone").value.trim();
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;
            const people = document.getElementById("people").value;
            const payment = paymentSelect.value;
            const cardNumber = document.getElementById("cardNumber").value;

            if (!fullname || !email || !phone || !date || !time || !people) {
                errors.push("All required fields must be completed.");
            }

            if (!/^\S+@\S+\.\S+$/.test(email)) {
                errors.push("Please enter a valid email address.");
            }

            if (!/^\d{10,}$/.test(phone)) {
                errors.push("Phone number must contain at least 10 digits.");
            }

            const today = new Date().toISOString().split("T")[0];
            if (date < today) {
                errors.push("Reservation date cannot be in the past.");
            }

            if (people <= 0) {
                errors.push("Number of people must be greater than 0.");
            }

            if (payment === "online" && !/^\d{15,16}$/.test(cardNumber)) {
                errors.push("Credit card number must be 15 digits (Amex) or 16 digits (Visa/Mastercard).");
            }

            if (errors.length > 0) {
                event.preventDefault();
                showErrors(errorBox, errors);
            }
        });
    }

    /* ============================================================
       3. BONUS BILL CALCULATOR
       ============================================================ */
    const billForm = document.getElementById("billForm");

    if (billForm) {

        const restaurantPrices = {
            "Zambrero Australia": [15, 25],
            "Ember & Oak Grillhouse": [35, 55],
            "Sakura Blossom Sushi Bar": [25, 45],
            "Spice Route Indian Kitchen": [20, 35],
            "Bella Roma Trattoria": [30, 50],
            "GreenLeaf Vegan Bistro": [22, 40]
        };

        const billRestaurant = document.getElementById("billRestaurant");
        const groupSize = document.getElementById("groupSize");
        const billResult = document.getElementById("billResult");
        const calculateBtn = document.getElementById("calculateBill");

        calculateBtn.addEventListener("click", () => {
            const restaurant = billRestaurant.value;
            const people = parseInt(groupSize.value);

            if (!restaurant || people < 1) {
                billResult.innerHTML = `<p style="color:red;">Please select a restaurant and enter a valid group size.</p>`;
                return;
            }

            const [low, high] = restaurantPrices[restaurant];
            const estLow = low * people;
            const estHigh = high * people;

            billResult.innerHTML = `
                <h3>Estimated Bill</h3>
                <p><strong>Restaurant:</strong> ${restaurant}</p>
                <p><strong>Group Size:</strong> ${people}</p>
                <p><strong>Estimated Total:</strong> $${estLow} – $${estHigh}</p>
                <p style="font-size:0.9rem;color:#555;">*This is an estimate based on average price per person.</p>
            `;
        });
    }

    /* ============================================================
       4. RECOMMENDATION ENGINE (Strict Matching)
       ============================================================ */
    const recommendForm = document.getElementById("recommendForm");

    if (recommendForm) {

        const resultsContainer = document.getElementById("resultsContainer");
        const getRecommendationBtn = document.getElementById("getRecommendation");

        const restaurants = [
            {
                name: "Zambrero Australia",
                diet: "none",
                budget: "low",
                purpose: "family",
                description: "Healthy Mexican bowls and burritos.",
                link: "reservation.html?restaurant=Zambrero Australia"
            },
            {
                name: "Ember & Oak Grillhouse",
                diet: "none",
                budget: "high",
                purpose: "date",
                description: "Premium steaks and fine dining.",
                link: "reservation.html?restaurant=Ember & Oak Grillhouse"
            },
            {
                name: "Sakura Blossom Sushi Bar",
                diet: "none",
                budget: "medium",
                purpose: "date",
                description: "Fresh sushi and Japanese cuisine.",
                link: "reservation.html?restaurant=Sakura Blossom Sushi Bar"
            },
            {
                name: "Spice Route Indian Kitchen",
                diet: "halal",
                budget: "low",
                purpose: "family",
                description: "Authentic Indian curries and tandoori dishes.",
                link: "reservation.html?restaurant=Spice Route Indian Kitchen"
            },
            {
                name: "Bella Roma Trattoria",
                diet: "none",
                budget: "medium",
                purpose: "business",
                description: "Italian pasta, pizza, and wine.",
                link: "reservation.html?restaurant=Bella Roma Trattoria"
            },
            {
                name: "GreenLeaf Vegan Bistro",
                diet: "vegan",
                budget: "medium",
                purpose: "date",
                description: "Plant‑based meals and organic dishes.",
                link: "reservation.html?restaurant=GreenLeaf Vegan Bistro"
            }
        ];

        getRecommendationBtn.addEventListener("click", () => {

            const diet = document.getElementById("diet").value;
            const budget = document.getElementById("budget").value;
            const purpose = document.getElementById("purpose").value;

            const matches = restaurants.filter(r =>
                (r.diet === diet || r.diet === "none") &&
                r.budget === budget &&
                r.purpose === purpose
            );

            resultsContainer.innerHTML = "";

            if (matches.length === 0) {
                resultsContainer.innerHTML = `<p>No matching restaurants found.</p>`;
                return;
            }

            matches.forEach(r => {
                const card = document.createElement("div");
                card.className = "restaurant-card";
                card.innerHTML = `
                    <h3>${r.name}</h3>
                    <p>${r.description}</p>
                    <a href="${r.link}" class="button">Reserve Now</a>
                `;
                resultsContainer.appendChild(card);
            });
        });
    }

});




