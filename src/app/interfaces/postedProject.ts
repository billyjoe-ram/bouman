export interface PostedProject {
    content: string,
    profileId: string | undefined,
    likes: string[],
    publishedAt: Date,
    projectId?: string
}