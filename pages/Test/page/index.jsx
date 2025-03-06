"use client"; // Use this if you're in the app directory (Next.js 13+)

import { useState } from "react";

export default function OrderSatisfaction() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [formData, setFormData] = useState({
    speedOfService: "",
    comments: "",
    foodQuality: [],
    overallFeedback: "",
  });

  const screens = [
    // Screen 1: Speed of Service
    {
      title: "Speed Of Service",
      buttonText: "Next",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2">
              Rate our Speed Of Service? <span className="text-red-500">*</span>
            </label>
            {["Very Good", "Good", "Neutral", "Bad", "Very Bad"].map((option) => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  name="speedOfService"
                  value={option}
                  checked={formData.speedOfService === option}
                  onChange={(e) =>
                    setFormData({ ...formData, speedOfService: e.target.value })
                  }
                  className="mr-2"
                  required
                />
                <span>{option}</span>
              </div>
            ))}
          </div>
          <div>
            <label className="block text-lg font-medium mb-2">Comments</label>
            <input
              type="text"
              value={formData.comments}
              onChange={(e) =>
                setFormData({ ...formData, comments: e.target.value })
              }
              placeholder="Enter your comments here..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      ),
    },
    // Screen 2: Hot & Fresh
    {
      title: "Hot & Fresh",
      buttonText: "Next",
      content: (
        <div className="space-y-4">
          <label className="block text-lg font-medium mb-2">
            How was our food temperature and freshness?
          </label>
          {[
            "Nice and Tasty",
            "Packaging was good",
            "Safely Delivered",
            "Could be better",
            "Not Delivered Properly",
          ].map((option) => (
            <div key={option} className="flex items-center">
              <input
                type="checkbox"
                name="foodQuality"
                value={option}
                checked={formData.foodQuality.includes(option)}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({
                    ...formData,
                    foodQuality: formData.foodQuality.includes(value)
                      ? formData.foodQuality.filter((item) => item !== value)
                      : [...formData.foodQuality, value],
                  });
                }}
                className="mr-2"
              />
              <span>{option}</span>
            </div>
          ))}
        </div>
      ),
    },
    // Screen 3: Overall Satisfaction
    {
      title: "Overall Satisfaction",
      buttonText: "Complete",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2">
              Overall feedback
            </label>
            <textarea
              value={formData.overallFeedback}
              onChange={(e) =>
                setFormData({ ...formData, overallFeedback: e.target.value })
              }
              placeholder="Share your thoughts..."
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <p className="text-lg text-center text-green-600">
            Thanks for Ordering
          </p>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentScreen === 0 && !formData.speedOfService) {
      alert("Speed of Service rating is required!");
      return;
    }
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Handle form submission here
      console.log("Form submitted:", formData);
      alert("Thank you for your feedback!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">
          {screens[currentScreen].title}
        </h1>
        {screens[currentScreen].content}
        <button
          onClick={handleNext}
          className="mt-6 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
        >
          {screens[currentScreen].buttonText}
        </button>
      </div>
    </div>
  );
}