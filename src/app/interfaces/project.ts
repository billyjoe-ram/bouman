export interface Project {
    ownerId: string | undefined;
    docId?: string | undefined;
    title: string;
    content: string;
    createdAt: Date;
}
