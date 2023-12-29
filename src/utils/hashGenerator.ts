import bcrypt from "bcrypt";

export const hashGenerator = async (value: string) => {
    const saltRounds = Number(process.env.SALT!);
    const salt = await bcrypt.genSalt(saltRounds)
    return await bcrypt.hash(value.trim(), salt);
}

export const hashCompare = async (value: string, hash: string) => {
    return await bcrypt.compare(value.trim(), hash);
}