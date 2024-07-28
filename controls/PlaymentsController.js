const stripe = require('stripe')('sk_test_51PeS2dDtyvwkHWIGuPknzahQ6lEzesv0v0rCawHQraKYfCCHqEtxARcktfmcPC4Wsv3nEbCLaq2M5C6PlCGxQNcw00lZNZf4Bu');
const User = require('../models/user');
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
            success_url: `http://localhost:3000/top/coin/Successful`,
            cancel_url: `http://localhost:3000/top/coin/Canceled`,
        });

        res.json({ url: session.url });
    } catch (error) {
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

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const session = event.data.object;
            const { customer_email, amount_total } = session;

            // Find user by email and add points
            const user = await User.findOne({ email: customer_email });
            if (user) {
                let pointsToAdd = 0;
                switch (amount_total) {
                    case 2000: // 20 บาท
                        pointsToAdd = 100;
                        break;
                    case 5000: // 50 บาท
                        pointsToAdd = 500;
                        break;
                    case 10000: // 100 บาท
                        pointsToAdd = 2000;
                        break;
                    // Add more cases as needed
                }
                user.points += pointsToAdd;
                await user.save();
            }
            break;
        // Add cases for other events if needed
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

module.exports = {getTopup,postCreatePayment, webhook , getSuccessful, getPaymentCanceled}