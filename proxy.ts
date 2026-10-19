import { auth } from "./auth";

export default function proxy(req: any, event: any) {
  return auth(req, event);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
