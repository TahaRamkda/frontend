import React, { useState } from 'react'
import Toast from 'react-bootstrap/Toast'
import ToastContainer from 'react-bootstrap/ToastContainer'
import { useRecoilState } from 'recoil'
import { toastState } from '../../atoms'
function PlacementMultiExample() {
    const [toast, setToast] = useRecoilState(toastState)

    return (
        <ToastContainer position="top-end" className="p-3">
            <Toast
                autohide
                delay={1000}
                onClose={() => setToast({ text: null, type: null })}
                show={toast.text}
            >
                <Toast.Body className="bg-red-300">
                    {toast.text || 'An error occurred'}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}

export default PlacementMultiExample
