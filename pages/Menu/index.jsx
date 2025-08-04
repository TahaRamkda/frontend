import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Modal, ModalHeader, ModalBody } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { HiChevronLeft, HiEye, HiPlus } from "react-icons/hi";
import {
  fetchMenu,
  clearMenuState,
  fetchMenuById,
  setPageSize,
  setCurrentPage,
} from "@/slices/MenuSlice";
import ClientDropdown from "@/components/Dropdowns/ClientDropdown";
import SendernameDropdown from "@/components/Dropdowns/SendernameDropdown";
import { HiSearch } from "react-icons/hi";
import showSweetAlert from "@/components/Sweetalert";
import Loading from "@/components/Layout/Loader";
import {
  HiPencilAlt,
  HiTrash,
  HiChevronRight,
  HiChevronDoubleLeft,
} from "react-icons/hi";
import App from "@/components/Layout/App";
import SearchBar from "@/components/SearchBar/SearchComponent";

import { usePermissions } from "@/context/PermissionsContext";
import { BASE_URL } from "@/utils/apiConstants";
import { toast } from "react-toastify";

const MenuList = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [buttonClicked, setButtonClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [senderId, setSenderId] = useState(0);
  const [menuData, setMenuData] = useState({
    categories: [],
    items: [],
    modifiers: [],
  });
  const mainItems = menuData?.menu?.items.filter(
    (item) => item.type === "ITEM"
  );
  const modifiers = menuData?.menu?.items.filter(
    (item) => item.type === "CHOICE"
  );
  const { menuList, loading, error, pageSize, totalRecords, currentPage } =
    useSelector((state) => state.menu);
  const [searchTimeout, setSearchTimeout] = useState(null); // State for managing debounce timeout
  const [filterText, setFilterText] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (item) => {
    setSelectedItem(item);
  };
  const truncateWords = (text, wordLimit) => {
    if (!text) return "";
    const words = text.split(" ");
    return words.length > wordLimit
      ? words.slice(0, wordLimit).join(" ") + "..."
      : text;
  };

  // Close popup
  const closePopup = () => {
    setSelectedItem(null);
  };

  const getModifiersForItem = (itemId) => {
    const item = mainItems.find((i) => i.id === itemId);
    if (!item || !item.modifier_ids) return [];

    const itemModifiers = menuData?.menu?.modifiers.filter((mod) =>
      item.modifier_ids.includes(mod.id)
    );

    return itemModifiers.map((mod) => ({
      ...mod,
      modifier_items: mod.modifier_items.map((modItem) => {
        const modifierItem = modifiers.find((m) => m.id === modItem.item_id);

        return {
          ...modifierItem,
          is_default: modItem.is_default,
          // Check for nested modifiers
          nestedModifiers: Array.isArray(modifierItem?.modifier_ids)
            ? menuData?.menu?.modifiers
                .filter((nestedMod) =>
                  modifierItem.modifier_ids.includes(nestedMod.id)
                )
                .map((nestedMod) => ({
                  ...nestedMod,
                  modifier_items: Array.isArray(nestedMod.modifier_items)
                    ? nestedMod.modifier_items
                        .map((nestedModItem) =>
                          modifiers.find((m) => m.id === nestedModItem.item_id)
                        )
                        .filter(Boolean)
                    : [],
                }))
            : [],
        };
      }),
    }));
  };
  const handleSenderChange = (e) => {
    setSenderId(e.target.value);
  };
  useEffect(() => {
    if (senderId) {
      setSenderId(senderId);
    }
  }, [senderId]);
  const handleButtonCLick = () => {
    debugger;
    if (senderId == 0 || !senderId || senderId === null) {
      return toast.error("Please select a sender");
    }

    try {
      dispatch(
        fetchMenu({
          ClientId: localStorage.getItem("clientId"),
          SenderId: senderId,
        })
      ).unwrap();
    } catch (error) {
      console.error("Error fetching menu:", error);
      showSweetAlert({
        type: "error",
        title: "Error",
        text: error || "Error fetching menu",
      });
    }
  };

  useEffect(() => {
    if (senderId) {
    }
    return () => {
      dispatch(clearMenuState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (menuList) {
      setMenuData(menuList);
    }
  }, [menuList]);

  return (
    <App>
      {loading && <Loading />}
      <div className="max-w-4xl mx-auto mb-6">
        <SearchBar
          label="Search Items"
          value={filterText}
          onChange={(val) => setFilterText(val)}
        />
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2 flex flex-col mb-4">
            <label className="font-medium text-gray-700 text-sm mb-1">
              Sender Names
            </label>

            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <SendernameDropdown
                  name="senderId"
                  value={senderId}
                  onChange={handleSenderChange}
                />
              </div>

              <button className="uniform_icon_btn" onClick={handleButtonCLick}>
                <HiSearch style={{ fontSize: "15px" }} />
              </button>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>

      {menuData?.menu?.categories.map((category) => (
        <div key={category.id} className="mb-8">
          <div className="max-w-4xl mx-auto   rounded-xl overflow-hidden">
            <h2 className="text-2xl font-semibold mb-4">{category.name.en}</h2>
          </div>

          <div className="max-w-4xl mx-auto mt-6 border rounded-xl shadow-sm overflow-hidden">
            {category.item_ids.map((itemId) => {
              const item = mainItems.find((i) => {
                const matchesFilter = i.name?.en
                  ?.toLowerCase()
                  ?.includes(filterText.toLowerCase());
                return i.id === itemId && matchesFilter;
              });
              if (!item) return null;
              return (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-4 p-3 border-b hover:bg-gray-50 transition"
                >
                  {/* Image & Info Block */}
                  <div className="flex gap-4">
                    <img
                      src={item.image?.url || "/placeholder.png"}
                      alt={item.name.en}
                      className="w-24 h-24 object-contain rounded-md border bg-white"
                    />
                    <div className="flex flex-col justify-between">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {item.name.en}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {truncateWords(item.description.en, 20)}{" "}
                        {/* limit to 20 words */}
                        <>
                          <br />
                          <span dir="rtl">
                            {truncateWords(item.description.ar, 20)}
                          </span>
                        </>
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex flex-col items-end justify-between min-w-fit">
                    <span className="text-sm font-semibold text-gray-800">
                      KWD {item.price_info.price.toFixed(3)}
                    </span>
                    {(getModifiersForItem(item.id) || []).length > 0 && (
                      <button
                        onClick={() => handleAddToCart(item)}
                        aria-label={`Add ${item.name.en} to cart`}
                        className="w-8 h-8 mt-2 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition uniform_icon_btn"
                      >
                        <HiEye size={16} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
      {selectedItem && (
        <Modal isOpen={!!selectedItem} toggle={closePopup} fade={false}>
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg w-2/5 relative max-h-[80vh] flex flex-col overflow-hidden">
              <div className="sticky top-0 bg-white z-10">
                <ModalHeader toggle={closePopup}>
                  {selectedItem.name.en}
                </ModalHeader>
              </div>
              <ModalBody className="overflow-auto">
                <div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">
                        {selectedItem.description.en}
                        {selectedItem.description.ar && (
                          <>
                            <br />
                            <span dir="rtl">{selectedItem.description.ar}</span>
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <img
                        src={selectedItem.image?.url || "/placeholder.png"}
                        alt={selectedItem.name.en}
                        className="w-24 h-24 object-contain rounded-md border bg-white"
                      />

                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() =>
                            setQuantity(quantity > 1 ? quantity - 1 : 1)
                          }
                          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                          disabled={true}
                        >
                          -
                        </button>

                        <span className="w-6 text-center">{quantity}</span>

                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                          disabled={true}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {getModifiersForItem(selectedItem.id).map((modifier, index) => (
                  <div key={modifier.id} className="mt-4">
                    <h6 className="bg-gray-300 p-2 fw-bold">
                      {modifier.name.en} (Choose {modifier.min_selection} to{" "}
                      {modifier.max_selection})
                    </h6>

                    {modifier.modifier_items.map((modItem, modIndex) => (
                      <div key={modItem.id} className="mt-2">
                        <div className="flex items-center">
                          <input
                            type={
                              modifier.max_selection === 1
                                ? "radio"
                                : "checkbox"
                            }
                            name={modifier.id}
                            checked={modItem.is_default}
                            className="mr-2"
                            disabled={true}
                          />
                          <label>
                            {modItem.name.en}{" "}
                            {modItem.price_info.price > 0 &&
                              `(+${modItem.price_info.price.toFixed(3)} KWD)`}
                            {modItem.is_default && " (Default)"}
                          </label>
                        </div>
                        {modItem.nestedModifiers?.length > 0 && (
                          <div className="ml-6 mt-2">
                            {modItem.nestedModifiers.map(
                              (nestedMod, nestedIndex) => (
                                <div key={nestedMod.id} className="mt-2">
                                  <h5 className="text-sm font-semibold text-gray-700">
                                    {nestedMod.name.en} (Choose{" "}
                                    {nestedMod.min_selection} to{" "}
                                    {nestedMod.max_selection})
                                  </h5>
                                  {nestedMod.modifier_items.map(
                                    (nestedModItem, nestedModIndex) => (
                                      <div
                                        key={nestedModItem.id}
                                        className="flex items-center mt-2"
                                      >
                                        <input
                                          type={
                                            nestedMod.max_selection === 1
                                              ? "radio"
                                              : "checkbox"
                                          }
                                          name={nestedMod.id}
                                          defaultChecked={
                                            nestedModItem.is_default
                                          } // Use defaultChecked for static UI
                                          className="mr-2"
                                          disabled={true}
                                        />

                                        <label>
                                          {nestedModItem.name.en}{" "}
                                          {nestedModItem.price_info.price > 0 &&
                                            `(+${nestedModItem.price_info.price.toFixed(
                                              3
                                            )} KWD)`}
                                          {nestedModItem.is_default &&
                                            " (Default)"}
                                        </label>
                                      </div>
                                    )
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </ModalBody>
            </div>
          </div>
        </Modal>
      )}
    </App>
  );
};

export default MenuList;
