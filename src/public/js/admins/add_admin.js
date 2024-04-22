document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.input-search-id');
    const searchResult = document.querySelector('.search_result');

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const searchInput = document.querySelector('#searchID').value;

        try {
            const response = await fetch(`/search/user/${searchInput}`);
            const data = await response.json();

            // Clear previous search results
            searchResult.innerHTML = '';

            if (data.length === 0) {
                searchResult.innerHTML = '<div class="no-result">ไม่พบผู้ใช้</div>';
            } else {
                data.forEach((user, index) => {
                    const approvalStatus = user.approval_admin ? 'อนุมัติแล้ว' : 'รอการอนุมัติ';

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${index + 1}</td>
                        <td><a href="#">${user.userid}</a></td>
                        <td>${user.createdAt}</td>
                        <td><a href="#">${user.username}</a></td>
                        <td><a href="#">${user.email}</a></td>
                        <td>
                            <button class="admin-approval-btn" data-userid="${user.userid}" data-approval="${user.approval_admin}">
                                ${approvalStatus}
                            </button>
                        </td>
                    `;
                    searchResult.appendChild(tr);
                });
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    searchResult.addEventListener('click', async (event) => {
        event.preventDefault()
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
});

let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".sidebarBtn");
sidebarBtn.onclick = function () {
    sidebar.classList.toggle("active");
    if (sidebar.classList.contains("active")) {
        sidebarBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else
        sidebarBtn.classList.replace("bx-menu-alt-right", "bx-menu");
}
