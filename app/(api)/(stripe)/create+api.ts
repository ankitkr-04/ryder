import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, amount } = body;
  if (!name || !email || !amount) {
    return new Response(
      JSON.stringify({ error: "Missing required fields", status: 400 })
    );
  }

  let customer;
  const exisingCustomer = await stripe.customers.list({ email });
  if (exisingCustomer.data.length > 0) customer = exisingCustomer.data[0];
  else {
    const newCustomer = await stripe.customers.create({ email, name });
    customer = newCustomer;
  }

  const emphemeralKey = await stripe.ephemeralKeys.create(
    {
      customer: customer.id,
    },
    // eslint-disable-next-line prettier/prettier
    { apiVersion: "2020-08-27" }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: { enabled: true, allow_redirects: "never" },
  });

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      emphemeralKey: emphemeralKey.secret,
      customer: customer.id,
    })
  );
}
