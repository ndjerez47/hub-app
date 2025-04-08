import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { User } from "@/app/types/user";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthRequest extends NextRequest {
  user?: Omit<User, 'password'>;
}

export async function verifyAuth(
  request: NextRequest,
  allowedRoles?: User['role'][]
) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return {
        success: false,
        error: 'Missing authentication token',
        status: 401,
      };
    }

    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    const user = verified.payload as Omit<User, 'password'>;

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return {
        success: false,
        error: 'Insufficient permissions',
        status: 403,
      };
    }

    return {
      success: true,
      user,
    };
  } catch (error) {
    console.error('Auth error:', error);
    return {
      success: false,
      error: 'Invalid token',
      status: 401,
    };
  }
}

export async function withAuth(
  handler: (req: AuthRequest) => Promise<NextResponse>,
  allowedRoles?: User['role'][]
) {
  return async function(request: NextRequest) {
    const auth = await verifyAuth(request, allowedRoles);

    if (!auth.success) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      );
    }

    // Attach user to request for use in handler
    (request as AuthRequest).user = auth.user;
    
    return handler(request as AuthRequest);
  };
}

// Helper to protect API routes based on role
export function protectRoute(roles?: User['role'][]) {
  return function(handler: (req: AuthRequest) => Promise<NextResponse>) {
    return withAuth(handler, roles);
  };
}