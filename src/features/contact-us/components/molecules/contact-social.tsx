import React from "react";

import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

import { SocialButton } from "../atoms/social-button";

export const ContactSocial = () => (
    <div className="flex justify-start gap-3 md:justify-start">
        <SocialButton href="#" icon={<FaFacebookF />} />
        <SocialButton href="#" icon={<FaInstagram />} />
        <SocialButton href="#" icon={<FaLinkedinIn />} />
    </div>
);
