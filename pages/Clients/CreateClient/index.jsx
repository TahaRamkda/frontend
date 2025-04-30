import { useState } from "react";
import { useDispatch } from "react-redux";
import { createClient } from "@/slices/clientSlice"; // Assuming this action exists
import showSweetAlert from "@/components/Sweetalert"; // Import your SweetAlert utility
import { useRouter } from "next/navigation";
import App from '@/components/Layout/App';

const ClientForm = () => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientAddress: "",
    contactPerson: "",
    contactPersonEmail: "",
    contactPersonPhone: "",
    balanceAlertLimit: 0,
    balance: 0,
    clientLanguage: 0,
    accessToken: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsSubmitting(true);

    const requestBody = {
      ...formData,
      actionBy: localStorage.getItem("userId"),
      clientId: localStorage.getItem("clientId"),
    };

    try {
      const response = await dispatch(createClient(requestBody)).unwrap();
      if (response.success) {
        showSweetAlert({
          title: "Created Successfully",
          text: response.message || "",
          icon: "success",
        });
        router.push("/Clients/ClientsList");
      } else {
        throw new Error(response.message || "Failed");
      }
    } catch (err) {
      console.error("Failed to create client:", err);
      showSweetAlert({
        title: "Failed",
        text: err.message || "",
        icon: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <App>
      <div className="bg-white p-6 rounded-md shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700">Client Name</label>
            <input
              required
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700">Client Address</label>
            <input
              required
              type="text"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700">Contact Person</label>
            <input
              required
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              required
              type="email"
              name="contactPersonEmail"
              value={formData.contactPersonEmail}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              required
              type="text"
              name="contactPersonPhone"
              value={formData.contactPersonPhone}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-gray-700">Balance</label>
            <input
              required
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>


          <div>
            <label className="block text-gray-700">Balance Alert Limit</label>
            <input
              required
              type="number"
              name="balanceAlertLimit"
              value={formData.balanceAlertLimit}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700">Access Token</label>
            <input
              required
              type="text"
              name="accessToken"
              value={formData.accessToken}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => router.push("/Clients/ClientsList")}
              disabled={isSubmitting}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </App>
  );
};

export default ClientForm;
