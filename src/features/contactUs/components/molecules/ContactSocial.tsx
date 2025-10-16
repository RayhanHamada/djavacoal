import React from "react";
import { SocialButton } from "../atoms/SocialButton";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

export const ContactSocial = () => (
  <div className="flex gap-3 justify-start md:justify-start">
    <SocialButton href="#" icon={<FaFacebookF />} />
    <SocialButton href="#" icon={<FaInstagram />} />
    <SocialButton href="#" icon={<FaLinkedinIn />} />
  </div>
);
