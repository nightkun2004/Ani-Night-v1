let isSidebarOpen = false;
function toggleSidebar() {
    const sidebar = document.getElementById("sidebarlet");
    ; // เพิ่มบรรทัดนี้

    if (isSidebarOpen) {
        sidebar.style.width = '250px';
        // content.style.marginLeft = "250px";

        isSidebarOpen = false;
    } else {
        sidebar.style.width = '0';
        // content.style.marginLeft = "0"; 
        isSidebarOpen = true;
    }
}