import React from "react";

export default function Popup({isOpen, setIsOpen, completWash, setCompletWash, markWashCompleted}) {

    console.log("Is Open", isOpen);

    const handleSubmit = (customerId, washType) => {
        markWashCompleted(customerId, washType);
        setIsOpen(false);
        setCompletWash(null);
    } 

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {/* Button to open popup */}

      {/* Overlay */}
      {isOpen === true && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          {/* Popup container */}
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6 relative animate-fadeIn">
            <h2 className="text-xl font-semibold mb-2 text-start">Please Confirm</h2>
            <p className="text-gray-600 mb-4 text-start">
                Wash Completion will be marked as Both Exterior and Interior. Are you sure?
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSubmit(completWash, 'both');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>

            {/* Close (X) button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
