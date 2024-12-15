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

  export interface FollowerFollowingData {
    userId: string;
    username: string;
  }
  
  export interface UserDetailData {
    userId: string;
    username?: string;
    firstName?: string;
    surName?: string;
    emailAddress?: string;
    homeAddress?: string;
    birthDay?: Date | string;
    profilePictureUrl?: string;
    followers?: FollowerFollowingData[]; 
    following?: FollowerFollowingData[]; 
  }