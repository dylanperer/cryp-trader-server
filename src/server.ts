import dotenv from "dotenv";
import { addMailListener } from "./mail/mail.js";

dotenv.config();

addMailListener(
  process.env.EMAIL_ADDRESS || "",
  process.env.EMAIL_PASSWORD || ""
);
