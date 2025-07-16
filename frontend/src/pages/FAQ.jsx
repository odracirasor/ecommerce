import React from "react";

const FAQ = () => (
  <div className="p-6 max-w-3xl mx-auto">
    <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
    <ul className="space-y-4">
      <li>
        <strong>How do I place an order?</strong><br />
        Add items to your cart and go to checkout.
      </li>
      <li>
        <strong>Do you accept credit cards?</strong><br />
        Not yet! Payment integration coming soon.
      </li>
      <li>
        <strong>How do I track my order?</strong><br />
        Order tracking will be available in your account section.
      </li>
    </ul>
  </div>
);

export default FAQ;
