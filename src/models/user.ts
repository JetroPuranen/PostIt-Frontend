export interface UserRegistrationData {
    username: string;
    password: string;
    firstName: string;
    surName: string;
    emailAddress: string;
    homeAddress: string;
    birthDay: Date;
    profilePicture: File;
  }

export interface UserDetailData {
    userId: string;
    username?: string;
    firstName?: string;
    surName?: string;
    profilePictureUrl?: string;
}