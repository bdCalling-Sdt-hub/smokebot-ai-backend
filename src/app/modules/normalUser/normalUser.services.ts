import { INormalUser } from './normalUser.interface';
import { NormalUser } from './normalUser.model';

const createUser = async (payload: INormalUser) => {
    const result = await NormalUser.create(payload);
    return result;
};

const NormalUserService = {
    createUser,
};

export default NormalUserService;
