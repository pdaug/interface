import { customAlphabet } from "nanoid";

export const GenerateId = customAlphabet("abcdef1234567890", 10);

export const GenerateIdWithLength = customAlphabet("abcdef1234567890");
