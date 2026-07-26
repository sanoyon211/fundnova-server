import { User, IUserDocument } from '../models/user.model.js';
import { RegisterInput, LoginInput } from '../validators/auth.validator.js';
import { AppError } from '../errors/app-error.js';
import { generateToken } from '../utils/jwt.util.js';
import { sendWelcomeEmail } from '../utils/email.js';

export class AuthService {
  static async register(input: RegisterInput) {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new AppError('Email address is already registered', 400);
    }

    // Default Credits allocation: Supporter = 50 credits, Creator = 20 credits
    let initialCredits = 50;
    if (input.role === 'creator') {
      initialCredits = 20;
    } else if (input.role === 'admin') {
      initialCredits = 1000;
    }

    const newUser = await User.create({
      name: input.name,
      email: input.email.toLowerCase(),
      password: input.password,
      photoUrl: input.photoUrl,
      role: input.role,
      credits: initialCredits,
      raisedCredits: 0,
    });

    // Trigger Welcome Email asynchronously (non-blocking)
    sendWelcomeEmail(newUser.email, newUser.name).catch((err) => {
      console.warn('[Email non-blocking error]:', err);
    });

    const token = generateToken({
      userId: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
    });

    const userObject = newUser.toObject();
    delete userObject.password;

    return { user: userObject, token };
  }

  static async login(input: LoginInput) {
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userObject = user.toObject();
    delete userObject.password;

    return { user: userObject, token };
  }

  static async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User profile not found', 404);
    }
    return user;
  }
}
