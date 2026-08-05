"use client";

import { useState, type ChangeEvent, type FormEvent, type InputHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { PlacedOrder } from "@/lib/types";

interface CheckoutForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
}

const initialForm: CheckoutForm = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
};

type FormErrors = Partial<Record<keyof CheckoutForm, string>>;

function validate(form: CheckoutForm): FormErrors {
  const errors: FormErrors = {};
  if (!form.email.includes("@")) errors.email = "Enter a valid email.";
  if (!form.firstName.trim()) errors.firstName = "Required.";
  if (!form.lastName.trim()) errors.lastName = "Required.";
  if (!form.address.trim()) errors.address = "Required.";
  if (!form.city.trim()) errors.city = "Required.";
  if (!form.state.trim()) errors.state = "Required.";
  if (!/^\d{4,10}$/.test(form.zip.trim())) errors.zip = "Enter a valid postal code.";
  if (!/^\d{13,19}$/.test(form.cardNumber.replace(/\s/g, "")))
    errors.cardNumber = "Enter a valid card number.";
  if (!/^\d{2}\s*\/\s*\d{2}$/.test(form.expiry)) errors.expiry = "Use MM / YY.";
  if (!/^\d{3,4}$/.test(form.cvc)) errors.cvc = "Enter a valid CVC.";
  return errors;
}

interface FieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "form"> {
  label: string;
  name: keyof CheckoutForm;
  formValues: CheckoutForm;
  errors: FormErrors;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

function Field({ label, name, formValues, errors, onChange, ...props }: FieldProps) {
  return (
    <div>
      <label htmlFor={name} className="text-sm text-ink/70">
        {label}
      </label>
      <input
        id={name}
        name={name}
        value={formValues[name]}
        onChange={onChange}
        className={`mt-1 w-full border bg-white px-3 py-2 text-sm focus:border-forest ${
          errors[name] ? "border-red-600" : "border-ink/20"
        }`}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...props}
      />
      {errors[name] && (
        <p id={`${name}-error`} className="mt-1 text-xs text-red-700">
          {errors[name]}
        </p>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, shipping, tax, total, clearCart, hydrated } = useCart();
  const [form, setForm] = useState<CheckoutForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmitting(true);

    const orderNumber = `AU-${Math.floor(100000 + Math.random() * 900000)}`;
    const order: PlacedOrder = {
      orderNumber,
      email: form.email,
      name: `${form.firstName} ${form.lastName}`,
      address: `${form.address}, ${form.city}, ${form.state} ${form.zip}`,
      items,
      subtotal,
      shipping,
      tax,
      total,
      placedAt: new Date().toISOString(),
    };

    try {
      window.sessionStorage.setItem("aura-last-order", JSON.stringify(order));
    } catch {
      // ignore storage failures — order still "succeeds" for this demo
    }

    clearCart();
    router.push(`/order-success?order=${orderNumber}`);
  }

  if (hydrated && items.length === 0) {
    return (
      <div className="container-wrap py-24 text-center">
        <h1 className="font-display text-3xl italic">Nothing to check out</h1>
        <p className="mt-3 text-ink/60">Your cart is empty right now.</p>
        <Link href="/products" className="btn-primary mt-8 inline-flex">
          Shop All
        </Link>
      </div>
    );
  }

  return (
    <div className="container-wrap py-10">
      <h1 className="font-display text-3xl italic">Checkout</h1>

      <form onSubmit={onSubmit} className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <fieldset>
            <legend className="font-display text-xl">Contact</legend>
            <div className="mt-4">
              <Field
                label="Email"
                name="email"
                type="email"
                formValues={form}
                errors={errors}
                onChange={onChange}
                autoComplete="email"
              />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl">Shipping address</legend>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="First name" name="firstName" formValues={form} errors={errors} onChange={onChange} autoComplete="given-name" />
              <Field label="Last name" name="lastName" formValues={form} errors={errors} onChange={onChange} autoComplete="family-name" />
              <div className="sm:col-span-2">
                <Field label="Address" name="address" formValues={form} errors={errors} onChange={onChange} autoComplete="street-address" />
              </div>
              <Field label="City" name="city" formValues={form} errors={errors} onChange={onChange} autoComplete="address-level2" />
              <Field label="State" name="state" formValues={form} errors={errors} onChange={onChange} autoComplete="address-level1" />
              <Field label="ZIP / Postal code" name="zip" formValues={form} errors={errors} onChange={onChange} autoComplete="postal-code" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-xl">Payment</legend>
            <p className="mt-1 text-xs text-ink/50">
              Demo checkout — no real payment is processed.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Card number"
                  name="cardNumber"
                  formValues={form}
                  errors={errors}
                  onChange={onChange}
                  inputMode="numeric"
                  placeholder="4242 4242 4242 4242"
                  autoComplete="cc-number"
                />
              </div>
              <Field
                label="Expiry (MM / YY)"
                name="expiry"
                formValues={form}
                errors={errors}
                onChange={onChange}
                placeholder="MM / YY"
                autoComplete="cc-exp"
              />
              <Field
                label="CVC"
                name="cvc"
                formValues={form}
                errors={errors}
                onChange={onChange}
                inputMode="numeric"
                autoComplete="cc-csc"
              />
            </div>
          </fieldset>
        </div>

        <aside className="h-fit border border-line p-6">
          <h2 className="font-display text-xl">Order Summary</h2>
          <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1 text-sm">
            {items.map((item) => (
              <li key={`${item.productId}::${item.variantKey}`} className="flex justify-between gap-2">
                <span className="text-ink/70">
                  {item.name}
                  {item.variantLabel ? ` (${item.variantLabel})` : ""} × {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-3 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink/60">Subtotal</dt>
              <dd>${subtotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Shipping</dt>
              <dd>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink/60">Estimated tax</dt>
              <dd>${tax.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-semibold">
              <dt>Total</dt>
              <dd>${total.toFixed(2)}</dd>
            </div>
          </dl>
          <button type="submit" disabled={submitting} className="btn-primary mt-6 w-full">
            {submitting ? "Placing order…" : "Place order"}
          </button>
        </aside>
      </form>
    </div>
  );
}
