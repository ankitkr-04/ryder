import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";
import { PaymentSheetError, useStripe } from "@stripe/stripe-react-native";
import React, { useState } from "react";
import { Alert } from "react-native";
import CustomButton from "./CustomButton";

const Payment = ({
  fullName,
  amount,
  driverId,
  rideTime,
  email,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [success, setSuccess] = useState(false);

  const confirmHandler = async (paymentMethod, _, intentCreationCallback) => {
    const { paymentIntent, customer } = await fetchAPI(
      "/(api)/(stripe)/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName || email.split("@")[0],
          email,
          amount,
          paymentMethod: paymentMethod.id,
        }),
      }
    );

    if (paymentIntent.client_secret) {
      const { result } = await fetchAPI("/(api)/(stripe)/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payment_method_id: paymentMethod.id,
          payment_intent_id: paymentIntent.id,
          customer_id: customer.id,
        }),
      });

      if (result.client_secret) {
      }
    }

    const { client_secret, error } = await response.json();
    if (client_secret) {
      intentCreationCallback({ clientSecret: client_secret });
    } else {
      intentCreationCallback({ error });
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "Example, Inc.",
      intentConfiguration: {
        mode: {
          amount: 1099,
          currencyCode: "USD",
        },
        confirmHandler: confirmHandler,
      },
    });
    if (error) {
      // handle error
    }
  };

  const didTapCheckoutButton = async () => {
    // implement later
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error!.code === PaymentSheetError.Canceled) {
      Alert.alert(
        `Error Code: ${error!.code}`,
        error!.message ?? "User canceled the payment sheet"
      );
    } else {
      setSuccess(true);
    }
  };
  return (
    <>
      <CustomButton
        title="Confirm Booking"
        className="my-10"
        onPress={openPaymentSheet}
      />
    </>
  );
};

export default Payment;
