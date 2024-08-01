const stripe = require('stripe')(process.env.STRIPE_WEBHOOK_SECRET);
const User = require('../models/user');
const Payment = require('../models/playment');
require("dotenv").config();

const getTopup = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        if (!usersesstion) {
            return res.redirect('/login')
        }
        res.render("./component/Playments/Topup", { active: 'Topup',usersesstion});
    } catch (error) {
        console.error( error); 
        res.status(500).json({ message: error });
    }
}
const postCreatePayment = async (req, res) => {
    const { priceId, email } = req.body;
    console.log("Price ID:", priceId);

    try {
        const session = await stripe.checkout.sessions.create({
            customer_email: email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.DOMAIN}/top/coin/Successful`,
            cancel_url: `${process.env.DOMAIN}/top/coin/Canceled`,
        });

        console.log(session)
        const order = new Payment({
            userid: req.session.userlogin._id,
            order: session.id
        });

        await order.save(); 
        console.log("order save",order )

        res.json({ url: session.url });
    } catch (error) {
        console.log("Internal Server Error", error)
        res.status(500).json({ error: error });
    }
}

const webhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return res.sendStatus(400);
    }

    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const { id, customer_email, amount_total } = session;

            // ตรวจสอบคำสั่งซื้อในฐานข้อมูล
            const order = await Payment.findOne({ order: id });
            if (order) {
                // อัปเดตสถานะคำสั่งซื้อเป็น 'completed'
                order.status = 'completed';
                await order.save();

                // หาและอัพเดตคะแนนของผู้ใช้
                const user = await User.findOne({ email: customer_email });
                if (user) {
                    let pointsToAdd = 0;
                    switch (amount_total) {
                        case 2000:
                            pointsToAdd = 100;
                            break;
                        case 5000:
                            pointsToAdd = 500;
                            break;
                        case 10000:
                            pointsToAdd = 2000;
                            break;
                        default:
                            pointsToAdd = 0;
                    }
                    user.points += pointsToAdd;
                    await user.save();
                    console.log('User points updated:', user);
                }
            } else {
                console.log(`Order ${id} not found in database.`);
            }
            break;

        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    res.send();
};

const getSuccessful = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        res.render("./component/Playments/Successful", { active: 'Playment',usersesstion});
    } catch (error) {
        console.error( error); 
        res.status(500).json({ message: error });
    }
}
const getPaymentCanceled = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        res.render("./component/Playments/Canceled", { active: 'Playment',usersesstion});
    } catch (error) {
        console.error( error); 
        res.status(500).json({ message: error });
    }
}

const getOrderStatus = async (req, res) => {
    const { userid, orderid } = req.params;
    const usersesstion = req.session.userlogin;

    try {
        // ค้นหาข้อมูลการสั่งซื้อในฐานข้อมูล
        const order = await Payment.findOne({ userid, order: orderid });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // ตรวจสอบสถานะการสั่งซื้อจาก Stripe
        const session = await stripe.checkout.sessions.retrieve(order.order);

        if (session.payment_status === 'paid') {
            // ค้นหาผู้ใช้
            const user = await User.findById(userid);
            if (user) {
                // กำหนดคะแนนที่จะเพิ่มตามจำนวนเงิน
                let pointsToAdd = 0;
                switch (session.amount_total) {
                    case 2000: // 20 บาท
                        pointsToAdd = 100;
                        break;
                    case 5000: // 50 บาท
                        pointsToAdd = 500;
                        break;
                    case 10000: // 100 บาท
                        pointsToAdd = 2000;
                        break;
                    default:
                        pointsToAdd = 0;
                        break;
                }

                // เพิ่มคะแนนให้กับผู้ใช้
                user.points += pointsToAdd;
                await user.save();

                // ส่งข้อมูลการสั่งซื้อและคะแนนที่เพิ่มให้กับผู้ใช้กลับไป
                res.render("./component/Playments/Successful", { active: 'Playment',usersesstion, order: order, stripeSession: session, pointsAdded: pointsToAdd});
            } else {
                res.render("./component/Playments/Successful",{message: 'User not found' })
            }
        } else {
            res.render("./component/Playments/Successful",{message: 'Order not paid' })
        }
    } catch (error) {
        console.error('Error retrieving order status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {getTopup,postCreatePayment, getOrderStatus, webhook , getSuccessful, getPaymentCanceled}