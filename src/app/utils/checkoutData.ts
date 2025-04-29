import config from "../config";

type DataType = {
    totalPrice: number;
    deliveryCharge: number;
    name: string;
    email?: string;
    address: string
}

export const checkoutData = ({
    totalPrice,
    deliveryCharge,
    name,
    email,
    address
}: DataType) => {
    const tran_id = `TRX-${Date.now()}`;
    const backendUrl = config.backend_url
    const data = {
        total_amount: totalPrice + deliveryCharge,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `${backendUrl}/checkout/success/${tran_id}`,
        fail_url: `${backendUrl}/checkout/fail`,
        cancel_url: `${backendUrl}/checkout/cancel`,
        ipn_url: `${backendUrl}/checkout/ipn`,
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: name,
        cus_email: email || 'example@gmail.com',
        cus_add1: address,
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    return data
};