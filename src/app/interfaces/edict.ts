export interface Edict {
    edictId?: string;
    companyId: string;
    title: string;
    content: string;
    createdAt: Date;
    profilesApplied?: string[];
}