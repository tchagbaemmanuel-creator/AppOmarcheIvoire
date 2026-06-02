import { Order } from "@prisma/client";
import { selectOrderDetailsById } from "@/repositories/order.repository";
import OrderCreatedTemplate, {
  OrderCreatedTemplateProps,
} from "@/utils/mail/templates/OrderCreatedTemplate";
import React from "react";
import { EMAIL_LIST, sendMail } from "@/utils/mail";

export async function handleOrderCreated(order: Order) {
  try {
    const orderDetails = await collectOrderDetailsForEmail(order);
    if (!orderDetails) {
      return;
    }
    const component = React.createElement(
      OrderCreatedTemplate,
      orderDetails.data
    );
    await sendMail(component, orderDetails.recipients, orderDetails.subject);
  } catch (error) {
    console.error("An error occurred while handling order created", error);
    throw error;
  }
}

interface OrderCreatedData {
  data: OrderCreatedTemplateProps;
  recipients: string[];
  subject: string;
}

async function collectOrderDetailsForEmail(
  order: Order
): Promise<OrderCreatedData | null> {
  try {
    const orderDetails = await selectOrderDetailsById(order.orderId);

    if (!orderDetails) {
      throw new Error("Order not found");
    }

    const orderNumber = orderDetails.orderId;
    const customerName =
      orderDetails.users.lastName + " " + orderDetails.users.firstName;
    const deliveryAddress = orderDetails.address;
    const products = orderDetails.orderProducts.map((orderProduct) => ({
      name: orderProduct.products.name,
      quantity: orderProduct.quantity,
      price: Number(orderProduct.products.price),
      unit: orderProduct.products.unit,
    }));
    const totalAmount = orderDetails.orderProducts.reduce(
      (total, orderProduct) =>
        total + Number(orderProduct.products.price) * orderProduct.quantity,
      0
    );
    const paymentMethod = orderDetails.paymentMethod;
    const expectedDeliveryDate = orderDetails.deliveryTime;

    const areaCode =
      orderDetails.orderProducts[0].products.seller.market.areaCode;

    return {
      data: {
        orderNumber,
        customerName,
        deliveryAddress,
        products,
        totalAmount,
        paymentMethod,
        expectedDeliveryDate,
        areaCode,
      },
      recipients: EMAIL_LIST,
      subject: "O'Marché Ivoire - Nouvelle commande",
    };
  } catch (error) {
    console.error(
      "An error occurred while collecting order details for email",
      error
    );
    throw error;
  }
}
