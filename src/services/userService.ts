import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { Op } from 'sequelize';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { validateEmail, validatePassword } from '../utils/validation';

type JwtPayload = {
  userId: number | string;
  email: string;
  iat?: number;
  exp?: number;
};

type SignupResult = {
  message: string;
  user: any;
  token: string;
};

type LoginResult = {
  message: string;
  user: any;
  token: string;
};

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? 'change_this_secret_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '7d'; // e.g. '1h', '7d'

export function signJwt(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as SignOptions);
}

export function verifyJwt(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (err) {
    throw new AuthenticationError('Invalid or expired token');
  }
}

export async function signupUser(
  name: string,
  email: string,
  password: string
): Promise<SignupResult> {
  if (!name || !email || !password) {
    throw new UserInputError('name, email and password are required');
  }

  validateEmail(email);
  validatePassword(password);

  const existing = await User.findOne({
    where: { email: { [Op.iLike]: email.trim() } },
  });
  if (existing) {
    throw new UserInputError('Email already in use');
  }

  const created = await User.create({
    name: name.trim(),
    email: email.trim(),
    password,
  } as any);

  const userSafe =
    (created as any).toJSON?.() ??
    (created.get ? created.get({ plain: true }) : created);

  const token = signJwt({ userId: userSafe.id, email: userSafe.email });

  return {
    message: 'Signup successful',
    user: userSafe,
    token,
  };
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  if (!email || !password) {
    throw new UserInputError('email and password are required');
  }

  const user = await User.findOne({
    where: { email: { [Op.iLike]: email.trim() } },
  });

  if (!user) {
    throw new AuthenticationError('Invalid email or password');
  }

  const passwordMatches = await bcrypt.compare(password, (user as any).password);

  if (!passwordMatches) {
    throw new AuthenticationError('Invalid email or password');
  }

  const userSafe =
    (user as any).toJSON?.() ??
    (user.get ? user.get({ plain: true }) : user);

  const token = signJwt({ userId: userSafe.id, email: userSafe.email });

  return {
    message: 'Login successful',
    user: userSafe,
    token,
  };
}

export async function getUserById(id: number | string): Promise<any | null> {
  const user = await User.findByPk(id);
  if (!user) return null;
  return (user as any).toJSON?.() ??
    (user.get ? user.get({ plain: true }) : user);
}

const userService = {
  signupUser,
  loginUser,
  getUserById,
  signJwt,
  verifyJwt,
};

export default userService;
