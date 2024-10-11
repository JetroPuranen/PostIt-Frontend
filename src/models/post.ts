export interface Post {
    id: string;
    userId: string;
    caption: string;
    comments: string[];
    likeCount: number;
    whoHasLiked: string[];
    imageData: string; 
}
