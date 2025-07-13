import React, { useState } from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { fetchMenuById, clearMenuDetailState } from "@/slices/MenuSlice";
const MenuSelection = ({isVisible, onClose}) => {
  const [quantity, setQuantity] = useState(1);
  const combos = [
    { name: "Go Mega", price: 0.0 },
    { name: "Go King", price: 0.2 },
  ];

  const sides = [
    { name: "Spicy Fries", price: 0.1 },
    { name: "Curly Fries", price: 0.15 },
    { name: "Onion Rings", price: 0.15 },
    { name: "Fries Ketchup Mayonnaise", price: 0.25 },
  ];

  const drinks = [
    { name: "Chocolate Milkshake", price: 0.25 },
    { name: "Strawberry Milkshake", price: 0.25 },
    { name: "Vanilla Milkshake", price: 0.25 },
    { name: "Coca Cola", price: 0.0 },
    { name: "Fanta", price: 0.0 },
    { name: "Sprite", price: 0.0 },
    { name: "Coke Zero", price: 0.0 },
    { name: "Mineral Water 500 ML", price: 0.0 },
    { name: "Classic Mojito", price: 0.25 },
    { name: "Blue Lagoon Mojito", price: 0.25 },
    { name: "King On The Beach Mojito", price: 0.25 },
  ];

  const cheeses = [
    { name: "Add Cheese", price: 0.15 },
    { name: "Double Cheese", price: 0.2 },
  ];

  const sauces = [
    { name: "MayoChup", price: 0.25 },
    { name: "Garlic Mayo", price: 0.1 },
    { name: "BBQ Sauce", price: 0.1 },
  ];

  return (
    <Modal isOpen={true} toggle={onClose} fade={false}>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded shadow-lg w-2/5 relative max-h-[80vh] flex flex-col overflow-hidden">
          <div className="sticky bg-white ">
        <ModalHeader toggle={onClose}>Modifiers</ModalHeader>
      </div>

          <ModalBody className="overflow-auto">
            <div className="">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Chicken Royale Meal</h3>
                  <p className="text-sm text-gray-600">
                    A unique long bun with chicken Royale patty topped with
                    Mayonnaise and lettuce in bun with French fries and a drink
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-2 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                COMBO (Choose 1)
              </h4>
              {combos.map((combo, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input type="radio" name="combo" className="mr-2" />
                  <label>
                    {combo.name}{" "}
                    {combo.price > 0 && `(${combo.price.toFixed(3)})`}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                YOUR CHOICE OF (Choose 1)
              </h4>
              {sides.map((side, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input type="radio" name="side" className="mr-2" />
                  <label>
                    {side.name} {side.price > 0 && `(${side.price.toFixed(3)})`}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                YOUR CHOICE OF DRINK (Choose 1)
              </h4>
              {drinks.map((drink, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input type="radio" name="drink" className="mr-2" />
                  <label>
                    {drink.name}{" "}
                    {drink.price > 0 && `(${drink.price.toFixed(3)})`}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                ADD CHEESE (Choose items from the list)
              </h4>
              {cheeses.map((cheese, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input type="checkbox" className="mr-2" />
                  <label>
                    {cheese.name}{" "}
                    {cheese.price > 0 && `(${cheese.price.toFixed(3)})`}
                  </label>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-semibold text-gray-700">
                ADD ON (Choose items from the list)
              </h4>
              {sauces.map((sauce, index) => (
                <div key={index} className="flex items-center mt-2">
                  <input type="checkbox" className="mr-2" />
                  <label>
                    {sauce.name}{" "}
                    {sauce.price > 0 && `(${sauce.price.toFixed(3)})`}
                  </label>
                </div>
              ))}
            </div>
          </ModalBody>
        </div>
      </div>
    </Modal>
  );
};

export default MenuSelection;
