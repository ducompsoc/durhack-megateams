import { Request, Response } from "express";

import { requireUserIsAdmin } from "@server/common/decorators";
import Area from "@server/database/area";
import Megateam from "@server/database/megateam";

class AreaHandlers {
  @requireUserIsAdmin
  async getAreas(req: Request, res: Response) {
    const result = await Megateam.findAll({
      include: [Area],
    });

    res.json({
      status: 200,
      message: "OK",
      megateams: result,
    });
  }
}

const handlersInstance = new AreaHandlers();
export default handlersInstance;
