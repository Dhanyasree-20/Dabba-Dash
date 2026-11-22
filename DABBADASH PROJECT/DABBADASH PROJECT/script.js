// ==========================================
// DABBADASH - DELIVERY MANAGEMENT SYSTEM
// ==========================================

// 1. SAMPLE DELIVERY RIDERS

const riders = [
    { id: 1, name: "Ramesh", zone: "Zone A", vehicle: "Bike" },
    { id: 2, name: "Suresh", zone: "Zone B", vehicle: "Scooter" },
    { id: 3, name: "Arjun", zone: "Zone C", vehicle: "Bike" },
    { id: 4, name: "Kiran", zone: "Zone D", vehicle: "Bike" },
    { id: 5, name: "Rahul", zone: "Zone A", vehicle: "Scooter" },
    { id: 6, name: "Vikram", zone: "Zone B", vehicle: "Bike" }
];

// 2. ORDER STATUS STAGES

const stages = [
    "Received",
    "In Kitchen",
    "Packed",
    "Out for Delivery",
    "Delivered"
];

// 3. SAMPLE CUSTOMER ORDERS

const sampleOrders = [
    { id: 101, customer: "Rahul Sharma", brand: "Biryani Box", item: "Chicken Biryani", zone: "Zone A", amount: 249, status: "Received", riderId: null, prepMinutes: 5 },
    { id: 102, customer: "Priya Reddy", brand: "Burger Den", item: "Cheese Burger", zone: "Zone B", amount: 199, status: "In Kitchen", riderId: null, prepMinutes: 12 },
    { id: 103, customer: "Arjun Kumar", brand: "Chai Point", item: "Masala Chai", zone: "Zone C", amount: 99, status: "Packed", riderId: null, prepMinutes: 8 },
    { id: 104, customer: "Vishal Reddy", brand: "Burger Den", item: "2 Burgers, Fries", zone: "Zone B", amount: 349, status: "In Kitchen", riderId: null, prepMinutes: 15 },
    { id: 105, customer: "bhoomika", brand: "Biryani Box", item: "Veg Biryani", zone: "Zone A", amount: 179, status: "Received", riderId: null, prepMinutes: 4 },
    { id: 106, customer: "Karthik Raju", brand: "Chai Point", item: "Tea & Samosa", zone: "Zone D", amount: 89, status: "Out for Delivery", riderId: 4, prepMinutes: 10 },
    { id: 107, customer: "Ananya Das", brand: "Burger Den", item: "Chicken Burger", zone: "Zone C", amount: 229, status: "Packed", riderId: null, prepMinutes: 17 },
    { id: 108, customer: "Sai Charan", brand: "Biryani Box", item: "Mutton Biryani", zone: "Zone B", amount: 299, status: "In Kitchen", riderId: null, prepMinutes: 14 },
    { id: 109, customer: "Meghana", brand: "Chai Point", item: "Cold Coffee", zone: "Zone A", amount: 129, status: "Received", riderId: null, prepMinutes: 3 },
    { id: 110, customer: "Nikhil", brand: "Burger Den", item: "Veg Burger", zone: "Zone D", amount: 159, status: "Packed", riderId: null, prepMinutes: 19 },
    { id: 111, customer: "Pooja", brand: "Biryani Box", item: "Chicken Biryani", zone: "Zone C", amount: 249, status: "Delivered", riderId: 3, prepMinutes: 16 },
    { id: 112, customer: "Manoj", brand: "Chai Point", item: "Ginger Tea", zone: "Zone B", amount: 59, status: "Received", riderId: null, prepMinutes: 2 },
    { id: 113, customer: "Divya", brand: "Burger Den", item: "Double Burger", zone: "Zone A", amount: 279, status: "In Kitchen", riderId: null, prepMinutes: 13 },
    { id: 114, customer: "Rohit", brand: "Biryani Box", item: "Veg Biryani", zone: "Zone D", amount: 179, status: "Packed", riderId: null, prepMinutes: 18 },
    { id: 115, customer: "Keerthi", brand: "Chai Point", item: "Tea & Snacks", zone: "Zone C", amount: 119, status: "Out for Delivery", riderId: 3, prepMinutes: 11 }
];

