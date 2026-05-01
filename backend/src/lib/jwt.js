import jwt, { } from 'jsonwebtoken';
import process from 'node:process';

const JWT_SECRET = process.env.JWT_SECRET;

export function signToken(payload) {
  const options = { expiresIn: `7d` };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token) {
  try {
    const options = {};
    return jwt.verify(token, JWT_SECRET, options);
  } catch (error) {
    console.log(error);
    return null;
  }
}