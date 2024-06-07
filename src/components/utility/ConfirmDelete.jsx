import React from 'react';

function ConfirmDeleteCard({ onCancel, onDelete,message,logoutMessage}) {
    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-lg w-80">

            {logoutMessage && <h2 className="text-2xl font-bold mb-4 text-white">{logoutMessage}</h2> }
            {!logoutMessage && <h2 className="text-2xl font-bold mb-4 text-white">Confirm Delete</h2>}

            {message && <p className="text-white mb-6">{message}</p>}
            {!message && <p className="text-white mb-6">Are you sure you want to delete this item?</p>}
            <div className="flex justify-end space-x-4">
                <button 
                    onClick={onCancel}
                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500 text-white"
                >
                    Cancel
                </button>
                <button 
                    onClick={onDelete}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-500 text-white"
                >
                    Confirm Delete
                </button>
            </div>
        </div>
    );
}

export default ConfirmDeleteCard;
