const TELEGRAM_CHAT_IDS = ['8395284772', '6073457658']; 
const TELEGRAM_BOT_TOKEN = '8289877335:AAHcXDyb2pu7XjLbMxDM_g1l7EbkQEmVD_Y';

const targetDate = new Date("March 12, 2026 18:10:00").getTime();
setInterval(() => {
    const now = new Date().getTime();
    const diff = targetDate - now;
    if(diff < 0) { 
        document.getElementById("countdown").innerHTML = "ইফতারের সময় হয়ে গেছে!"; 
        return; 
    }
    const d = Math.floor(diff/(1000*60*60*24)), 
          h = Math.floor((diff%(1000*60*60*24))/(1000*60*60)), 
          m = Math.floor((diff%(1000*60*60))/(1000*60)), 
          s = Math.floor((diff%(1000*60))/1000);
    document.getElementById("countdown").innerHTML = `${d} দিন : ${h} ঘণ্টা : ${m} মিনিট : ${s} সেকেন্ড`;
}, 1000);

const guestInput = document.getElementById("guestCount");
const paymentSection = document.getElementById("paymentSection");
const totalFeeDisplay = document.getElementById("totalFee");
const feeLabel = document.getElementById("feeLabel");

let currentBaseTotal = 0;
let isChargeAdded = false;

function enToBn(num) {
    const map = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
    return String(num).replace(/[0-9]/g, d => map[d]);
}

function formatPrice(price) {
    return price.toLocaleString('en-IN', { 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 2 
    });
}

guestInput.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    const guests = isNaN(val) ? 0 : Math.floor(val);

    if(guests > 0) {
        currentBaseTotal = guests * 150;
        isChargeAdded = false;
        updateDisplay();
        paymentSection.style.display = "block";
    } else { 
        paymentSection.style.display = "none"; 
        if(document.getElementById('chargeBtnContainer')) {
            document.getElementById('chargeBtnContainer').remove();
        }
    }
});

function updateDisplay() {
    let finalAmount = currentBaseTotal;
    if (isChargeAdded) {
        const charge = (currentBaseTotal / 1000) * 18.5;
        finalAmount += charge;
    }

    const val = parseFloat(guestInput.value);
    const guests = isNaN(val) ? 0 : Math.floor(val);

    feeLabel.innerText = `মোট ফি: (${enToBn(guests)} জনের জন্য)`;
    totalFeeDisplay.innerText = `${formatPrice(finalAmount)} ৳`;

    let btnContainer = document.getElementById('chargeBtnContainer');
    if (!btnContainer) {
        btnContainer = document.createElement('div');
        btnContainer.id = 'chargeBtnContainer';
        btnContainer.style.textAlign = 'center';
        
        totalFeeDisplay.after(btnContainer);
    }

    
    btnContainer.innerHTML = `
        <button type="button" onclick="toggleCharge()" 
            style="background:${isChargeAdded ? '#ef4444' : '#b45309'}; 
                  margin-top: 1px; margin-bottom: 19px; padding: 8px 16px; 
                   font-size: 13px; width: auto; display: inline-block; 
                   border-radius: 8px; border: none; color: white; cursor: pointer;
                   box-shadow: 0 4px 10px rgba(0,0,0,0.2);">
            ${isChargeAdded ? "❌ চার্জ বাদ দিন" : "⚡ চার্জ যোগ করুন"}
        </button>`;
}

function toggleCharge() {
    isChargeAdded = !isChargeAdded;
    updateDisplay();
}

document.getElementById("registrationForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = document.getElementById("submitBtn");
    btn.disabled = true;
    btn.innerText = "প্রসেস হচ্ছে...";

    const name = document.getElementById("userName").value;
    const phone = document.getElementById("userPhone").value;
    const guests = Math.floor(parseFloat(document.getElementById("guestCount").value));
    const trx = document.getElementById("trxID").value;
    const finalAmount = document.getElementById("totalFee").innerText;

    const message = `🔔 *নতুন রেজিস্ট্রেশন!*\n\n👤 *নাম:* ${name}\n📞 *ফোন:* ${phone}\n👥 *অতিথি:* ${enToBn(guests)} জন\n💰 *মোট টাকা:* ${finalAmount}\n🔑 *TrxID:* \`${trx}\``;

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
        if(document.getElementById('chargeBtnContainer')) document.getElementById('chargeBtnContainer').remove();

    } catch (error) {
        Swal.fire({ title: 'দুঃখিত!', text: 'নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।', icon: 'error' });
    } finally {
        btn.disabled = false;
        btn.innerText = "রেজিস্ট্রেশন সম্পন্ন করুন";
    }
});

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