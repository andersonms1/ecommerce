import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
  SIZE,
  ROLE,
} from "baseui/modal";
import { KIND as ButtonKind } from "baseui/button";
import StripeCheckout from "react-stripe-checkout"; // Remove from package.json

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

import "./CardSectionStyles.css";
import { useStyletron } from "baseui";

import { LabelLarge } from "baseui/typography";

import { SIZE as CARD_SIZE, ADJOINED } from "baseui/input";
import { PaymentCard, valid } from "baseui/payment-card";
import { MaskedInput } from "baseui/input";
import { FormControl } from "baseui/form-control";

function Pay() {
  const [isOpen, setIsOpen] = useState(false); //modal
  const [error, setError] = useState(null);
  const [css, theme] = useStyletron();

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "14px",
        "::placeholder": {
          color: "#aab7c4",
        },
        // backgroundColor: "green",
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a",
      },
    },
  };

  const INPUTS = {
    // https://stripe.com/docs/js/appendix/style?type=card
    style: {
      base: {
        color: theme.colors.contentPrimary,
        backgroundColor: theme.colors.contentInverseSecondary,
        fontFamily: theme.typography.LabelMedium.fontFamily,
        fontSmoothing: "antialiase",
        fontSize: theme.typography.LabelMedium.fontSize,
      },
    },
  };

  console.log(theme.typography);

  const stripePromise = loadStripe(
    "pk_test_51HHhHvHw6iNN0REoJkcsW0E1UvgN12nyu7QW7ydg62kC74QtmNsycKIaGF1kqhSjlbjEnh337UJjzygI16Qrbdny00PIsjy4Td"
  );

  const [number, setNumber] = React.useState("");
  const [expiration, setExpiration] = React.useState();
  const [code, setCode] = React.useState();
  const { card } = valid.number(number);
  let codeLength;
  if (card && card.code && card.code.size) {
    codeLength = card.code.size;
  }

  function getFormOverrides(width) {
    return {
      ControlContainer: {
        style: {
          width,
          marginRight: "5px",
        },
      },
    };
  }

  const Form = () => {
    const stripe = useStripe();
    const elements = useElements();

    // Handle real-time validation errors from the card Element.
    const handleChange = (event) => {
      if (event.error) {
        setError(event.error.message);
      } else {
        setError(null);
      }
    };

    // Handle form submission.
    const handleSubmit = async (event) => {
      event.preventDefault();
      const card = elements.getElement(CardElement);
      const result = await stripe.createToken(card);
      if (result.error) {
        // Inform the user if there was an error.
        setError(result.error.message);
      } else {
        setError(null);
        // Send the token to your server.
        const token = result.token;
        alert("ok");
        console.log(token);
      }
    };

    const inputStyle = css({
      backgroundColor: theme.colors.contentInverseSecondary,
      height: theme.sizing.scale650,
      borderTopWidth: "1px",
      borderBottomWidth: "1px",
      borderTopColor: theme.colors.contentPrimary,
      borderBottomColor: theme.colors.contentPrimary,
      borderRightColor: theme.colors.contentPrimary,
      borderLeftColor: theme.colors.contentPrimary,
      borderTopRightRadius: theme.borders.radius100,
      borderTopLeftRadius: theme.borders.radius100,
      borderBottomLeftRadius: theme.borders.radius100,
      borderBottomRightRadius: theme.borders.radius100,
      width: "100vmax",
    });

    return (
      <div>
        {/* <LabelLarge>Cartão de crédito ou débito</LabelLarge> */}
        <div className="">
          <CardNumberElement
            options={INPUTS}
            className={css({
              backgroundColor: theme.colors.contentInverseSecondary,
              height: theme.sizing.scale650,
              borderTopWidth: "1px",
              borderBottomWidth: "1px",
              borderTopColor: theme.colors.contentPrimary,
              borderBottomColor: theme.colors.contentPrimary,
              borderRightColor: theme.colors.contentPrimary,
              borderLeftColor: theme.colors.contentPrimary,
              borderTopRightRadius: theme.borders.radius100,
              borderTopLeftRadius: theme.borders.radius100,
              borderBottomLeftRadius: theme.borders.radius100,
              borderBottomRightRadius: theme.borders.radius100,
            })}
          />
          <CardExpiryElement className={inputStyle} />
          <CardCvcElement />
        </div>

        {/* <div className={css({ display: "flex" })}>
          <FormControl
            overrides={getFormOverrides("250px")}
            caption="Card number"
          >
            <PaymentCard
              value={number}
              onChange={(event) => setNumber(event.currentTarget.value)}
              placeholder="Card number"
            />
          </FormControl>
          <FormControl
            overrides={getFormOverrides("90px")}
            caption="Expiration date"
          >
            <MaskedInput
              error={Boolean(
                expiration &&
                  expiration.length &&
                  !valid.expirationDate(expiration).isPotentiallyValid
              )}
              value={expiration}
              onChange={(event) => setExpiration(event.currentTarget.value)}
              placeholder="MM/YY"
              mask="99/99"
            />
          </FormControl>
          <FormControl overrides={getFormOverrides("70px")} caption="CVC">
            <MaskedInput
              error={Boolean(
                code &&
                  code.trim().length &&
                  !valid.cvv(code, codeLength).isPotentiallyValid
              )}
              value={code}
              onChange={(event) => setCode(event.currentTarget.value)}
              placeholder="CVC"
              mask={codeLength ? "9".repeat(codeLength) : "999"}
            />
          </FormControl>
        </div> */}
      </div>
    );
  };

  return (
    <div>
      <Modal
        onClose={() => setIsOpen(false)}
        closeable
        isOpen={isOpen}
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>Hello world</ModalHeader>
        <ModalBody>
          Proin ut dui sed metus pharetra hend rerit vel non mi. Nulla ornare
          faucibus ex, non facilisis nisl. Maecenas aliquet mauris ut tempus.
        </ModalBody>
        <ModalFooter>
          <ModalButton kind={ButtonKind.tertiary}>Cancel</ModalButton>
          <ModalButton>Okay</ModalButton>
        </ModalFooter>
      </Modal>
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <Form />
        </Elements>
      )}
      {/* <Form /> */}
    </div>
  );
}

export default Pay;
