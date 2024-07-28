let selectedPriceId = null;
const profileContent = document.querySelector('.profile-content');
let userEmail = profileContent ? profileContent.dataset.useremail : null;
console.log(userEmail)

function selectItem(element, priceId) {
    // ซ่อนข้อความ "กำลังเลือก" จากไอเทมทั้งหมด
    const items = document.querySelectorAll('.item .selection-text');
    items.forEach(item => item.classList.add('hidden'));
    
    // แสดงข้อความ "กำลังเลือก" สำหรับไอเทมที่ถูกคลิก
    const selectionText = element.querySelector('.selection-text');
    selectionText.classList.remove('hidden');
    
    // แสดงปุ่ม "ชำระเงิน"
    const payButton = document.getElementById('payButton');
    payButton.classList.remove('hidden');
    
    // บันทึกราคา ID ที่เลือกไว้
    selectedPriceId = priceId;
}

async function checkout() {
    if (!selectedPriceId) {
        alert('กรุณาเลือกไอเทมก่อนชำระเงิน');
        return;
    }

    try {
        const response = await fetch('/top/coin/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId: selectedPriceId,
                email: userEmail
            })
        });

        console.log(response)

        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }

        const session = await response.json();

        // Redirect to Stripe Checkout
        window.location.href = session.url;
    } catch (error) {
        console.error('Error:', error);
    }
}