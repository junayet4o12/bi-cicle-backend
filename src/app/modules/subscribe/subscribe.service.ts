import { Types } from 'mongoose';
import { ISubscribe } from './subscribe.interface';
import { Subscribe } from './subscribe.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { sendEmail } from '../../utils/sendEmail';

type TUpdateSubscribe = {
    email: string;
    isBlock: boolean;
};

export const createSubscribeIntoDB = async (subscribeData: ISubscribe) => {
    // 1. Save to database
    // const result = await Subscribe.create(subscribeData);

    // 2. Send HTML email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <h2>🎉 Thank You for Subscribing!</h2>
        <p>Hi there,</p>
        <p>You've successfully subscribed to our newsletter with the email: <strong>${subscribeData.email}</strong>.</p>
        <p>We'll keep you updated with the latest offers and news.</p>
        <br />
        <p>Best Regards,<br/><strong>The Cycle Craze Team</strong></p>
      </div>
    `;

    await sendEmail(subscribeData.email, 'Thanks for Subscribing to Cycle Craze Shop!', htmlContent);

    // return result;
};

const getAllSubscribesFromDB = async (query: Record<string, unknown>) => {
    const subscribeQuery = new QueryBuilder(Subscribe.find(), query).search(['email'])
    const result = await subscribeQuery.modelQuery;
    const meta = await subscribeQuery.countTotal();
    return { meta, result }
};

const getSingleSubscribeFromDB = async (email: string) => {
    const result = await Subscribe.findOne({ email });
    return result;
};

const deleteSubscribeFromDB = async (email: string) => {
    const result = await Subscribe.findOneAndDelete({ email });
    return result;
};

const updateSubscribeStatusInDB = async ({ email, isBlock }: TUpdateSubscribe) => {
    const result = await Subscribe.findOneAndUpdate(
        { email },
        { isBlock },
        { new: true }
    );
    return result;
};

export const SubscribeService = {
    createSubscribeIntoDB,
    getAllSubscribesFromDB,
    getSingleSubscribeFromDB,
    deleteSubscribeFromDB,
    updateSubscribeStatusInDB,
};
