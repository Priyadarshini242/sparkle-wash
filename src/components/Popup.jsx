import React from "react";

export default function Popup({
  isOpen,
  setIsOpen,
  completWash,
  setCompletWash,
  markWashCompleted,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel'
}) {

  const handleConfirm = async () => {
    try {
      if (onConfirm && typeof onConfirm === 'function') {
        await onConfirm();
      } else if (markWashCompleted && completWash) {
        // default behaviour: mark both exterior+interior
        await markWashCompleted(completWash, 'both');
      }
    } catch (err) {
      console.error('Popup confirm action failed', err);
    } finally {
      setIsOpen(false);
      if (setCompletWash) setCompletWash(null);
    }
  };

  return (
    <div>
      {isOpen === true && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6 relative animate-fadeIn">
            <h2 className="text-xl font-semibold mb-2 text-start">{title || 'Please Confirm'}</h2>
            <p className="text-gray-600 mb-4 text-start">{message || 'Are you sure?'}</p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                {cancelLabel}
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {confirmLabel}
              </button>
            </div>

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
