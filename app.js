var express = require("express");
const app = express();
const mongoose = require("mongoose");

//Import uuid
const { v4: uuidv4 } = require("uuid");


//Middleware(token authentication,authorization)
app.use(express.json());

// MongoDb connection
mongoose.connect("mongodb://localhost:27017/expenses").then(() => {
    console.log("Connected to the database");
})


//Schema creation
const expenseSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    amount: { type: Number, required: true },

});


//Model creation
const Expenses = mongoose.model("Expenses", expenseSchema);


//Get all expenses
app.post("/api/expenses", async (req, res) => {
    console.log(req.body)
    const { id, title, amount } = req.body;
    try {
        const newExpense = new Expenses({
            id: uuidv4(),
            title: title,
            amount: amount
        });
        const savedExpense = await newExpense.save();
        res.status(200).json(savedExpense);

    }
    catch (err) {
        res.status(200).json({ error: err.message });
    }


});

app.get("/api/expenses", async (req, res) => {
    try {
        const expenses = await Expenses.find();
        console.log(JSON.stringify(expenses));
        res.status(200).json(expenses);
    }
    catch {
        res.status(500).json({ error: err.message });
    }
});

//Get expense by id
app.get("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const expense = await Expenses.findOne({ id: id });
        if (!expense) {
            res.status(404).json({ error: "Expense not found" });
        } else {
            res.status(200).json(expense);
        }
    }
    catch (err) {
        res.status(200).json({ error: err.message });
    }
});


//update expense by id
app.put("/api/expenses/:id", async (req, res) => {
    const { title, amount } = req.body;
    const { id } = req.params;
    try {
        const updateExpense = await Expenses
            .findOneAndUpdate({ id: id }, { title: title, amount: amount });
        if (!updateExpense) {
            res.status(404).json({ error: "Expense not found" });
        }
        res.status(200).json(updateExpense);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//delete expense by id
app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const deleteExpense = await Expenses.findOneAndDelete({ id: id });
        if (!deleteExpense) {
            res.status(404).json({ error: "Expense not found" });
        }
        res.status(200).json(deleteExpense);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});