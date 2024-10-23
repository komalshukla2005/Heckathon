const expenseForm = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');
const totalExpenses = document.getElementById('total-expenses');
const editModal = document.getElementById('edit-modal');
let expenses = [];
let currentEditingExpenseId = null;

const fetchExpenses = async () => {
    const response = await fetch('/api/expenses');
    expenses = await response.json();
    renderExpenses();
};

const renderExpenses = () => {
    expenseList.innerHTML = '';
    let total = 0;
    expenses.forEach(expense => {
        const item = document.createElement('div');
        item.className = 'expense-item';
        item.innerHTML = `
            <span>Name:${expense.name} </span> <br> <span> Price : $${expense.amount} </span> <br> 
           <span> Cetegory : ${expense.category}</span>
                       <span>Date: ${expense.date}</span>  <!-- Display date -->
            <button onclick="openEditModal('${expense._id}')">Edit</button>
            <button onclick="deleteExpense('${expense._id}')">Delete</button>
        `;
        expenseList.appendChild(item);
        total += expense.amount;
    });

    totalExpenses.innerText = `Total: $${total}`;
};

expenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newExpense = {
        name: expenseForm['expense-name'].value,
        amount: +expenseForm['expense-amount'].value,
        category: expenseForm['expense-category'].value,
        date: expenseForm['expense-date'].value,
    };

    await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
    });
    fetchExpenses();
    expenseForm.reset();
});

const openEditModal = (id) => {
    const expense = expenses.find(exp => exp._id === id);
    currentEditingExpenseId = id;
    document.getElementById('edit-expense-name').value = expense.name;
    document.getElementById('edit-expense-amount').value = expense.amount;
    document.getElementById('edit-expense-category').value = expense.category;
    document.getElementById('edit-expense-date').value = expense.date; 
    editModal.style.display = 'block';
};

document.getElementById('close-modal').addEventListener('click', () => {
    editModal.style.display = 'none';
});

document.getElementById('edit-expense-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedExpense = {
        name: document.getElementById('edit-expense-name').value,
        amount: +document.getElementById('edit-expense-amount').value,
        category: document.getElementById('edit-expense-category').value,
        date: document.getElementById('edit-expense-date').value, 
    };

    await fetch(`/api/expenses/${currentEditingExpenseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedExpense),
    });

    editModal.style.display = 'none';
    fetchExpenses();
});

const deleteExpense = async (id) => {
    await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
    fetchExpenses();
};

fetchExpenses();
