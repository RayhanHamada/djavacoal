"use client";

import { FloatingWhatsApp } from "@dxkit-org/react-floating-whatsapp";

export function WhatsappWidget() {
    const text = `Hi How Are you.🙋🏻‍♂️

We are from Djavacoal Indonesia 🇮🇩

Lets Discuss with our team on whatsapp!`;

    return (
        <FloatingWhatsApp
            phoneNumber={process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}
            accountName={process.env.NEXT_PUBLIC_WHATSAPP_NAME}
            statusMessage="Typically replies within a few hours"
            avatar="/images/yoga-wa.png"
            chatMessage={text}
            chatboxHeight={500}
        />
    );
}
