/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Pencil, Check } from "lucide-react";
import { useAppDispatch } from "@/app/redux";
import { showToast } from "@/state/thunks/alertThunk";

type Product = {
  productId: string;
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  details?: string;
  imageUrl: string;
};

const priceSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z
        .number({
          invalid_type_error: "Price must be a number",
        })
        .int("Price must be a whole number")
        .min(1, "Minimum price is 1"),
      quantity: z
        .number({
          invalid_type_error: "Qty must be a number",
        })
        .min(1, "Minimum qty is 1"),
    })
  ),
});

interface PurchaseDetailsSectionProps {
  selectedProducts: Product[];
  onClose?: (productId?: string) => void;
}

const PurchaseDetailsSection = ({ selectedProducts, onClose }: PurchaseDetailsSectionProps) => {
  const dispatch = useAppDispatch();
  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [shippingCost, setShippingCost] = useState(500.00);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(priceSchema),
    defaultValues: {
      items: selectedProducts.map(product => ({
        id: product.productId,
        name: product.name,
        price: product.price,
        quantity: 1
      }))
    },
  });

  // Update form values when selectedProducts change
  useEffect(() => {
    const currentItems = watch("items");
    const currentItemIds = new Set(currentItems.map(item => item.id));
    
    // Add new items
    selectedProducts.forEach(product => {
      if (!currentItemIds.has(product.productId)) {
        setValue("items", [
          ...currentItems,
          {
            id: product.productId,
            name: product.name,
            price: product.price,
            quantity: 1
          }
        ]);
      }
    });

    // Remove items that are no longer selected
    const selectedProductIds = new Set(selectedProducts.map(p => p.productId));
    const updatedItems = currentItems.filter(item => 
      selectedProductIds.has(item.id)
    );
    
    if (updatedItems.length !== currentItems.length) {
      setValue("items", updatedItems);
    }
  }, [selectedProducts, setValue, watch]);

  const items = watch("items");

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = items.filter((item) => item.id !== itemId);
    setValue("items", updatedItems);
    onClose?.(itemId); // Notify parent to update selection
  };

  const handleCloseAll = () => {
    setValue("items", []);
    onClose?.(); // Notify parent to clear all selections
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal + shippingCost;

  const handleShippingCostChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setShippingCost(Number(numValue.toFixed(2)));
    }
  };

  const onSubmit = (data: any) => {
    if (selectedProducts.length === 0) {
      dispatch(showToast("Please select at least one product", "error"));
      return;
    }
    console.log("Form submitted:", data);
    alert("Form submitted successfully!");
  };

  return (
    <div className="w-full lg:w-[260px] xl:w-[280px] flex-none h-svh overflow-y-auto overflow-x-hidden bg-white text-black p-4 shadow-sm sticky top-0">
      {/* Header with Close Icon */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg text-gray-900">Your Cart</h2>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={handleCloseAll}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4 mb-8">
        {items.map((item, index) => (
          <div key={item.id} className="border-b pb-4 group relative">
            <div className="flex items-start pb-4">
              <div className="flex items-start gap-2">
                <h3 className="font-medium text-gray-900 line-clamp-2">{item.name}</h3>
                {/* Delete Item Icon */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-gray-400 hover:text-red-600 flex-shrink-0 mt-1"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-2 h-16 min-w-0">
              {/* Price Input */}
              <div className="flex flex-col w-20 lg:w-[5.85rem] text-gray-900 flex-shrink-0">
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
                      step="1"
                      min="1"
                      className="w-full px-3 py-1.5 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1) {
                          field.onChange(value);
                        }
                      }}
                      onBlur={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1) {
                          field.onChange(value);
                        }
                      }}
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

              <span className="text-gray-500 pb-6">x</span>

              {/* Quantity Input */}
              <div className="flex flex-col w-16 lg:w-[4.75rem] text-gray-900 flex-shrink-0">
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
                      className="w-full px-3 py-1.5 border focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 rounded text-sm"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value >= 1) {
                          field.onChange(value);
                        }
                      }}
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
              <div className="font-medium text-gray-900 pb-6 flex items-center ml-2 min-w-[48px] max-w-[70px] flex-shrink-0">
                <span className="break-all whitespace-pre-wrap">
                  {(item.price * item.quantity).toLocaleString('en-US', {
                    minimumFractionDigits: Number.isInteger(item.price) ? 0 : 2,
                    maximumFractionDigits: Number.isInteger(item.price) ? 0 : 2
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Summary */}
      <div className="space-y-3 mb-6 text-gray-900 bg-gray-100 p-6 rounded-lg">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <div className="w-[90px]">
            <span className="block text-right break-all whitespace-pre-wrap">
              {subtotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </span>
          </div>
        </div>
        <div className="flex justify-between text-sm items-center">
          <span>Shipping</span>
          <div className="flex items-center gap-2">
            {isEditingShipping ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={shippingCost}
                  onChange={(e) => handleShippingCostChange(e.target.value)}
                  className="w-24 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900"
                  autoFocus
                />
                <button
                  onClick={() => setIsEditingShipping(false)}
                  className="text-emerald-600 hover:text-emerald-700 p-1"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditingShipping(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Pencil className="h-3 w-3" />
                </button>
                <span>{shippingCost.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}</span>
              </div>
            )}
          </div>
        </div>
        <div className="border-t pt-3 flex justify-between font-semibold">
          <span>Total</span>
          <span className="text-right break-words max-w-[120px] whitespace-pre-wrap">
            {total.toLocaleString('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })} LKR
          </span>
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
