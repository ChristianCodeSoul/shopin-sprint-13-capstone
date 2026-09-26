const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});
const chatWithAI = async (req, res) => {
    try {
        const {
            message,
            products = [],
            conversation = [],
        } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: "Message is required",
            });
        }
        const productContext = products
            .map(
                (product) =>
                    `- ${product.title} | Category: ${product.category} | Price: Rs. ${product.price} | Stock: ${product.stock}`)
            .join("\n");

        const conversationContext = conversation
            .map(
                (item) =>
                    `${item.role === "user" ? "Customer" : "ShopIn AI"}: ${item.content}`)
            .join("\n");

        const prompt = `
You are ShopIn AI, the friendly shopping assistant for an ecommerce website called ShopIn.

Your personality:
- Helpful
- Natural
- Concise
- Friendly
- Human-like
- Never overly robotic
- Do not repeatedly say "As an AI"

Your job is to help customers discover and understand products.

IMPORTANT:
You are a shopping assistant, not the actual checkout system.

You may:
- Recommend products
- Explain products
- Compare products
- Tell customers prices
- Tell customers stock availability
- Guide customers toward purchasing

You must NOT claim that an order has been placed.
You must NOT invent an order ID.
You must NOT claim that payment has been completed.

Current ShopIn product catalog:

${productContext || "No product catalog was provided."}

Previous conversation:

${conversationContext || "No previous conversation."}

Latest customer message:

${message}

Instructions:
- Use the previous conversation to understand short follow-up messages such as "yeah", "that one", "I want it", "tell me more", or "I wanna place".
- If the customer says they want to place an order, explain that they can add the product to their cart and proceed to checkout.
- If you know which product they are referring to from the conversation, mention that product.
- Never invent products, prices, stock numbers, or specifications.
- Keep responses reasonably short.
`;

        let response;

        try {
            response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: prompt,
            });
        } catch (error) {
            if (error?.status !== 503) {
                throw error;
            }
            console.log(
                "Gemini 3.6 Flash unavailable. Trying fallback model..."
            );

            response = await ai.models.generateContent({
                model: "gemini-3.5-flash",
                contents: prompt,
            });
        }

        return res.status(200).json({
            success: true,
            message: response.text,
        });


    } catch (error) {
        console.error("Gemini error:", error);

        console.error(
            "Gemini error message:",
            error?.message
        );

        console.error(
            "Gemini error status:",
            error?.status
        );

        return res.status(500).json({
            success: false,
            message: "ShopIn AI is temporarily unavailable.",
        });
    }

};

module.exports = {
    chatWithAI,
};