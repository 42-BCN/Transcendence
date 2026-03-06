import type { Request, Response } from "express";
import type { UserPublic } from "@contracts/users/users.contracts";
import { findUserById } from "@/users/users.service";

export async function getMeProfile(
	req: Request,
	res: Response<UserPublic>,
  ): Promise<void> {
	const me = await findUserById(req.session.userId)
	res.status(200).json({
	  ok: true,
	  data:  me ,
	});
  }
  