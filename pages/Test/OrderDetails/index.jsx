"use client";
import React from "react";
import { useEffect, useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  Row,
  Col,
  Button,
  Input,
} from "reactstrap";

const OrderDetailsModal = ({ isOpen, toggle, Data }) => {
  let parsedItems = [];
  useEffect(() => {
    if (Data) {
      console.log(Data);
    }
  });
  try {
    ;
    const items = JSON.parse(Data[0].items || "[]");
    parsedItems = items.map((item, index) => ({
      Name: item.ItemName || "-",
      CurrencyName: item.CurrencyName ,
      Modifiers: item.Modifiers || [],
      Price: parseFloat(item.Price || 0).toFixed(3),
    }));
  } catch (err) {
    console.error("Failed to parse items:", err);
  }

  return (
    <Modal isOpen={isOpen} toggle={toggle} fade={false} size="lg" centered>
      <ModalHeader toggle={toggle} className="bg-gray-500 text-white">
        <div className="d-flex justify-content-between w-100">
          <h5 className="mb-0">Purchase Order</h5>
        </div>
      </ModalHeader>

      <ModalBody className="max-h-[80vh] overflow-auto">
        {/* PO Info */}
        <Row className="border-bottom pb-3 mb-3">
          <h6 className="bg-gray-300 p-2 fw-bold">Order Information</h6>
          <Col md={6}>
            <p>
              <strong>Order Id:</strong> {Data[0].orderId}
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <p>
              <strong>Date:</strong> {Data[0].orderDate}
            </p>
          </Col>
          <Row className="mt-4">
          <Col md={12} className=" mt-md-0">
            <Table bordered responsive size="sm" >
              <tbody>
                <tr>
                  <td>
                    <strong>Sub Total</strong>
                  </td>
                  <td className="text-end">{Data[0].currencyName} {Data[0].subtotal}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Discount</strong>
                  </td>
                  <td className="text-end">{Data[0].currencyName} {Data[0].discount}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Delivery Charges</strong>
                  </td>
                  <td className="text-end">{Data[0].currencyName} {Data[0].deliveryCharges}</td>
                </tr>
                <tr className="fw-bold">
                  <td>
                    <strong>Grand Total</strong>
                  </td>
                  <td className="text-end">{Data[0].currencyName} {Data[0].total}</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        </Row>

        {/* Vendor and Shipping Info */}
        <Row className="border-bottom pb-3 mb-3">
          <Col md={6}>
            <h6 className="bg-gray-300 p-2 fw-bold">Customer Information</h6>
            <p>
              <strong>Name:</strong> {Data[0].name}
            </p>
            <p>
              <strong>Contact:</strong> {Data[0].phoneNumber}
            </p>
          </Col>
          <Col md={6}>
            <h6 className="bg-gray-300 p-2 fw-bold">Address</h6>
            <p>
              <strong>Block:</strong> {Data[0].block}
            </p>
            <p>
              <strong>Street:</strong> {Data[0].street}
            </p>
            <p>
              <strong>Floor:</strong> {Data[0].floor}
            </p>
            <p>
              <strong>Direction:</strong> {Data[0].direction}
            </p>
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
                {/* Main Item Row */}
                <tr className="bg-gray-100 font-bold text-lg">
                  <td>{item.Name}</td>
                  <th>{item.CurrencyName} {item.Price}</th>
                </tr>
                {/* Modifier Rows */}
                {item.Modifiers?.map((mod, modIndex) => (
                  <tr key={`${index}-${modIndex}`}>
                    <td className="ps-8 text-sm text-gray-700">
                      ↳ {mod.ItemName}
                    </td>
                    <td className="text-sm text-gray-600">
                      {mod.CurrencyName} {mod.Price}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
        {/* Comments and Totals */}
        
      </ModalBody>
    </Modal>
  );
};

export default OrderDetailsModal;