// 4. LOAD DATA FROM LOCAL STORAGE

let orders;

try {
    const savedOrders = localStorage.getItem("dabbaDashOrders");
    orders = savedOrders ? JSON.parse(savedOrders) : sampleOrders;
} catch (error) {
    orders = sampleOrders;
}

// Add countdown deadlines to existing delivery orders.

let etaDataUpdated = false;

orders.forEach(order => {
    if (order.status === "Out for Delivery" && !order.etaEndsAt) {
        order.etaEndsAt = Date.now() + 10 * 60 * 1000;
        etaDataUpdated = true;
    }
});

if (etaDataUpdated) {
    localStorage.setItem("dabbaDashOrders", JSON.stringify(orders));
}

// 5. SAVE ORDERS

function saveOrders() {
    localStorage.setItem("dabbaDashOrders", JSON.stringify(orders));
}

// 6. GET RIDER NAME

function getRiderName(riderId) {
    const rider = riders.find(r => r.id === Number(riderId));
    return rider ? rider.name : "Not Assigned";
}

// 7. DISPLAY DATE

document.getElementById("currentDate").textContent =
    new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

// 8. UPDATE DASHBOARD STATISTICS

function updateStats() {

    const active = orders.filter(
        order => order.status !== "Delivered"
    ).length;

    const kitchen = orders.filter(
        order => order.status === "In Kitchen"
    ).length;

    const pending = orders.filter(
        order => order.status === "Packed" && !order.riderId
    ).length;

    document.getElementById("activeOrders").textContent = active;
    document.getElementById("kitchenOrders").textContent = kitchen;
    document.getElementById("pendingOrders").textContent = pending;

    document.getElementById("orderCount").textContent =
        orders.length + " ORDERS";
}

// 9. DISPLAY ORDER CARDS

function renderOrders() {

    const board = document.getElementById("orderBoard");

    const search = document.getElementById("searchInput")
        .value.toLowerCase();

    const brand = document.getElementById("brandFilter").value;
    const status = document.getElementById("statusFilter").value;

    const filteredOrders = orders.filter(order => {

        const matchesSearch =
            order.customer.toLowerCase().includes(search) ||
            String(order.id).includes(search) ||
            order.brand.toLowerCase().includes(search);

        const matchesBrand =
            brand === "All" || order.brand === brand;

        const matchesStatus =
            status === "All" || order.status === status;

        return matchesSearch && matchesBrand && matchesStatus;
    });

    board.innerHTML = "";

    if (filteredOrders.length === 0) {
        board.innerHTML =
            '<div class="empty-message">No matching orders found.</div>';
        return;
    }

    filteredOrders.forEach(order => {

        const riderName = getRiderName(order.riderId);

        let buttonText = "Update Status";

        if (order.status === "Delivered") {
            buttonText = "Order Completed";
        } else if (order.status === "Packed" && !order.riderId) {
            buttonText = "Assign Delivery Rider";
        } else if (order.status === "Packed" && order.riderId) {
            buttonText = "Dispatch Order";
        } else if (order.status === "Out for Delivery") {
            buttonText = "Mark Delivered";
        }

        const card = document.createElement("div");
        card.className = "order-card";

        card.innerHTML = `
            <div class="order-top">
                <span class="order-id">#DD${order.id}</span>
                <span class="status-badge ${order.status
                    .toLowerCase()
                    .replaceAll(" ", "-")}">
                    ${order.status}
                </span>
            </div>

            <div class="order-customer">${order.customer}</div>

            <div class="order-brand">
                ${order.brand} • ${order.item}
            </div>

            <div class="order-info">
                <div class="info-item">
                    <small>DELIVERY ZONE</small>
                    <strong>${order.zone}</strong>
                </div>

                <div class="info-item">
                    <small>ORDER AMOUNT</small>
                    <strong>₹${order.amount}</strong>
                </div>

                <div class="info-item">
                    <small>DELIVERY RIDER</small>
                    <strong>${riderName}</strong>
                </div>

                <div class="info-item">
                    <small>PREP TIME</small>
                    <strong>${order.prepMinutes} min</strong>
                </div>
            </div>

            <button
                class="order-action"
                data-order-id="${order.id}"
                ${order.status === "Delivered" ? "disabled" : ""}
            >
                ${buttonText}
            </button>
        `;

        board.appendChild(card);
    });
}

