/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

const priceSchema = z.object({
  items: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      price: z
        .number({
          invalid_type_error: "Price must be a number",
        })
        .min(0.01, "Minimum price is $0.01"),
      quantity: z
        .number({
          invalid_type_error: "Qty must be a number",
        })
        .min(1, "Minimum qty is 1"),
    })
  ),
});

const PurchaseDetailsSection = () => {
  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      items: [
        { id: 1, name: "Premium Headphones", price: 12000.0, quantity: 2 },
        { id: 2, name: "Wireless Mouse", price: 5000.0, quantity: 6 },
        { id: 3, name: "Smart Watch", price: 9000.0, quantity: 15 },
        { id: 4, name: "Power Bank", price: 9000.0, quantity: 15 },
      ],
    },
  });

  const shippingCost = 15.0;
  const items = watch("items");

  const handleDeleteItem = (itemId: number) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setValue("items", updatedItems);
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + shippingCost;

  const onSubmit = (data: any) => {
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
  };

  return (
    <div className="w-full lg:w-[260px] xl:w-[280px] flex-none h-svh overflow-y-auto bg-white text-black p-4 shadow-sm md:border-l border-gray-200 sticky top-0">
      {/* Header with Close Icon */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg text-gray-900">Your Cart</h2>
        <button className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div key={item.id} className="border-b pb-4 group relative">
            <div className="flex justify-start gap-3 items-center pb-4">
              <h3 className="font-medium text-gray-900">{item.name}</h3>
              {/* Delete Item Icon */}
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-2 mt-2 h-16">
              {/* Price Input */}
              <div className="flex flex-col w-[8rem] lg:w-[5rem] text-gray-900 ">
                <label
                  htmlFor={`items.${index}.price`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Unit Price
                </label>
                <Controller
                  name={`items.${index}.price`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      step="0.01"
                      className="w-full px-2 py-1 border rounded text-sm"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value))
                      }
                    />
                  )}
                />
                <div className="h-10">
                  {errors.items?.[index]?.price && (
                    <p className="text-red-500 text-xs mt-1 h-10">
                      {errors.items[index]?.price?.message}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-gray-500 pb-6">X</span>

              {/* Quantity Input */}
              <div className="flex flex-col w-[6.5rem] lg:w-[4.25rem] text-gray-900">
                <label
                  htmlFor={`items.${index}.quantity`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Qty
                </label>
                <Controller
                  name={`items.${index}.quantity`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="1"
                      step="1"
                      className="w-full px-2 py-1 border focus:border-gray-900 focus:ring-gray-900 rounded text-sm"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  )}
                />
                <div className="h-10">
                  {errors.items?.[index]?.quantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.items[index]?.quantity?.message}
                    </p>
                  )}
                </div>
              </div>

              <span className="text-gray-500 pb-6">=</span>

              {/* Total Price */}
              <span className="font-medium text-gray-900 pb-6 w-16 lg:w-10">
                {(item.price * item.quantity).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="space-y-3 mb-6 text-gray-900 bg-gray-100 p-6 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>{shippingCost.toFixed(2)}</span>
        </div>
        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span>{total.toFixed(2)} LKR</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleSubmit(onSubmit)}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Submit
      </button>
    </div>
  );
};

export default PurchaseDetailsSection;
