import { ProjectContent } from "./projectContent";

export interface Project {
    ownerId: string | undefined;
    docId?: string | undefined;
    title: string;
    content: ProjectContent;
    createdAt: Date;
}
