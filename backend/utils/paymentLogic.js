// Import necessary modules
import axios from 'axios';
import Payment from '../models/paymentModel.js';

const initiatePayment = async (req, res) => {
  try {
        const { email, amount } = req.body;
        const apiURL = process.env.PAYSTACK_URL;
        
    // Make a POST requEst to the Paystack Initialize Transaction endpoint
      const paystackResponse = await axios.post( apiURL
        ,
        {
          email,
          amount: amount * 100, // Convert amount to kobo
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, // Replace with your actual secret key
          },
        }
      );

    if (paystackResponse.data.status) {
      const { authorization_url } = paystackResponse.data.data;
      const { reference } = paystackResponse.data.data;

      const user = 'test_user'
      const newPayment = new Payment({
        matricNumber: req.body.matricNo,
        email: req.body.email,
        amount: req.body.amount,
        session: req.body.session,
        category: req.body.category,
        user : user,
        transactionReference: reference,
      });

      await newPayment.save();

      res.json({
        success: true,
        message: 'Payments details saved',
        payment_url: authorization_url,
        reference: reference,
      });
    } else {
      res.status(500).json({ error: 'Payment initiation failed' });
    }
  } catch (error) {
    console.error('Error initiating payment:', error);
    res.status(500).json({ error: 'Payment initiation failed' });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const allPayments = await Payment.find({});
    res.json({ allPayments });
  } catch (error) {
    console.error('Error fetching payment records:', error);
    res.status(500).json({ error: 'Failed to fetch payment records' });
  }
};

export { initiatePayment, getAllPayments };
