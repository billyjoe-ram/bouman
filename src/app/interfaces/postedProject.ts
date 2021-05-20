export interface PostedProject {
    title: string,
    content: string,
    profileId: string | undefined,
    likes: string[],
    publishedAt: Date,
    projectId?: string
    keywords: string[]
}