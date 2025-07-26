import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { randomBytes } from 'crypto';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  // Create a new user account
  async signUp(signUpDto: SignUpDto): Promise<any> {
    try {
      const { email, password, firstName, lastName } = signUpDto;

      // Prevent duplicate emails
      const existingUser = await this.userModel.findOne({ email });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      // Save user in DB
      const user = await this.userModel.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      if (!user) throw new InternalServerErrorException('Failed to create user');

      // Generate JWT token
      const token = this.jwtService.sign({ id: user._id, email: user.email });
      
      return {
        message: 'User created successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    } catch (err) {
      console.error('SignUp error:', err);
      if (err.code === 11000) {
        throw new ConflictException('User with this email already exists');
      }
      throw new InternalServerErrorException(err?.message || 'Internal server error');
    }
  }

  // Validate user login and return token
  async login(loginDto: LoginDto): Promise<{ token: string; user: any }> {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ id: user._id, email: user.email });

    console.log('User logged in successfully:', user.email);

    return {
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  }

  // Reset password with token from email link
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });
    if (!user) throw new BadRequestException('Invalid or expired token');

    user.password = await bcrypt.hash(newPassword, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return { message: 'Password reset successfully' };
  }

  // Send password reset email with unique token
  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      return { message: 'If the email exists, reset instructions have been sent' };
    }

    const token = randomBytes(32).toString('hex');

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600_000); // 1 hour expiry
    await user.save();

    const resetLink = `http://localhost:4200/reset-password?token=${token}`;

    // Configure email sender
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email with reset link
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click below to reset your password (link expires in 1 hour):</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    return { message: 'If the email exists, reset instructions have been sent' };
  }

  // Used internally for strategies
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userModel.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  // Fetch user by ID (exclude password field)
  async findById(id: string): Promise<User> {
    return this.userModel.findById(id).select('-password');
  }
}
