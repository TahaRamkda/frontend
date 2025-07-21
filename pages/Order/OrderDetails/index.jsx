"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Row,
  Col,
} from "reactstrap";

const OrderDetailsModal = ({ isOpen, toggle, Data }) => {
  const [parsedItems, setParsedItems] = useState([]);

  useEffect(() => {
    if (Data && Array.isArray(Data) && Data.length > 0) {
      try {
        const items = JSON.parse(Data[0].items || "[]");
        const mapped = items.map((item) => ({
          Name: item.ItemName || "-",
          CurrencyName: item.CurrencyName,
          Modifiers: item.Modifiers || [],
          Price: parseFloat(item.Price || 0).toFixed(3),
        }));
        setParsedItems(mapped);
      } catch (err) {
        console.error("Failed to parse items:", err);
      }
    }
  }, [Data]);

  if (!Data || !Array.isArray(Data) || Data.length === 0) {
    return null; // or return a fallback UI
  }

  const order = Data[0];

  return (
    <Modal isOpen={isOpen} toggle={toggle} fade={false} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gray-500 text-white">
        <div className="d-flex justify-content-between w-100">
          <h5 className="mb-0">Purchase Order</h5>
        </div>
      </ModalHeader>

      <ModalBody className="max-h-[80vh] overflow-auto">
        {/* Order Info */}
        <Row className="border-bottom pb-3 mb-3">
          <h6 className="bg-gray-300 p-2 fw-bold">Order Information</h6>
          <Col md={6}>
            <p><strong>Order Id:</strong> {order.orderId}</p>
          </Col>
          <Col md={6} className="text-md-end">
            <p><strong>Date:</strong> {order.orderDate}</p>
          </Col>
          <Col md={12} className="mt-md-0">
            <Table bordered responsive size="sm">
              <tbody>
                <tr>
                  <td><strong>Sub Total</strong></td>
                  <td className="text-end">{order.currencyName} {order.subtotal}</td>
                </tr>
                <tr>
                  <td><strong>Discount</strong></td>
                  <td className="text-end">{order.currencyName} {order.discount}</td>
                </tr>
                <tr>
                  <td><strong>Delivery Charges</strong></td>
                  <td className="text-end">{order.currencyName} {order.deliveryCharges}</td>
                </tr>
                <tr className="fw-bold">
                  <td><strong>Grand Total</strong></td>
                  <td className="text-end">{order.currencyName} {order.total}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>

        {/* Customer Info */}
        <Row className="border-bottom pb-3 mb-3">
          <Col md={6}>
            <h6 className="bg-gray-300 p-2 fw-bold">Customer Information</h6>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Contact:</strong> {order.phoneNumber}</p>
          </Col>
          <Col md={6}>
            <h6 className="bg-gray-300 p-2 fw-bold">Address</h6>
            <p><strong>Block:</strong> {order.block}</p>
            <p><strong>Street:</strong> {order.street}</p>
            <p><strong>Floor:</strong> {order.floor}</p>
            <p><strong>Direction:</strong> {order.direction}</p>
          </Col>
        </Row>

        {/* Items Table */}
        <Table bordered responsive size="sm">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {parsedItems.map((item, index) => (
              <React.Fragment key={index}>
                <tr className="bg-gray-100 font-bold text-lg">
                  <td>{item.Name}</td>
                  <th>{item.CurrencyName} {item.Price}</th>
                </tr>
                {item.Modifiers.map((mod, modIndex) => (
                  <tr key={`${index}-${modIndex}`}>
                    <td className="ps-8 text-sm text-gray-700">↳ {mod.ItemName}</td>
                    <td className="text-sm text-gray-600">{mod.CurrencyName} {mod.Price}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </ModalBody>
    </Modal>
  );
};

export default OrderDetailsModal;
