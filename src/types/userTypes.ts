export type UserRegistrationData = {
    fullName: string;
    email: string;
    password: string;
    confirm_password: string;
    phoneNumber: string;
    churchOfUser: string;
}

export type UserLoginData = {
    email: string,
    password: string
}
export type minimalUserResponse = {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    churchOfUser: string;
    role_id: number;
}

export type UserUpdateData = {
    id: string;
    fullName?: string;
    email?: string;
    phoneNumber?: string;
    churchOfUser?: string;   
}

export type DeleteData = {
    UserId: string;
}