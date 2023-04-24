import dotenv from "dotenv";
import { addMailListener } from "./mail/Mail";

dotenv.config();

addMailListener(
  process.env.EMAIL_ADDRESS || "",
  process.env.EMAIL_PASSWORD || ""
);
