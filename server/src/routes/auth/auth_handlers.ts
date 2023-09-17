import { Request, Response } from "express";

import { UserRole } from "@server/common/model_enums";

class AuthHandlers {
  async handleLoginSuccess(request: Request, response: Response) {
    if (!request.user) {
      return response.redirect("/login");
    }

    if (request.user.role !== UserRole.hacker) {
      return response.redirect("/volunteer");
    }

    return response.redirect("/hacker");
  }

  async handleLogout(request: Request, response: Response) {
    request.session.destroy(() => {
      response.status(200);
      response.json({ status: response.statusCode, message: "OK" });
    });
  }
}

const handlersInstance = new AuthHandlers();
export default handlersInstance;
