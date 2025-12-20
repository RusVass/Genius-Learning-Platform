import bcrypt from 'bcryptjs';

export async function hashPasswordHook() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
}

