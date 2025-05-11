import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";

export type Supplier = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
};

interface SupplierSelectProps {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  onSelect: (supplier: Supplier | null) => void;
  error?: string;
  onCreateNew?: () => void;
  onSearch?: (searchTerm: string) => void;
  isLoading?: boolean;
}

export function SupplierSelect({
  suppliers,
  selectedSupplier,
  onSelect,
  error,
  onCreateNew,
  onSearch,
  isLoading = false,
}: SupplierSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuppliers = suppliers.filter((supplier) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">Supplier</label>
      <div className="flex gap-2">
        <div className="relative w-full" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              error ? "border-red-500" : "border-gray-300"
            } ${!selectedSupplier ? "text-gray-600" : "text-gray-900"}`}
          >
            <span className="truncate font-medium">
              {selectedSupplier ? selectedSupplier.name : "Select supplier..."}
            </span>
            <ChevronsUpDown className="h-4 w-4 text-gray-600" />
          </button>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-2 border-b">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Search supplier..."
                    className="w-full px-3 py-1.5 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {/* Clear Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>

              <div className="max-h-60 overflow-auto">
                {isLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    Loading suppliers...
                  </div>
                ) : filteredSuppliers.length === 0 ? (
                  <div className="px-3 py-2 text-sm text-gray-500">
                    No supplier found.
                  </div>
                ) : (
                  <ul className="py-1">
                    {filteredSuppliers.map((supplier) => (
                      <li
                        key={supplier.id}
                        className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer flex items-center text-gray-900"
                        onClick={() => {
                          onSelect(supplier);
                          setIsOpen(false);
                          setSearchQuery("");
                        }}
                      >
                        {selectedSupplier?.id === supplier.id && (
                          <Check className="h-4 w-4 mr-2 text-blue-500" />
                        )}
                        <span
                          className={
                            selectedSupplier?.id === supplier.id
                              ? "text-blue-500 font-medium"
                              : ""
                          }
                        >
                          {supplier.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        {onCreateNew && (
          <button
            type="button"
            onClick={onCreateNew}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Create new supplier"
          >
            <Plus className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {selectedSupplier && (
        <div className="mt-2 p-3 bg-gray-50 rounded-md text-sm">
          {selectedSupplier.phone && (
            <p className="text-gray-600">Phone: {selectedSupplier.phone}</p>
          )}
          {selectedSupplier.address && (
            <p className="text-gray-600">Address: {selectedSupplier.address}</p>
          )}
        </div>
      )}
    </div>
  );
}