// 10. ASSIGN A DELIVERY RIDER

function assignRider(order) {

    const availableRiders = riders.filter(rider => {

        const isBusy = orders.some(
            other =>
                other.riderId === rider.id &&
                other.status === "Out for Delivery"
        );

        return !isBusy;
    });

    const selectedRider =
        availableRiders.find(rider => rider.zone === order.zone) ||
        availableRiders[0];

    if (!selectedRider) {
        showToast("No available delivery riders!");
        return;
    }

    order.riderId = selectedRider.id;

    saveOrders();

    showToast(
        selectedRider.name + " assigned to order #DD" + order.id
    );

    renderAll();
}

// 11. UPDATE ORDER STATUS

function updateOrder(orderId) {

    const order = orders.find(
        item => item.id === Number(orderId)
    );

    if (!order) return;

    const currentIndex = stages.indexOf(order.status);

    if (order.status === "Packed" && !order.riderId) {
        assignRider(order);
        return;
    }

    if (currentIndex < stages.length - 1) {

        order.status = stages[currentIndex + 1];

        if (order.status === "Out for Delivery") {
            order.etaEndsAt = Date.now() + 10 * 60 * 1000;
        } else if (order.status === "Delivered") {
            order.etaEndsAt = null;
        }

        saveOrders();

        showToast(
            "Order #DD" + order.id +
            " updated to " + order.status
        );

        renderAll();
    }
}

// 12. ORDER BUTTON EVENT

document.getElementById("orderBoard").addEventListener("click", function(event) {

    const button = event.target.closest(".order-action");

    if (!button || button.disabled) return;

    updateOrder(button.dataset.orderId);

});

// 13. SEARCH AND FILTER EVENTS

document.getElementById("searchInput").addEventListener(
    "input", renderOrders
);

document.getElementById("brandFilter").addEventListener(
    "change", renderOrders
);

document.getElementById("statusFilter").addEventListener(
    "change", renderOrders
);

// 14. DISPLAY RIDER CONSOLE

function renderRiders() {

    const riderGrid = document.getElementById("riderGrid");

    riderGrid.innerHTML = "";

    riders.forEach(rider => {

        const assignedOrder = orders.find(
            order =>
                order.riderId === rider.id &&
                order.status === "Out for Delivery"
        );

        const isBusy = Boolean(assignedOrder);

        const card = document.createElement("div");
        card.className = "rider-card";

        card.innerHTML = `
            <div class="rider-top">

                <div class="rider-avatar">
                    ${rider.name.charAt(0)}
                </div>

                <div>
                    <strong>${rider.name}</strong>
                    <small>${rider.vehicle} • Delivery Partner</small>
                </div>

                <span class="rider-status ${isBusy ? "busy" : ""}">
                    ${isBusy ? "● BUSY" : "● AVAILABLE"}
                </span>

            </div>

            <div class="rider-details">

                <div>
                    <small>DELIVERY ZONE</small>
                    <strong>${rider.zone}</strong>
                </div>

                <div>
                    <small>ASSIGNED ORDER</small>
                    <strong>${assignedOrder ? "#DD" + assignedOrder.id : "None"}</strong>
                </div>

            </div>
        `;

        riderGrid.appendChild(card);
    });
}

// 15. DELIVERY ZONE BATCHING

function renderZones() {

    const zoneGrid = document.getElementById("zoneGrid");

    zoneGrid.innerHTML = "";

    const zones = ["Zone A", "Zone B", "Zone C", "Zone D"];

    zones.forEach(zone => {

        const zoneOrders = orders.filter(order =>
            order.zone === zone &&
            order.status !== "Delivered"
        );

        const card = document.createElement("div");
        card.className = "zone-card";

        card.innerHTML = `
            <h3>◎ ${zone}</h3>
            <strong>${zoneOrders.length}</strong>
            <small>Active delivery orders</small>
        `;

        zoneGrid.appendChild(card);
    });
}

