import { z } from "zod";

const subscribe = z.object({
    body: z.object({
        email: z.string().email({ message: 'Invalid email address' }),
    })

});
const updateSubscribeStatus = z.object({
    body: z.object({
        isBlock: z.boolean(),
    }).partial()
        .refine((data) => Object.keys(data).length > 0, {
            message: "At least one field must be provided for update",
        })
});

export const SubscribeValidations = {
    subscribe,
    updateSubscribeStatus,
}