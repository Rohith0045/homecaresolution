import React from 'react';
import { AdminOrder } from '@/lib/admin';

interface InvoiceProps {
  order: AdminOrder;
}

const Invoice: React.FC<InvoiceProps> = ({ order }) => {
  const invoiceDate = new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto text-black font-body">
      {/* Invoice Header */}
      <div className="flex justify-between items-start border-b border-gray-200 pb-8 mb-8">
        <div>
          <h1 className="text-4xl font-display font-bold text-forest mb-2">INVOICE</h1>
          <p className="text-sm text-gray-500">Order ID: <span className="font-mono text-gray-800">{order.orderID}</span></p>
          <p className="text-sm text-gray-500">Date: <span className="text-gray-800">{invoiceDate}</span></p>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-2 mb-2">
            {/* Simple Leaf Logo placeholder for Print */}
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center -webkit-print-color-adjust text-white">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
            </div>
            <h2 className="text-xl font-display font-bold text-forest -webkit-print-color-adjust">Home Care Harmony</h2>
          </div>
          <p className="text-sm text-gray-600">123 Eco-Friendly Lane</p>
          <p className="text-sm text-gray-600">Green City, Earth 10001</p>
          <p className="text-sm text-gray-600">contact@homecareharmony.com</p>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-md font-bold text-gray-800 uppercase tracking-wider mb-3">Bill To:</h3>
        <p className="font-semibold text-lg text-gray-900">{order.customerName}</p>
        <p className="text-gray-600">{order.address.street}</p>
        <p className="text-gray-600">{order.address.city}, {order.address.state} - {order.address.pincode}</p>
        <p className="text-gray-600 mt-1">Email: {order.customerEmail}</p>
        <p className="text-gray-600">Phone: {order.address.phone}</p>
      </div>

      {/* Items Table */}
      <table className="w-full text-left border-collapse mb-8">
        <thead>
          <tr className="border-b-2 border-gray-300 text-gray-800">
            <th className="py-3 px-2 font-bold uppercase text-sm">Item Description</th>
            <th className="py-3 px-2 font-bold uppercase text-sm text-center">Qty</th>
            <th className="py-3 px-2 font-bold uppercase text-sm text-right">Price</th>
            <th className="py-3 px-2 font-bold uppercase text-sm text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-200">
              <td className="py-4 px-2 text-gray-800">{item.name}</td>
              <td className="py-4 px-2 text-gray-800 text-center">{item.quantity}</td>
              <td className="py-4 px-2 text-gray-800 text-right">₹{item.price.toFixed(2)}</td>
              <td className="py-4 px-2 text-gray-800 text-right font-medium">₹{(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal:</span>
            <span>₹{order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping:</span>
            <span>{order.shippingCost === 0 ? 'Free' : `₹${order.shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-gray-800 font-bold text-lg pt-3 border-t border-gray-300">
            <span>Total:</span>
            <span className="text-forest">₹{order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 pt-8 grid grid-cols-2 gap-8 text-sm text-gray-500">
        <div>
          <p className="font-bold text-gray-700 mb-1">Payment Method</p>
          <p className="uppercase">{order.paymentMethod}</p>
          {order.upiTransactionId && (
            <p>Transaction ID: <span className="font-mono">{order.upiTransactionId}</span></p>
          )}
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-700 mb-1">Thank you for your business!</p>
          <p>For any inquiries regarding this invoice, please contact us.</p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
