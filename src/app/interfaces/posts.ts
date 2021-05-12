export interface Post {     
    content: string;
    likes: string[];
    postId?: string;
    profileId: string;
    publishedAt?: Date;    
}