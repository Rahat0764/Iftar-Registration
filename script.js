const TELEGRAM_CHAT_IDS = ['8395284772', '6073457658']; 
const TELEGRAM_BOT_TOKEN = '8289877335:AAHcXDyb2pu7XjLbMxDM_g1l7EbkQEmVD_Y';

/* Countdown Timer */
const targetDate = new Date("March 12, 2026 18:10:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if(diff < 0) { document.getElementById("countdown").innerHTML = "ইফতারের সময় হয়ে গেছে!"; return; }
    const d = Math.floor(diff/(1000*60*60*24)), h = Math.floor((diff%(1000*60*60*24))/(1000*60*60)), m = Math.floor((diff%(1000*60*60))/(1000*60)), s = Math.floor((diff%(1000*60))/1000);
    document.getElementById("countdown").innerHTML = `${d} দিন : ${h} ঘণ্টা : ${m} মিনিট : ${s} সেকেন্ড`;
}, 1000);

/* Guest Fee Logic */
const guestInput = document.getElementById("guestCount");
const paymentSection = document.getElementById("paymentSection");
guestInput.addEventListener("input", (e) => {
    const guests = parseInt(e.target.value);
    if(guests > 0) {
        document.getElementById("totalFee").innerText = (guests * 150) + " ৳";
        document.getElementById("feeLabel").innerText = `মোট ফি: (${guests} জনের জন্য)`;
        paymentSection.style.display = "block";
    } else { paymentSection.style.display = "none"; }
});

/* Form Submission */
document.getElementById("registrationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.innerText = "প্রসেস হচ্ছে...";

    const name = document.getElementById("userName").value;
    const phone = document.getElementById("userPhone").value;
    const guests = document.getElementById("guestCount").value;
    const trx = document.getElementById("trxID").value;
    const total = guests * 150;

    const message = `🔔 *নতুন রেজিস্ট্রেশন!*\n\n👤 *নাম:* ${name}\n📞 *ফোন:* ${phone}\n👥 *অতিথি:* ${guests} জন\n💰 *ফি:* ${total} ৳\n🔑 *TrxID:* \`${trx}\``;

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    try {
        for (const chatId of TELEGRAM_CHAT_IDS) {
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' })
            });
        }

        Swal.fire({
            title: 'রেজিস্ট্রেশন সফল!',
            text: 'আপনার তথ্য আমাদের কাছে পৌঁছেছে।',
            icon: 'success',
            confirmButtonText: 'ঠিক আছে',
            confirmButtonColor: '#10b981'
        });

        document.getElementById("registrationForm").reset();
        paymentSection.style.display = "none";
    } catch (error) {
        Swal.fire({ title: 'দুঃখিত!', text: 'নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।', icon: 'error' });
    } finally {
        btn.disabled = false;
        btn.innerText = "রেজিস্ট্রেশন সম্পন্ন করুন";
    }
});

/* Copy Number Function */
function copyNumber() {
    const num = document.getElementById("bkashNumber").innerText;
    navigator.clipboard.writeText(num).then(() => {
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true
        });
        Toast.fire({
            icon: 'success',
            title: 'নাম্বার কপি হয়েছে!'
        });
    });
}