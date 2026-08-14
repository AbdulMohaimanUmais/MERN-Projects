const stripe = require('../utils/stripe');
const User = require('../models/User');

const PRICE_ID = process.env.STRIPE_PRICE_ID; // Pro plan price ID (Stripe dashboard se banao)

exports.createCheckoutSession = async (req, res) => {
  try {
    const user = req.user;

    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/dashboard?canceled=true`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    await User.findOneAndUpdate(
      { stripeCustomerId: session.customer },
      { plan: 'pro', subscriptionId: session.subscription, usageCount: 0 }
    );
  }

  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object;
    await User.findOneAndUpdate(
      { subscriptionId: sub.id },
      { plan: 'free' }
    );
  }

  res.json({ received: true });
};