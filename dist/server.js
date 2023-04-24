import dotenv from "dotenv";
import { addMailListener } from "./mail/mail.js";
dotenv.config();

console.log(process.env.EMAIL_PASSWORD);
addMailListener(process.env.EMAIL_ADDRESS || "", process.env.EMAIL_PASSWORD || "");
//# sourceMappingURL=server.js.map