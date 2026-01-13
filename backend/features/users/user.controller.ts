import { Request, Response, NextFunction } from 'express';
import { UserModel } from './user.model';

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.userId as string | undefined;
    if (!id) return res.status(401).json({ error: 'No user id on request' });

    // find the user in the DB and exclude the password
    const user = await UserModel.findById(id).select('-password').lean();

    if (!user)
      return res.status(404).json({ user: null, message: 'User not found' });

    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

// Admin: get all users
export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const list = await UserModel.find().select('-password').lean();
    res.json({ users: list });
  } catch (err) {
    next(err);
  }
};

// Admin: get user by id
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id).select('-password').lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

export const updateMe = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.userId;
    if (!id) return res.status(401).json({ error: 'Unauthorized' });

    const { name, avatar, preferences } = req.body;

    const updateData: any = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;
    if (preferences) updateData.preferences = preferences;

    const user = await UserModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ error: 'User not found' });

    return res.json({ user });
  } catch (err) {
    next(err);
  }
};

export default { me, getUsers, getUserById, updateMe };
