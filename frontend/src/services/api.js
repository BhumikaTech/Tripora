
const API_URL = "http://localhost:5000/api";

// Common function for authenticated requests
async function authenticatedRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

// Get all destinations
export async function getDestinations() {
  const response = await fetch(`${API_URL}/destinations`);

  if (!response.ok) {
    throw new Error("Failed to fetch destinations");
  }

  const data = await response.json();
  return data.destinations;
}

// Register user
export async function registerUser(userData) {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Registration failed");
  }

  return data;
}

// Login user
export async function loginUser(userData) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
}

// Create a new trip
export async function createTrip(tripData) {
  return authenticatedRequest("/trips", {
    method: "POST",
    body: JSON.stringify(tripData)
  });
}

// Get logged-in user's trips
export async function getMyTrips() {
  return authenticatedRequest("/trips/my-trips");
}

// Update a trip
export async function updateTrip(id, tripData) {
  return authenticatedRequest(`/trips/${id}`, {
    method: "PUT",
    body: JSON.stringify(tripData)
  });
}

// Delete a trip
export async function deleteTrip(id) {
  return authenticatedRequest(`/trips/${id}`, {
    method: "DELETE"
  });
}

// Add an expense to a trip
export async function addExpense(tripId, expenseData) {
  return authenticatedRequest(`/expenses/${tripId}`, {
    method: "POST",
    body: JSON.stringify(expenseData)
  });
}

// Get expenses of a trip
export async function getTripExpenses(tripId) {
  return authenticatedRequest(`/expenses/${tripId}`);
}

export async function deleteExpense(tripId, expenseId) {
  return authenticatedRequest(
    `/expenses/${tripId}/${expenseId}`,
    {
      method: "DELETE"
    }
  );
}