// 16. GROUP ORDERS BY DELIVERY ZONE

document.getElementById("batchBtn").addEventListener("click", function() {

    const result = document.getElementById("batchResult");

    const zones = ["Zone A", "Zone B", "Zone C", "Zone D"];

    let output = "<strong>Delivery Zone Batching Results</strong><br><br>";
    let totalGroups = 0;

    zones.forEach(zone => {

        const groupedOrders = orders.filter(order =>
            order.zone === zone &&
            order.status !== "Delivered"
        );

        if (groupedOrders.length > 0) {

            totalGroups++;

            const orderNumbers = groupedOrders
                .map(order => "#DD" + order.id)
                .join(", ");

            output += `
                <strong>${zone}</strong> :
                ${groupedOrders.length} orders
                (${orderNumbers})<br>
            `;
        }
    });

    output += `<br><strong>${totalGroups} active delivery groups identified.</strong>`;

    result.innerHTML = output;

    showToast("Delivery zones grouped successfully!");
});

// 17. CUSTOMER TRACKING DROPDOWN

function renderTrackingOptions() {

    const select = document.getElementById("trackingSelect");

    const previousValue = select.value;

    select.innerHTML = "";

    orders.forEach(order => {

        const option = document.createElement("option");

        option.value = order.id;
        option.textContent = "#DD" + order.id + " - " + order.customer;

        select.appendChild(option);
    });

    if (orders.some(order => String(order.id) === previousValue)) {
        select.value = previousValue;
    } else {
        select.value = "104";
    }

    if (!orders.some(order => String(order.id) === select.value)) {
        select.selectedIndex = 0;
    }

    renderTracking();
}

// 18. CUSTOMER ORDER TRACKING

function renderTracking() {

    const selectedId =
        Number(document.getElementById("trackingSelect").value);

    const order = orders.find(item => item.id === selectedId);

    if (!order) return;

    document.getElementById("trackOrderId").textContent =
        "#DD" + order.id;

    document.getElementById("trackStatus").textContent =
        order.status;

    document.getElementById("trackRider").textContent =
        getRiderName(order.riderId);

    const index = stages.indexOf(order.status);
    const progress = (index / 4) * 100;

    document.getElementById("trackProgress").style.width =
        progress + "%";

    document.getElementById("scooter").style.left =
        progress + "%";

    const eta = {
        "Received": "Waiting for preparation",
        "In Kitchen": "About 25 minutes",
        "Packed": "Ready for dispatch",
        "Out for Delivery": "Calculating...",
        "Delivered": "Order delivered!"
    };

    document.getElementById("trackETA").textContent = eta[order.status];

    updateEtaCountdown(order);

    const steps = document.querySelectorAll(".tracking-steps .step");

    steps.forEach((step, i) => {

        step.classList.remove("completed", "current");

        if (i < index) {
            step.classList.add("completed");
        } else if (i === index) {
            step.classList.add("current");
        }
    });
}

// 19. TRACKING SELECT EVENT

document.getElementById("trackingSelect").addEventListener(
    "change", renderTracking
);

// 20. LIVE ETA COUNTDOWN

function updateEtaCountdown(order) {

    const etaElement = document.getElementById("trackETA");

    if (!etaElement) return;

    if (order.status !== "Out for Delivery") return;

    if (!order.etaEndsAt) {
        order.etaEndsAt = Date.now() + 10 * 60 * 1000;
        saveOrders();
    }

    const remaining = Math.max(
        0,
        Math.floor((order.etaEndsAt - Date.now()) / 1000)
    );

    const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
    const seconds = String(remaining % 60).padStart(2, "0");

    etaElement.textContent =
        remaining > 0
            ? `${minutes}:${seconds} min remaining`
            : "Arriving now";
}

// 21. INTERACTIVE LEAFLET MAP

let deliveryMap;
let deliveryMapMarkers;

