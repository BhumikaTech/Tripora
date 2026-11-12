
import { useEffect, useState } from "react";

import {
  Plane,
  Plus,
  MapPin,
  CalendarDays,
  Wallet,
  Trash2,
  LoaderCircle,
  X,
  Pencil,
  Receipt,
  TrendingDown,
  PieChart,
  IndianRupee
} from "lucide-react";

import {
  getMyTrips,
  createTrip,
  updateTrip,
  deleteTrip,
  addExpense,
  getTripExpenses,
  deleteExpense
} from "./services/api";

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editingTripId, setEditingTripId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: ""
  });

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [expenseSummary, setExpenseSummary] = useState(null);
  const [expenseLoading, setExpenseLoading] = useState(false);
  const [expenseError, setExpenseError] = useState("");
  const [expenseSaving, setExpenseSaving] = useState(false);

  const [expenseData, setExpenseData] = useState({
    title: "",
    amount: "",
    category: "Food"
  });

  // Load trips
  const loadTrips = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyTrips();
      setTrips(data.trips || []);

    } catch (err) {
      setError(err.message || "Unable to load trips");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  // Handle trip form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Open create form
  const openCreateForm = () => {
    setEditingTripId(null);

    setFormData({
      title: "",
      destination: "",
      startDate: "",
      endDate: "",
      budget: ""
    });

    setFormError("");
    setShowForm(true);
  };

  // Open edit form
  const openEditForm = (trip) => {
    setEditingTripId(trip._id);

    setFormData({
      title: trip.title || "",
      destination: trip.destination || "",
      startDate: trip.startDate
        ? new Date(trip.startDate).toISOString().split("T")[0]
        : "",
      endDate: trip.endDate
        ? new Date(trip.endDate).toISOString().split("T")[0]
        : "",
      budget: trip.budget ?? ""
    });

    setFormError("");
    setShowForm(true);
  };

  // Create or update trip
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setFormError("");

      const tripData = {
        ...formData,
        budget: Number(formData.budget)
      };

      if (editingTripId) {
        await updateTrip(editingTripId, tripData);
      } else {
        await createTrip(tripData);
      }

      setShowForm(false);
      await loadTrips();

    } catch (err) {
      setFormError(err.message || "Unable to save trip");
    } finally {
      setSaving(false);
    }
  };

  // Delete trip
  const handleDelete = async (tripId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this trip?"
    );

    if (!confirmed) return;

    try {
      await deleteTrip(tripId);

      setTrips((previousTrips) =>
        previousTrips.filter((trip) => trip._id !== tripId)
      );

    } catch (err) {
      setError(err.message || "Unable to delete trip");
    }
  };

  // Close trip form
  const closeForm = () => {
    setShowForm(false);
    setFormError("");
    setEditingTripId(null);
  };

  // Open expense modal
  const openExpenses = async (trip) => {
    setSelectedTrip(trip);
    setExpenses([]);
    setExpenseSummary(null);
    setExpenseError("");
    setExpenseLoading(true);

    try {
      const data = await getTripExpenses(trip._id);

      setExpenses(data.expenses || []);
      setExpenseSummary(data);

    } catch (err) {
      setExpenseError(err.message || "Unable to load expenses");
    } finally {
      setExpenseLoading(false);
    }
  };

  // Handle expense form inputs
  const handleExpenseChange = (e) => {
    setExpenseData({
      ...expenseData,
      [e.target.name]: e.target.value
    });
  };

  // Add expense
  const handleAddExpense = async (e) => {
    e.preventDefault();

    if (!expenseData.title.trim() || !expenseData.amount) {
      setExpenseError("Please enter expense title and amount");
      return;
    }

    if (Number(expenseData.amount) <= 0) {
      setExpenseError("Amount must be greater than zero");
      return;
    }

    try {
      setExpenseSaving(true);
      setExpenseError("");

      await addExpense(selectedTrip._id, {
        title: expenseData.title.trim(),
        amount: Number(expenseData.amount),
        category: expenseData.category
      });

      const data = await getTripExpenses(selectedTrip._id);

      setExpenses(data.expenses || []);
      setExpenseSummary(data);

      setExpenseData({
        title: "",
        amount: "",
        category: "Food"
      });

    } catch (err) {
      setExpenseError(err.message || "Unable to add expense");
    } finally {
      setExpenseSaving(false);
    }
  };

  // Delete expense
  const handleDeleteExpense = async (expenseId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) return;

    try {
      setExpenseError("");

      await deleteExpense(selectedTrip._id, expenseId);

      const data = await getTripExpenses(selectedTrip._id);

      setExpenses(data.expenses || []);
      setExpenseSummary(data);

    } catch (err) {
      setExpenseError(err.message || "Unable to delete expense");
    }
  };

  // Close expense modal
  const closeExpenses = () => {
    setSelectedTrip(null);
    setExpenses([]);
    setExpenseSummary(null);
    setExpenseError("");
  };

  // Format dates
  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Calculate budget percentage
  const budgetPercentage =
    selectedTrip && selectedTrip.budget > 0 && expenseSummary
      ? Math.min(
          100,
          Math.max(
            0,
            (expenseSummary.totalExpense / selectedTrip.budget) * 100
          )
        )
      : 0;

  return (
    <section className="my-trips-section" id="my-trips">
      <div className="trips-container">

        <div className="trips-heading">
          <div>
            <span className="section-tag">YOUR JOURNEY</span>
            <h2>My Trips</h2>
            <p>All your adventures, organized in one place.</p>
          </div>

          <button
            className="create-trip-btn"
            onClick={openCreateForm}
          >
            <Plus size={18} />
            Create Trip
          </button>
        </div>

        {/* Trip statistics */}
        <div className="trip-stats">
          <div className="trip-stat-card">
            <Plane size={22} />
            <div>
              <h3>{trips.length}</h3>
              <p>Total Trips</p>
            </div>
          </div>

          <div className="trip-stat-card">
            <MapPin size={22} />
            <div>
              <h3>
                {new Set(trips.map((trip) => trip.destination)).size}
              </h3>
              <p>Destinations</p>
            </div>
          </div>
        </div>

        {loading && (
          <div className="trips-message">
            <LoaderCircle className="spin" size={25} />
            <p>Loading your trips...</p>
          </div>
        )}

        {!loading && error && (
          <div className="trips-message">
            <p>{error}</p>
            <button onClick={loadTrips}>Try Again</button>
          </div>
        )}

        {!loading && !error && trips.length === 0 && (
          <div className="empty-trips">
            <Plane size={42} />
            <h3>No trips yet</h3>
            <p>Your next adventure starts here.</p>

            <button
              className="create-trip-btn"
              onClick={openCreateForm}
            >
              <Plus size={18} />
              Create Your First Trip
            </button>
          </div>
        )}

        {/* Trip cards */}
        {!loading && trips.length > 0 && (
          <div className="trips-grid">
            {trips.map((trip) => (
              <div className="my-trip-card" key={trip._id}>

                <div className="my-trip-card-top">
                  <div className="trip-card-icon">
                    <Plane size={23} />
                  </div>

                  <div className="trip-card-actions">
                    <button
                      className="trip-edit-btn"
                      onClick={() => openEditForm(trip)}
                      title="Edit trip"
                    >
                      <Pencil size={17} />
                    </button>

                    <button
                      className="trip-delete-btn"
                      onClick={() => handleDelete(trip._id)}
                      title="Delete trip"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                <h3>{trip.title}</h3>

                <p className="trip-destination">
                  <MapPin size={16} />
                  {trip.destination}
                </p>

                <div className="trip-card-details">
                  <div>
                    <CalendarDays size={16} />
                    <span>{formatDate(trip.startDate)}</span>
                  </div>

                  <div>
                    <CalendarDays size={16} />
                    <span>{formatDate(trip.endDate)}</span>
                  </div>

                  <div>
                    <Wallet size={16} />
                    <span>
                      ₹{Number(trip.budget || 0).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <button
                  className="manage-expenses-btn"
                  onClick={() => openExpenses(trip)}
                >
                  <Receipt size={17} />
                  Manage Expenses
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Trip Modal */}
      {showForm && (
        <div className="trip-form-overlay">
          <div className="trip-form-modal">

            <button
              className="trip-form-close"
              onClick={closeForm}
            >
              <X size={21} />
            </button>

            <span className="section-tag">
              {editingTripId ? "UPDATE YOUR JOURNEY" : "PLAN YOUR JOURNEY"}
            </span>

            <h2>{editingTripId ? "Edit Trip" : "Create New Trip"}</h2>

            <p className="trip-form-subtitle">
              Add your travel details below.
            </p>

            <form onSubmit={handleSubmit}>
              <label>Trip Name</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Manali Adventure"
                value={formData.title}
                onChange={handleChange}
                required
              />

              <label>Destination</label>
              <input
                type="text"
                name="destination"
                placeholder="Where are you going?"
                value={formData.destination}
                onChange={handleChange}
                required
              />

              <div className="trip-date-row">
                <div>
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={formData.startDate || undefined}
                    required
                  />
                </div>
              </div>

              <label>Total Budget (₹)</label>
              <input
                type="number"
                name="budget"
                placeholder="Enter your budget"
                value={formData.budget}
                onChange={handleChange}
                min="1"
                required
              />

              {formError && (
                <p className="trip-form-error">{formError}</p>
              )}

              <button
                type="submit"
                className="trip-form-submit"
                disabled={saving}
              >
                {saving ? (
                  <LoaderCircle className="spin" size={18} />
                ) : (
                  <Plus size={18} />
                )}

                {saving
                  ? "Saving..."
                  : editingTripId
                    ? "Update Trip"
                    : "Create Trip"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Expense Modal */}
      {selectedTrip && (
        <div className="expense-overlay">
          <div className="expense-modal">

            <button
              className="trip-form-close"
              onClick={closeExpenses}
            >
              <X size={21} />
            </button>

            <span className="section-tag">TRIP BUDGET</span>

            <h2>{selectedTrip.title}</h2>

            <p className="trip-form-subtitle">
              Manage your expenses for {selectedTrip.destination}.
            </p>

            {expenseSummary && (
              <>
                {/* Expense summary cards */}
                <div className="expense-summary">
                  <div className="expense-summary-card">
                    <TrendingDown size={20} />
                    <p>Total Spent</p>
                    <h3>
                      ₹{Number(expenseSummary.totalExpense || 0).toLocaleString("en-IN")}
                    </h3>
                  </div>

                  <div className="expense-summary-card">
                    <Wallet size={20} />
                    <p>Remaining Budget</p>
                    <h3>
                      ₹{Number(expenseSummary.remainingBudget || 0).toLocaleString("en-IN")}
                    </h3>
                  </div>
                </div>

                {/* Budget progress bar */}
                <div className="budget-progress-section">
                  <div className="budget-progress-heading">
                    <span>Budget Used</span>
                    <strong>{Math.round(budgetPercentage)}%</strong>
                  </div>

                  <div className="budget-progress-track">
                    <div
                      className="budget-progress-fill"
                      style={{
                        width: `${budgetPercentage}%`
                      }}
                    />
                  </div>

                  <p>
                    Budget: ₹{Number(selectedTrip.budget || 0).toLocaleString("en-IN")}
                  </p>
                </div>
              </>
            )}

            {expenseLoading && (
              <div className="trips-message">
                <LoaderCircle className="spin" size={24} />
                <p>Loading expenses...</p>
              </div>
            )}

            {!expenseLoading && (
              <>
                {/* Add expense form */}
                <div className="expense-form-section">
                  <h3>
                    <Plus size={19} />
                    Add New Expense
                  </h3>

                  <form onSubmit={handleAddExpense}>
                    <input
                      type="text"
                      name="title"
                      placeholder="Expense title"
                      value={expenseData.title}
                      onChange={handleExpenseChange}
                      required
                    />

                    <input
                      type="number"
                      name="amount"
                      placeholder="Amount (₹)"
                      min="1"
                      value={expenseData.amount}
                      onChange={handleExpenseChange}
                      required
                    />

                    <select
                      name="category"
                      value={expenseData.category}
                      onChange={handleExpenseChange}
                    >
                      <option value="Food">Food</option>
                      <option value="Hotel">Hotel</option>
                      <option value="Transport">Transport</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Other">Other</option>
                    </select>

                    {expenseError && (
                      <p className="trip-form-error">{expenseError}</p>
                    )}

                    <button type="submit" disabled={expenseSaving}>
                      {expenseSaving ? "Adding..." : "Add Expense"}
                    </button>
                  </form>
                </div>

                {/* Expense history */}
                <div className="expense-list-section">
                  <h3>
                    <Receipt size={19} />
                    Expense History
                  </h3>

                  {expenses.length === 0 ? (
                    <div className="no-expenses">
                      <Receipt size={30} />
                      <p>No expenses added yet.</p>
                    </div>
                  ) : (
                    expenses.map((expense) => (
                      <div className="expense-item" key={expense._id}>
                        <div className="expense-item-icon">
                          <IndianRupee size={19} />
                        </div>

                        <div className="expense-item-info">
                          <h4>{expense.title}</h4>
                          <p>{expense.category}</p>
                        </div>

                        <div className="expense-item-amount">
                          <strong>
                            ₹{Number(expense.amount).toLocaleString("en-IN")}
                          </strong>

                          <button
                            className="trip-delete-btn"
                            onClick={() => handleDeleteExpense(expense._id)}
                            title="Delete expense"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Category breakdown */}
                {expenseSummary?.categorySummary?.length > 0 && (
                  <div className="expense-category-section">
                    <h3>
                      <PieChart size={19} />
                      Category Breakdown
                    </h3>

                    {expenseSummary.categorySummary.map((item) => (
                      <div className="category-row" key={item.category}>
                        <span>{item.category}</span>
                        <strong>
                          ₹{Number(item.total).toLocaleString("en-IN")}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default MyTrips;
