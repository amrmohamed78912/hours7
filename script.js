document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#hoursTable tbody');
    const calculateTotalButton = document.getElementById('calculateTotal');
    const resetButton = document.getElementById('reset');

    // Create 31 rows for the month
    for (let i = 1; i <= 31; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i}</td>
            <td><input type="time" class="check-in"></td>
            <td><input type="time" class="check-out"></td>
            <td class="hours">0</td>
        `;
        tableBody.appendChild(row);
    }

    // Calculate hours
    function calculateHours() {
        const rows = tableBody.querySelectorAll('tr');
        rows.forEach(row => {
            const checkIn = row.querySelector('.check-in').value;
            const checkOut = row.querySelector('.check-out').value;
            const hoursCell = row.querySelector('.hours');

            if (checkIn && checkOut) {
                const checkInDate = new Date(`1970-01-01T${checkIn}:00`);
                const checkOutDate = new Date(`1970-01-01T${checkOut}:00`);

                if (checkOutDate < checkInDate) {
                    checkOutDate.setDate(checkOutDate.getDate() + 1);
                }

                const diffMs = checkOutDate - checkInDate;
                const diffHours = (diffMs / 1000 / 60 / 60).toFixed(2);
                hoursCell.textContent = diffHours;
            }
        });
    }

    // Calculate total hours
    function calculateTotalHours() {
        calculateHours();
        const rows = tableBody.querySelectorAll('tr');
        let total = 0;
        rows.forEach(row => {
            total += parseFloat(row.querySelector('.hours').textContent) || 0;
        });
        alert(`إجمالي الساعات: ${total.toFixed(2)} ساعة`);
    }

    // Reset the form
    function resetForm() {
        tableBody.querySelectorAll('input').forEach(input => input.value = '');
        tableBody.querySelectorAll('.hours').forEach(cell => cell.textContent = '0');
    }

    // Event listeners
    calculateTotalButton.addEventListener('click', calculateTotalHours);
    resetButton.addEventListener('click', resetForm);

    // Save changes to local storage
    function saveToLocalStorage() {
        const rows = tableBody.querySelectorAll('tr');
        const data = Array.from(rows).map(row => {
            return {
                checkIn: row.querySelector('.check-in').value,
                checkOut: row.querySelector('.check-out').value,
                hours: row.querySelector('.hours').textContent
            };
        });
        localStorage.setItem('workHours', JSON.stringify(data));
    }

    function loadFromLocalStorage() {
        const data = JSON.parse(localStorage.getItem('workHours'));
        if (data) {
            const rows = tableBody.querySelectorAll('tr');
            data.forEach((item, index) => {
                if (rows[index]) {
                    rows[index].querySelector('.check-in').value = item.checkIn;
                    rows[index].querySelector('.check-out').value = item.checkOut;
                    rows[index].querySelector('.hours').textContent = item.hours;
                }
            });
        }
    }

    // Load saved data
    loadFromLocalStorage();

    // Save data on input change
    tableBody.addEventListener('input', saveToLocalStorage);
});
