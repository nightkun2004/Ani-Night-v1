const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
// const sidebarExpand = document.querySelector(".expand_sidebar");
sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

// sidebarExpand.addEventListener("click", () => {
//   sidebar.classList.remove("close", "hoverable");
// });

sidebar.addEventListener("mouseenter", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
});
sidebar.addEventListener("mouseleave", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
});

darkLight.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    document.setI
    darkLight.classList.replace("bx-sun", "bx-moon");
  } else {
    darkLight.classList.replace("bx-moon", "bx-sun");
  }
});

submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
    submenuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show_submenu");
      }
    });
  });
});

const content = document.querySelector('.content');

if (window.innerWidth < 768) {
  sidebar.classList.add("close");
  content.style.padding = '0';
  content.style.marginLeft = '0'
} else {
  sidebar.classList.remove("close");
  content.style.padding = '12px 16px';
  content.style.marginLeft = '250px'
}

const fome_Content_login = document.querySelector(".fome-content_login");
const fome_Content_Signup = document.querySelector(".form-content_signup");
const sigup_btn = document.getElementById("sigup_btn");
const login_btn = document.getElementById("login_btn");


sigup_btn.addEventListener("click", (e)=> {
    e.preventDefault();
    fome_Content_login.style.display = 'none';
    fome_Content_Signup.style.display = 'block';
})
login_btn.addEventListener("click", (e)=> {
    e.preventDefault();
    fome_Content_login.style.display = 'block';
    fome_Content_Signup.style.display = 'none';
})

const windoe_popup_login = document.getElementById("btn_open-login_popup")
window.onclick = function(e) {
    if(e.traget == windoe_popup_login) {
        windoe_popup_login.style.display = 'none';
    }
}

// สำหรับการแจ้งเตือน
const btn_bell = document.getElementById("btn_bell");
const mass_popup = document.querySelector(".mass");
let Openmasspopup = false;

btn_bell.addEventListener("click", () => {
    if (!Openmasspopup) {
        mass_popup.style.display = 'block';
        Openmasspopup = true;
    } else {
        mass_popup.style.display = 'none';
        Openmasspopup = false;
    }
});

window.onclick = function(e) {
    if (e.target == mass_popup) {
        mass_popup.style.display = 'none';
    }
};
