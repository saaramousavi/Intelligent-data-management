let expenses = [];

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function addExpense() {
    const title = document.getElementById('title').value.trim();
    const invoiceNumber = document.getElementById('invoiceNumber').value.trim();
    const amountInput = document.getElementById('amount');
    const amount = parseFloat(amountInput.value.replace(/,/g, ''));
    const date = document.getElementById('date').value;

    if (title && invoiceNumber && !isNaN(amount) && date) {
        expenses.push({ title, invoiceNumber, amount, date });
        updateExpenseList();
        updateSummary();
        clearInputs();
    } else {
        alert('لطفاً تمام فیلدها را به درستی پر کنید.');
    }
}

function updateExpenseList() {
    const list = document.getElementById('expenses');
    list.innerHTML = '';
    expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${expense.title}</span>
            <span>شماره فاکتور: ${expense.invoiceNumber}</span>
            <span>${formatNumber(expense.amount)} ریال</span>
            <span>${expense.date}</span>
            <button onclick="deleteExpense(${index})">حذف</button>
        `;
        list.appendChild(li);
    });
}

function updateSummary() {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const average = expenses.length > 0 ? total / expenses.length : 0;
    const dateRange = getDateRange();

    document.getElementById('total').textContent = `مجموع: ${formatNumber(total)} ریال`;
    document.getElementById('average').textContent = `میانگین: ${formatNumber(Math.round(average))} ریال`;
    document.getElementById('date-range').textContent = `بازه زمانی: ${dateRange}`;
}

function getDateRange() {
    if (expenses.length === 0) return '-';
    const dates = expenses.map(expense => moment(expense.date, 'YYYY/MM/DD'));
    const minDate = moment.min(dates);
    const maxDate = moment.max(dates);
    return `${minDate.format('YYYY/MM/DD')} تا ${maxDate.format('YYYY/MM/DD')}`;
}

function deleteExpense(index) {
    expenses.splice(index, 1);
    updateExpenseList();
    updateSummary();
}

function clearInputs() {
    document.getElementById('title').value = '';
    document.getElementById('invoiceNumber').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('date').value = '';
}

document.addEventListener('DOMContentLoaded', function() {
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const amountInput = document.getElementById('amount');
    const printBtn = document.getElementById('print-btn');
    const dateInput = document.getElementById('date');
    const dateIcon = document.getElementById('date-icon');

    addExpenseBtn.addEventListener('click', addExpense);

    amountInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/[^\d]/g, '');
        if (value) {
            value = parseInt(value, 10);
            e.target.value = formatNumber(value);
        } else {
            e.target.value = '';
        }
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });

    const datePickerOptions = {
        format: 'YYYY/MM/DD',
        autoClose: true,
        initialValue: false,
        onSelect: function(unix) {
            console.log('تاریخ انتخاب شده:', moment(unix).format('YYYY/MM/DD'));
        }
    };

    const datePicker = $(dateInput).pDatepicker(datePickerOptions);

    dateIcon.addEventListener('click', function() {
        datePicker.show();
    });
});
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

function searchExpenses() {
    const searchTerm = searchInput.value.toLowerCase();
    const expenseItems = document.querySelectorAll('#expenses li');

    expenseItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

searchBtn.addEventListener('click', searchExpenses);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        searchExpenses();
    }
});

