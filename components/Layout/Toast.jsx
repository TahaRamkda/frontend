import React, { useState } from 'react'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { useRecoilState } from 'recoil'
import { toastState } from '../../atoms'

function PlacementMultiExample() {
    const [toast, setToast] = useRecoilState(toastState)

    const getToastClassName = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-300'
            case 'error':
                return 'bg-red-100 text-red-800 border-red-300'
            case 'warning':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'info':
                return 'bg-blue-100 text-blue-800 border-blue-300'
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }

    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast
                autohide
                delay={3000}
                onClose={() => setToast({ text: null, type: null })}
                show={toast.text}
                className="border-2"
            >
                <Toast.Body className={getToastClassName(toast.type)}>
                    {toast.text || 'An error occurred'}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default PlacementMultiExample
