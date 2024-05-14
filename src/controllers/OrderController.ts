import { Request, Response, response } from 'express';
import Stripe from 'stripe';
import Restaurant, { MenuItemType } from '../models/restaurant';
import Order from '../models/order';

const stripe = new Stripe(process.env.STRIPE_API_SECRET_KEY as string);
const frontendUrl = process.env.FRONTEND_URL as string;
const stripeEndpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

type CheckoutSessionRequest = {
  cartItems: {
    menuItemId: string;
    name: string;
    quantity: string;
  }[];

  deliveryDetails: {
    email: string;
    name: string;
    address: {
      street: string;
      city: string;
    };
  };

  restaurantId: string;
};

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  try {
    const sig = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      stripeEndpointSecret
    );
  } catch (error: any) {
    console.log(error);
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.totalAmount = event.data.object.amount_total;
    order.status = 'paid';

    await order.save();
  }

  res.status(200).send();
};

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;

    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: 'placed',
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      cartItems: checkoutSessionRequest.cartItems,
      createdAt: new Date(),
    });

    const lineItems = createLineItems(
      checkoutSessionRequest,
      restaurant.menuItems
    );

    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      return res.status(500).json({ message: 'error creating stripe session' });
    }

    await newOrder.save();

    res.json({ url: session.url });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ message: error.raw.message });
  }
};

const createLineItems = (
  checkoutSessionRequest: CheckoutSessionRequest,
  menuItems: MenuItemType[]
) => {
  const lineItems = checkoutSessionRequest.cartItems.map((cartItem) => {
    const menuItem = menuItems.find(
      (item) => item._id.toString() === cartItem.menuItemId.toString()
    );

    if (!menuItem) {
      throw new Error(`Menu item not found: ${cartItem.menuItemId}`);
    }

    const line_item: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: 'eur',
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    return line_item;
  });

  return lineItems;
};

const createSession = async (
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) => {
  const sessionData = await stripe.checkout.sessions.create({
    line_items: lineItems,
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: 'Delivery',
          type: 'fixed_amount',
          fixed_amount: {
            amount: deliveryPrice,
            currency: 'eur',
          },
        },
      },
    ],
    mode: 'payment',
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${frontendUrl}/order-status?success=true`,
    cancel_url: `${frontendUrl}/detail/${restaurantId}?cancelled=true`,
  });

  return sessionData;
};

export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.userId })
      .populate('restaurant')
      .populate('user');

    if (!orders) {
      return res.status(404).json({ message: 'Orders not found' });
    }

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'something went wrong' });
  }
};
