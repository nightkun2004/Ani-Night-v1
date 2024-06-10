function filterTable() {
    const searchInput = document.getElementById('searchID');
    const filter = searchInput.value.toLowerCase();
    const rows = document.querySelectorAll('.user-row');

    rows.forEach(row => {
        const idCell = row.querySelector('td:nth-child(2)');
        const id = idCell.textContent.toLowerCase();
        if (id.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

// เพิ่ม event listener สำหรับการกรองแบบเรียลไทม์
document.getElementById('searchID').addEventListener('input', filterTable);

// ฟังก์ชันสำหรับการจัดการการอนุมัติแอดมิน
document.getElementById('userTable').addEventListener('click', async (event) => {
    event.preventDefault();
    if (event.target.classList.contains('admin-approval-btn')) {
        const userId = event.target.dataset.userid;
        const currentApproval = JSON.parse(event.target.dataset.approval);

        try {
            const response = await fetch(`/admin/approve/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ approval_admin: !currentApproval })
            });

            const data = await response.json();
            // Update button text
            event.target.textContent = data.approval_admin ? 'อนุมัติแล้ว' : 'รอการอนุมัติ';
            // Update data-approval attribute
            event.target.dataset.approval = data.approval_admin;
        } catch (error) {
            console.error('Error:', error);
        }
    }
});