function initializeDeliveryMap() {

    const mapElement = document.getElementById("deliveryMap");

    if (!mapElement || typeof L === "undefined") return;

    if (!deliveryMap) {

        deliveryMap = L.map("deliveryMap").setView(
            [17.435, 78.535],
            12
        );

        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: '&copy; OpenStreetMap contributors',
                maxZoom: 19
            }
        ).addTo(deliveryMap);

        deliveryMapMarkers = L.layerGroup().addTo(deliveryMap);
    }

    deliveryMapMarkers.clearLayers();

    const zoneLocations = {
        "Zone A": [17.440, 78.500],
        "Zone B": [17.450, 78.545],
        "Zone C": [17.420, 78.565],
        "Zone D": [17.405, 78.525]
    };

    // Display rider markers

    riders.forEach((rider, index) => {

        const base = zoneLocations[rider.zone] || [17.435, 78.535];

        const position = [
            base[0] + (index % 2 ? 0.006 : -0.004),
            base[1] + (index % 3 - 1) * 0.006
        ];

        const activeOrder = orders.find(
            order =>
                order.riderId === rider.id &&
                order.status === "Out for Delivery"
        );

        L.marker(position)
            .addTo(deliveryMapMarkers)
            .bindPopup(`
                <strong>${rider.name}</strong><br>
                ${rider.vehicle}<br>
                ${activeOrder
                    ? `Delivering order #DD${activeOrder.id}`
                    : "Available / no active delivery"}
            `);
    });

    // Display active order markers

    orders.filter(order => order.status !== "Delivered").forEach(order => {

        const base = zoneLocations[order.zone] || [17.435, 78.535];

        const position = [
            base[0] + 0.002,
            base[1] + 0.003
        ];

        L.circleMarker(position, {
            radius: 7,
            color: "#ff8b36",
            fillColor: "#ff8b36",
            fillOpacity: 0.85
        })
            .addTo(deliveryMapMarkers)
            .bindPopup(`
                <strong>Order #DD${order.id}</strong><br>
                ${order.customer}<br>
                ${order.status}<br>
                ${order.zone}
            `);
    });
}

// 22. RIDER PAYOUT CALCULATOR

function populatePayoutRiders() {

    const select = document.getElementById("payoutRider");

    if (!select) return;

    select.innerHTML = "";

    riders.forEach(rider => {

        const option = document.createElement("option");

        option.value = rider.id;
        option.textContent = rider.name;

        select.appendChild(option);
    });
}

function calculateRiderPayout() {

    const riderId = Number(
        document.getElementById("payoutRider").value
    );

    const perDelivery = Math.max(
        0,
        Number(document.getElementById("payoutPerDelivery").value) || 0
    );

    const bonus = Math.max(
        0,
        Number(document.getElementById("payoutBonus").value) || 0
    );

    const deductions = Math.max(
        0,
        Number(document.getElementById("payoutDeductions").value) || 0
    );

    const completed = orders.filter(
        order =>
            order.riderId === riderId &&
            order.status === "Delivered"
    ).length;

    const earnings = completed * perDelivery;

    const total = Math.max(
        0,
        earnings + bonus - deductions
    );

    document.getElementById("completedDeliveries").textContent =
        completed;

    document.getElementById("deliveryEarnings").textContent =
        "₹" + earnings.toFixed(2);

    document.getElementById("totalPayout").textContent =
        "₹" + total.toFixed(2);
}

// 23. SHOW NOTIFICATION MESSAGE

let toastTimer;

function showToast(message) {

    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// 24. UPDATE ALL DASHBOARD SECTIONS

function renderAll() {

    updateStats();
    renderOrders();
    renderRiders();
    renderZones();
    renderTrackingOptions();

    populatePayoutRiders();
    calculateRiderPayout();

    initializeDeliveryMap();
}

// 25. PAYOUT CALCULATOR EVENTS

document.getElementById("calculatePayout").addEventListener(
    "click",
    calculateRiderPayout
);

document.getElementById("payoutRider").addEventListener(
    "change",
    calculateRiderPayout
);

// 26. START THE APPLICATION

renderAll();

// Refresh the selected order countdown every second.

setInterval(() => {

    const selectedId =
        Number(document.getElementById("trackingSelect").value);

    const selectedOrder = orders.find(
        order => order.id === selectedId
    );

    if (selectedOrder) {
        updateEtaCountdown(selectedOrder);
    }

}, 1000);