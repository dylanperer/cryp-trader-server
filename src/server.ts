import dotenv from "dotenv";
import { addMailListener } from './mail/mail';

dotenv.config();

addMailListener(
  process.env.EMAIL_ADDRESS || "",
  process.env.EMAIL_PASSWORD || ""
);
