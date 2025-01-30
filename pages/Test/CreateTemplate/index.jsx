import { useState } from 'react';

export default function TreeFlowVisualization() {
  // State to manage the current template and its children
  const [currentTemplate, setCurrentTemplate] = useState({
    id: 1,
    header: 'Welcome!',
    body: 'Hi {name}, welcome to our service. How can we assist you today?',
    buttons: [
      {
        text: 'Order Confirmation',
        action: 'template',
        value: 2,
        description: 'Clicking this button will show the Order Confirmation template.',
      },
      {
        text: 'Promo Alert',
        action: 'template',
        value: 3,
        description: 'Clicking this button will show the Promo Alert template.',
      },
    ],
  });

  // List of all templates
  const templates = [
    {
      id: 1,
      header: 'Welcome!',
      body: 'Hi {name}, welcome to our service. How can we assist you today?',
      buttons: [
        {
          text: 'Order Confirmation',
          action: 'template',
          value: 2,
          description: 'Clicking this button will show the Order Confirmation template.',
        },
        {
          text: 'Promo Alert',
          action: 'template',
          value: 3,
          description: 'Clicking this button will show the Promo Alert template.',
        },
      ],
    },
    {
      id: 2,
      header: 'Order Confirmation',
      body: 'Hello {name}, your order #{orderId} has been confirmed. Track your order here.',
      buttons: [
        {
          text: 'Track Order',
          action: 'url',
          value: 'https://example.com/track',
          description: 'Clicking this button will take you to the order tracking page.',
        },
        {
          text: 'Contact Support',
          action: 'message',
          value: 'Support: Call us at +1234567890.',
          description: 'Clicking this button will show our support contact information.',
        },
      ],
    },
    {
      id: 3,
      header: 'Promo Alert',
      body: 'Hey {name}, we have a special offer for you! Use code PROMO20 for 20% off.',
      buttons: [
        {
          text: 'Shop Now',
          action: 'url',
          value: 'https://example.com/shop',
          description: 'Clicking this button will take you to our online store.',
        },
        {
          text: 'Copy Code',
          action: 'copy',
          value: 'PROMO20',
          description: 'Clicking this button will copy the promo code to your clipboard.',
        },
      ],
    },
  ];

  // Function to handle button actions
  const handleButtonAction = (action, value) => {
    switch (action) {
      case 'url':
        window.open(value, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(value);
        alert('Copied to clipboard: ' + value);
        break;
      case 'message':
        alert(value);
        break;
      case 'template':
        const nextTemplate = templates.find((t) => t.id === value);
        if (nextTemplate) {
          setCurrentTemplate(nextTemplate);
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Tree Flow Visualization</h1>

        {/* Current Template */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 mb-8">
          {/* Template Header */}
          <h2 className="text-xl font-semibold mb-2">{currentTemplate.header}</h2>

          {/* Template Body */}
          <p className="text-gray-600 mb-4">{currentTemplate.body}</p>

          {/* Template Buttons */}
          <div className="space-y-4">
            {currentTemplate.buttons.map((button, index) => (
              <div key={index} className="flex flex-col items-start">
                {/* Button */}
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => handleButtonAction(button.action, button.value)}
                >
                  {button.text}
                </button>

                {/* Flowchart Line and Description */}
                <div className="mt-2 flex items-center">
                  <div className="w-4 h-0.5 bg-gray-400 mr-2"></div>
                  <span className="text-sm text-gray-600">{button.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button (to navigate to the parent template) */}
        {currentTemplate.id !== 1 && (
          <div className="flex justify-center mt-8">
            <button
              className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors duration-300"
              onClick={() => setCurrentTemplate(templates[0])}
            >
              Back to Welcome
            </button>
          </div>
        )}
      </div>
    </div>
  );
}